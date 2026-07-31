"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ShippingLabel from "@/components/ShippingLabel";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

type CartProduct = {
  name: string;
  price: number;
  quantity: number;
  [key: string]: any;
};

type LabelData = {
  orderId: number;
  name: string;
  phone: string;
  governorate: string;
  address: string;
  notes: string;
  products: CartProduct[];
  total: number;
};

const governorates = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "البحر الأحمر",
  "البحيرة",
  "الفيوم",
  "الغربية",
  "الإسماعيلية",
  "كفر الشيخ",
  "مطروح",
  "المنوفية",
  "المنيا",
  "القليوبية",
  "الوادي الجديد",
  "السويس",
  "أسوان",
  "أسيوط",
  "بني سويف",
  "بورسعيد",
  "دمياط",
  "الشرقية",
  "جنوب سيناء",
  "شمال سيناء",
  "سوهاج",
  "قنا",
  "الأقصر",
];

export default function CheckoutPage() {
  const router = useRouter();
  const labelRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [labelData, setLabelData] = useState<LabelData | null>(null);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    try {
      const cart: CartProduct[] = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      const total = cart.reduce(
        (sum: number, item: CartProduct) =>
          sum +
          Number(item.price) * Number(item.quantity),
        0
      );

      setCartTotal(total);
    } catch (error) {
      console.error("❌ CART READ ERROR:", error);
      setCartTotal(0);
    }
  }, []);

  async function createPDF() {
    if (!labelRef.current) {
      console.error("Shipping label element not found");
      return null;
    }

    const canvas = await html2canvas(labelRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [100, 150],
    });

    const width = 100;

    const height =
      (canvas.height * width) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      width,
      height
    );

    return pdf.output("blob");
  }

  async function processShippingLabel(data: LabelData) {
    try {
      console.log("📦 بدء تجهيز البوليصة...");

      const pdfBlob = await createPDF();

      if (!pdfBlob) {
        console.error("❌ لم يتم إنشاء ملف البوليصة");

        toast.error(
          "⚠️ تم تسجيل الطلب ولكن تعذر تجهيز البوليصة"
        );

        router.push("/");
        return;
      }

      console.log("✅ تم إنشاء PDF");

      const fileName = `order-${data.orderId}.pdf`;

      console.log("☁️ بدء رفع البوليصة...");

      const { error: uploadError } =
        await supabase.storage
          .from("shipping-labels")
          .upload(fileName, pdfBlob, {
            contentType: "application/pdf",
            upsert: true,
          });

      if (uploadError) {
        console.error(
          "❌ PDF UPLOAD ERROR:",
          uploadError
        );

        toast.error(
          "⚠️ تم تسجيل الطلب لكن تعذر رفع البوليصة"
        );

        router.push("/");
        return;
      }

      console.log("✅ تم رفع البوليصة بنجاح");

      const { data: urlData } =
        supabase.storage
          .from("shipping-labels")
          .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        console.error(
          "❌ لم يتم الحصول على رابط البوليصة"
        );

        toast.error(
          "⚠️ تم تسجيل الطلب لكن تعذر حفظ رابط البوليصة"
        );

        router.push("/");
        return;
      }

      console.log(
        "🔗 PDF URL:",
        urlData.publicUrl
      );

      const { error: updateError } =
        await supabase
          .from("orders")
          .update({
            shipping_pdf: urlData.publicUrl,
          })
          .eq("id", data.orderId);

      if (updateError) {
        console.error(
          "❌ ORDER PDF UPDATE ERROR:",
          updateError
        );

        toast.error(
          "⚠️ تم تسجيل الطلب لكن تعذر ربط البوليصة"
        );

        router.push("/");
        return;
      }

      console.log("✅ تم ربط البوليصة بالطلب");

      router.push("/");
    } catch (error) {
      console.error(
        "❌ SHIPPING LABEL ERROR:",
        error
      );

      toast.error(
        "⚠️ تم تسجيل الطلب لكن حدث خطأ أثناء تجهيز البوليصة"
      );

      router.push("/");
    }
  }

  async function submitOrder() {
    if (loading) {
      return;
    }

    const cart: CartProduct[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    if (cart.length === 0) {
      toast.error("🛒 السلة فارغة");
      return;
    }

    if (
      !name.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !governorate.trim()
    ) {
      toast.error(
        "⚠️ من فضلك أكمل جميع البيانات"
      );
      return;
    }

    setLoading(true);

    const startTime = performance.now();

    const total = cart.reduce(
      (sum: number, item: CartProduct) => {
        return (
          sum +
          Number(item.price) *
            Number(item.quantity)
        );
      },
      0
    );

    try {
      console.log("🚀 بدء إنشاء الطلب...");

      const {
        data: order,
        error: orderError,
      } = await supabase
        .from("orders")
        .insert({
          customer_name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          governorate: governorate.trim(),
          notes: notes.trim(),
          products: cart,
          total: total,
          status: "جديد",
        })
        .select()
        .single();

      const insertTime = Math.round(
        performance.now() - startTime
      );

      console.log(
        `⏱️ Supabase INSERT: ${insertTime}ms`
      );

      if (orderError || !order) {
        console.error(
          "❌ ORDER ERROR:",
          orderError
        );

        toast.error(
          "❌ حدث خطأ أثناء إنشاء الطلب"
        );

        setLoading(false);
        return;
      }

      console.log(
        "✅ Order created:",
        order.id
      );

      const currentLabelData: LabelData = {
        orderId: order.id,
        name: name.trim(),
        phone: phone.trim(),
        governorate: governorate.trim(),
        address: address.trim(),
        notes: notes.trim(),
        products: cart,
        total: total,
      };

      setLabelData(currentLabelData);

      localStorage.removeItem("cart");

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      toast.success(
        "🎉 تم تأكيد الطلب بنجاح"
      );

      console.log(
        `✅ الطلب تم تأكيده خلال ${insertTime}ms`
      );

      setTimeout(() => {
        processShippingLabel(
          currentLabelData
        );
      }, 100);
    } catch (error) {
      console.error(
        "❌ SUBMIT ORDER ERROR:",
        error
      );

      toast.error(
        "❌ حدث خطأ غير متوقع أثناء إنشاء الطلب"
      );

      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="
        min-h-screen
        bg-linear-to-br
        from-pink-50
        via-white
        to-purple-50
        p-4
        sm:p-6
      "
    >
      {labelData && (
        <div
          className="
            fixed
            left-[-9999px]
            top-0
          "
        >
          <ShippingLabel
            ref={labelRef}
            orderId={labelData.orderId}
            name={labelData.name}
            phone={labelData.phone}
            governorate={labelData.governorate}
            address={labelData.address}
            notes={labelData.notes}
            products={labelData.products}
            total={labelData.total}
          />
        </div>
      )}

      <div
        className="
          max-w-xl
          mx-auto
          bg-white/95
          backdrop-blur-xl
          rounded-4xl
          shadow-[0_20px_60px_rgba(219,39,119,0.12)]
          border
          border-pink-100
          p-5
          sm:p-8
        "
      >
        <div className="text-center mb-8">
          <div
            className="
              inline-flex
              items-center
              justify-center
              w-16
              h-16
              rounded-2xl
              bg-linear-to-br
              from-pink-500
              to-fuchsia-600
              shadow-lg
              shadow-pink-200
              mb-4
            "
          >
            <span className="text-3xl">
              🛍️
            </span>
          </div>

          <h1
            className="
              text-3xl
              sm:text-4xl
              font-black
              bg-linear-to-r
              from-pink-600
              to-fuchsia-600
              bg-clip-text
              text-transparent
            "
          >
            إتمام الطلب
          </h1>

          <p className="text-gray-500 mt-2">
            أدخل بيانات التوصيل لإتمام طلبك 💗
          </p>
        </div>

        <div className="space-y-4">
          <input
            placeholder="الاسم"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            disabled={loading}
            className="
              w-full
              border
              border-gray-200
              bg-gray-50
              p-4
              rounded-2xl
              outline-none
              transition
              focus:bg-white
              focus:border-pink-400
              focus:ring-4
              focus:ring-pink-100
              disabled:opacity-60
            "
          />

          <input
            placeholder="رقم الهاتف"
            type="tel"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            disabled={loading}
            className="
              w-full
              border
              border-gray-200
              bg-gray-50
              p-4
              rounded-2xl
              outline-none
              transition
              focus:bg-white
              focus:border-pink-400
              focus:ring-4
              focus:ring-pink-100
              disabled:opacity-60
            "
          />

          <select
            value={governorate}
            onChange={(e) =>
              setGovernorate(e.target.value)
            }
            disabled={loading}
            className="
              w-full
              border
              border-gray-200
              bg-gray-50
              p-4
              rounded-2xl
              text-gray-800
              outline-none
              transition
              focus:bg-white
              focus:border-pink-400
              focus:ring-4
              focus:ring-pink-100
              disabled:opacity-60
              cursor-pointer
            "
          >
            <option value="">
              اختر المحافظة
            </option>

            {governorates.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <AnimatePresence>
            {governorate && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -15,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="
                  relative
                  overflow-hidden
                  rounded-[1.75rem]
                  border
                  border-pink-200
                  bg-linear-to-br
                  from-pink-50
                  via-white
                  to-fuchsia-50
                  shadow-[0_15px_45px_rgba(219,39,119,0.13)]
                  p-5
                "
              >
                <div
                  className="
                    absolute
                    -top-16
                    -left-16
                    w-32
                    h-32
                    rounded-full
                    bg-pink-200/30
                    blur-2xl
                  "
                />

                <div
                  className="
                    absolute
                    -bottom-16
                    -right-16
                    w-32
                    h-32
                    rounded-full
                    bg-purple-200/30
                    blur-2xl
                  "
                />

                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p
                        className="
                          text-xs
                          font-bold
                          text-pink-500
                          mb-1
                        "
                      >
                        طلبك جاهز تقريبًا ✨
                      </p>

                      <h2
                        className="
                          text-xl
                          font-black
                          text-gray-900
                        "
                      >
                        ملخص طلبك 🧾
                      </h2>
                    </div>

                    <div
                      className="
                        w-11
                        h-11
                        rounded-2xl
                        bg-white
                        shadow-sm
                        border
                        border-pink-100
                        flex
                        items-center
                        justify-center
                        text-xl
                      "
                    >
                      💗
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        bg-white/80
                        rounded-2xl
                        p-4
                        border
                        border-white
                      "
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="
                            w-10
                            h-10
                            rounded-xl
                            bg-pink-100
                            flex
                            items-center
                            justify-center
                          "
                        >
                          🛍️
                        </span>

                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            قيمة المنتجات
                          </p>

                          <p className="text-xs text-gray-400">
                            إجمالي المنتجات في السلة
                          </p>
                        </div>
                      </div>

                      <motion.span
                        key={cartTotal}
                        initial={{
                          scale: 0.8,
                          opacity: 0,
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                        }}
                        className="
                          font-black
                          text-gray-900
                          whitespace-nowrap
                        "
                      >
                        {cartTotal.toLocaleString(
                          "ar-EG"
                        )}{" "}
                        جنيه
                      </motion.span>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        bg-white/80
                        rounded-2xl
                        p-4
                        border
                        border-white
                      "
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="
                            w-10
                            h-10
                            rounded-xl
                            bg-purple-100
                            flex
                            items-center
                            justify-center
                          "
                        >
                          🚚
                        </span>

                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            الشحن
                          </p>

                          <p className="text-xs text-gray-400">
                            يتم تحديده حسب العنوان
                          </p>
                        </div>
                      </div>

                      <span
                        className="
                          font-bold
                          text-purple-600
                          text-sm
                          whitespace-nowrap
                        "
                      >
                        حسب العنوان 📍
                      </span>
                    </div>
                  </div>

                  <div
                    className="
                      h-px
                      bg-linear-to-r
                      from-transparent
                      via-pink-200
                      to-transparent
                      my-5
                    "
                  />

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.15,
                    }}
                    className="
                      rounded-2xl
                      bg-linear-to-r
                      from-pink-600
                      to-fuchsia-600
                      text-white
                      p-5
                      shadow-lg
                      shadow-pink-200
                    "
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-pink-100">
                          الإجمالي الحالي
                        </p>

                        <p className="text-xs text-pink-100/80 mt-1">
                          بدون إضافة تكلفة الشحن حاليًا
                        </p>
                      </div>

                      <div className="text-left">
                        <motion.p
                          key={cartTotal}
                          initial={{
                            scale: 0.85,
                            opacity: 0,
                          }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                          }}
                          className="
                            text-2xl
                            sm:text-3xl
                            font-black
                          "
                        >
                          {cartTotal.toLocaleString(
                            "ar-EG"
                          )}
                        </motion.p>

                        <p className="text-xs text-pink-100">
                          جنيه
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      justify-center
                      gap-2
                      text-xs
                      text-gray-500
                    "
                  >
                    <span>📍</span>

                    <span>
                      المحافظة المختارة:{" "}
                      <strong className="text-pink-600">
                        {governorate}
                      </strong>
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <textarea
            placeholder="العنوان بالتفصيل"
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
            disabled={loading}
            rows={3}
            className="
              w-full
              border
              border-gray-200
              bg-gray-50
              p-4
              rounded-2xl
              outline-none
              transition
              resize-none
              focus:bg-white
              focus:border-pink-400
              focus:ring-4
              focus:ring-pink-100
              disabled:opacity-60
            "
          />

          <textarea
            placeholder="ملاحظات (اختياري)"
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            disabled={loading}
            rows={3}
            className="
              w-full
              border
              border-gray-200
              bg-gray-50
              p-4
              rounded-2xl
              outline-none
              transition
              resize-none
              focus:bg-white
              focus:border-pink-400
              focus:ring-4
              focus:ring-pink-100
              disabled:opacity-60
            "
          />

          <button
            onClick={submitOrder}
            disabled={loading}
            className="
              w-full
              bg-linear-to-r
              from-pink-600
              to-fuchsia-600
              text-white
              py-4
              rounded-2xl
              font-black
              text-lg
              shadow-lg
              shadow-pink-200
              hover:shadow-xl
              hover:shadow-pink-300
              hover:-translate-y-0.5
              active:translate-y-0
              disabled:opacity-60
              disabled:cursor-not-allowed
              transition-all
              duration-200
            "
          >
            {loading
              ? "جاري تأكيد الطلب..."
              : "تأكيد الطلب 🛍️"}
          </button>

          <p className="text-center text-xs text-gray-400 pt-1">
            💗 شكرًا لاختيارك Sabaya Store
          </p>
        </div>
      </div>
    </main>
  );
}