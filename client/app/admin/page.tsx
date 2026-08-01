"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [sales, setSales] = useState(0);
  const [visitorsCount, setVisitorsCount] = useState(0);
  const [onlineVisitors, setOnlineVisitors] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        // =========================
        // عدد المنتجات
        // =========================
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("id");

        if (productsError) {
          console.error("Products error:", productsError);
        }

        if (mounted) {
          setProductsCount(products?.length ?? 0);
        }

        // =========================
        // عدد الطلبات
        // =========================
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("total");

        if (ordersError) {
          console.error("Orders error:", ordersError);
        }

        if (mounted) {
          setOrdersCount(orders?.length ?? 0);
        }

        // =========================
        // إجمالي المبيعات
        // =========================
        const totalSales =
          orders?.reduce((sum, item) => {
            return sum + Number(item.total ?? 0);
          }, 0) ?? 0;

        if (mounted) {
          setSales(totalSales);
        }

        // =========================
        // بداية اليوم
        // =========================
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // =========================
        // زوار اليوم
        // =========================
        const {
          count: visitors,
          error: visitorsError,
        } = await supabase
          .from("site_visitors")
          .select("id", {
            count: "exact",
            head: true,
          })
          .gte("created_at", startOfDay.toISOString());

        if (visitorsError) {
          console.error("Visitors error:", visitorsError);

          if (mounted) {
            setVisitorsCount(0);
          }
        } else if (mounted) {
          setVisitorsCount(visitors ?? 0);
        }

        // =========================
        // المتواجدون الآن
        // =========================
        const onlineLimit = new Date(
          Date.now() - 2 * 60 * 1000
        ).toISOString();

        const {
          count: onlineCount,
          error: onlineError,
        } = await supabase
          .from("site_visitors")
          .select("id", {
            count: "exact",
            head: true,
          })
          .gte("last_seen", onlineLimit);

        if (onlineError) {
          console.error("Online visitors error:", onlineError);

          if (mounted) {
            setOnlineVisitors(0);
          }
        } else if (mounted) {
          setOnlineVisitors(onlineCount ?? 0);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard();
    }, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  function logout() {
    localStorage.removeItem("admin");
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="p-10 text-center">
        جاري تحميل لوحة التحكم...
      </div>
    );
  }

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-gradient-to-br
        from-pink-100
        via-white
        to-purple-200
        p-6
      "
    >
      {/* الخلفية المتحركة */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="
            admin-bg-shape
            admin-bg-animation
            w-96
            h-96
            bg-pink-400
            top-[-120px]
            left-[-120px]
          "
        />

        <div
          className="
            admin-bg-shape
            admin-bg-animation-reverse
            w-[500px]
            h-[500px]
            bg-purple-400
            bottom-[-180px]
            right-[-150px]
          "
        />

        <div
          className="
            admin-bg-shape
            admin-bg-animation
            w-80
            h-80
            bg-blue-400
            top-1/2
            left-1/2
          "
        />
      </div>

      <div className="relative z-10">
        {/* العنوان */}
        <div className="flex justify-between items-center mb-12">
          <h1
            className="
              text-5xl
              font-black
              text-pink-700
            "
          >
            ✦ Sabaya Store Admin ✦
          </h1>

          <button
            onClick={logout}
            className="
              bg-red-600
              text-white
              px-6
              py-3
              rounded-xl
              font-bold
              hover:scale-105
              transition
            "
          >
            تسجيل خروج 🚪
          </button>
        </div>

        {/* الإحصائيات */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* المنتجات */}
          <div
            className="
              bg-white/60
              backdrop-blur-xl
              rounded-3xl
              shadow-xl
              p-8
              border
              border-white
            "
          >
            <p className="text-gray-600 text-lg">
              عدد المنتجات
            </p>

            <h2 className="text-5xl font-bold mt-4">
              {productsCount}
            </h2>
          </div>

          {/* الطلبات */}
          <div
            className="
              bg-white/60
              backdrop-blur-xl
              rounded-3xl
              shadow-xl
              p-8
              border
              border-white
            "
          >
            <p className="text-gray-600 text-lg">
              عدد الطلبات
            </p>

            <h2 className="text-5xl font-bold mt-4">
              {ordersCount}
            </h2>
          </div>

          {/* المبيعات */}
          <div
            className="
              bg-white/60
              backdrop-blur-xl
              rounded-3xl
              shadow-xl
              p-8
              border
              border-white
            "
          >
            <p className="text-gray-600 text-lg">
              إجمالي المبيعات
            </p>

            <h2
              className="
                text-4xl
                font-bold
                mt-4
                text-pink-600
              "
            >
              {sales.toLocaleString("ar-EG")} جنيه
            </h2>
          </div>

          {/* زوار اليوم */}
          <div
            className="
              bg-white/60
              backdrop-blur-xl
              rounded-3xl
              shadow-xl
              p-8
              border
              border-white
            "
          >
            <p className="text-gray-600 text-lg">
              👥 زوار اليوم
            </p>

            <h2
              className="
                text-5xl
                font-bold
                mt-4
                text-purple-600
              "
            >
              {visitorsCount.toLocaleString("ar-EG")}
            </h2>

            <p className="text-gray-500 mt-2">
              زيارة اليوم
            </p>
          </div>

          {/* المتواجدون الآن */}
          <div
            className="
              bg-white/60
              backdrop-blur-xl
              rounded-3xl
              shadow-xl
              p-8
              border
              border-white
            "
          >
            <p className="text-gray-600 text-lg">
              🟢 المتواجدون الآن
            </p>

            <h2
              className="
                text-5xl
                font-bold
                mt-4
                text-green-600
              "
            >
              {onlineVisitors.toLocaleString("ar-EG")}
            </h2>

            <p className="text-gray-500 mt-2">
              متواجد حاليًا
            </p>
          </div>
        </div>

        {/* أزرار الإدارة */}
        <div
          className="
            grid
            md:grid-cols-2
            gap-8
            mt-12
          "
        >
          <Link
            href="/admin/products"
            className="
              bg-black
              text-white
              p-10
              rounded-3xl
              text-center
              text-2xl
              font-bold
              shadow-xl
              hover:scale-105
              transition
            "
          >
            🛍️ إدارة المنتجات
          </Link>

          <Link
            href="/admin/orders"
            className="
              bg-pink-600
              text-white
              p-10
              rounded-3xl
              text-center
              text-2xl
              font-bold
              shadow-xl
              hover:scale-105
              transition
            "
          >
            📦 إدارة الطلبات
          </Link>
        </div>
      </div>
    </main>
  );
}