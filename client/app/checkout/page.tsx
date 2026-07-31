"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ShippingLabel from "@/components/ShippingLabel";
import { toast } from "sonner";

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

      const { error: uploadError } = await supabase.storage
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

      const { data: urlData } = supabase.storage
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

      const { error: updateError } = await supabase
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
      className="
        min-h-screen
        bg-gray-50
        p-6
      "
    >
      {labelData && (
        <div
          className="fixed left-[-9999px] top-0"
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
          bg-white
          rounded-3xl
          shadow-xl
          p-8
        "
      >
        <h1
          className="
            text-3xl
            font-black
            text-pink-600
            text-center
            mb-8
          "
        >
          إتمام الطلب 🛍️
        </h1>

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
            p-4
            rounded-xl
            mb-4
          "
        />

        <input
          placeholder="رقم الهاتف"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
          disabled={loading}
          className="
            w-full
            border
            p-4
            rounded-xl
            mb-4
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
    p-4
    rounded-xl
    mb-4
    bg-white
    text-gray-800
    outline-none
    focus:ring-2
    focus:ring-pink-500
  "
>
  <option value="">
    اختر المحافظة
  </option>

  <option value="القاهرة">القاهرة</option>
  <option value="الجيزة">الجيزة</option>
  <option value="الإسكندرية">الإسكندرية</option>
  <option value="الدقهلية">الدقهلية</option>
  <option value="البحر الأحمر">البحر الأحمر</option>
  <option value="البحيرة">البحيرة</option>
  <option value="الفيوم">الفيوم</option>
  <option value="الغربية">الغربية</option>
  <option value="الإسماعيلية">الإسماعيلية</option>
  <option value="كفر الشيخ">كفر الشيخ</option>
  <option value="مطروح">مطروح</option>
  <option value="المنوفية">المنوفية</option>
  <option value="المنيا">المنيا</option>
  <option value="القليوبية">القليوبية</option>
  <option value="الوادي الجديد">الوادي الجديد</option>
  <option value="السويس">السويس</option>
  <option value="أسوان">أسوان</option>
  <option value="أسيوط">أسيوط</option>
  <option value="بني سويف">بني سويف</option>
  <option value="بورسعيد">بورسعيد</option>
  <option value="دمياط">دمياط</option>
  <option value="الشرقية">الشرقية</option>
  <option value="جنوب سيناء">جنوب سيناء</option>
  <option value="شمال سيناء">شمال سيناء</option>
  <option value="سوهاج">سوهاج</option>
  <option value="قنا">قنا</option>
  <option value="الأقصر">الأقصر</option>
</select>

        <textarea
          placeholder="العنوان بالتفصيل"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
          disabled={loading}
          className="
            w-full
            border
            p-4
            rounded-xl
            mb-4
          "
        />

        <textarea
          placeholder="ملاحظات"
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          disabled={loading}
          className="
            w-full
            border
            p-4
            rounded-xl
            mb-6
          "
        />

        <button
          onClick={submitOrder}
          disabled={loading}
          className="
            w-full
            bg-pink-600
            text-white
            py-4
            rounded-xl
            font-bold
            disabled:opacity-60
            disabled:cursor-not-allowed
            transition
          "
        >
          {loading
            ? "جاري تأكيد الطلب..."
            : "تأكيد الطلب"}
        </button>
      </div>
    </main>
  );
}