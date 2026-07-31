"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type OrderProduct = {
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
};

type Order = {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  governorate: string;
  notes: string;
  products: OrderProduct[];
  total: number;
  created_at: string;
  status: string | null;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    }

    if (data) {
      setOrders(data as Order[]);
    }

    setLoading(false);
  }

  async function updateStatus(
    id: number,
    status: string
  ) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("حدث خطأ أثناء تحديث الحالة");
      console.error(error);
      return;
    }

    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? { ...order, status }
          : order
      )
    );
  }

  async function removeOrder(id: number) {
    const confirmed = window.confirm(
      "هل تريد حذف الطلب؟"
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (error) {
      alert("فشل حذف الطلب");
      console.error(error);
      return;
    }

    setOrders((current) =>
      current.filter((order) => order.id !== id)
    );

    if (selectedOrder?.id === id) {
      setSelectedOrder(null);
    }

    alert("تم حذف الطلب بنجاح");
  }

  function getStatusClass(status: string | null) {
    if (status === "تم التسليم") {
      return "bg-green-100 text-green-700";
    }

    if (status === "تم الشحن") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "جاري التجهيز") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-pink-100 text-pink-700";
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("ar-EG");
  }

  function printInvoice(order: Order) {
    const printWindow = window.open(
      "",
      "_blank"
    );

    if (!printWindow) {
      alert(
        "المتصفح منع نافذة الطباعة. اسمح بالنوافذ المنبثقة."
      );
      return;
    }

    const products = order.products
      .map((item) => {
        const itemTotal =
          Number(item.price) *
          Number(item.quantity);

        return `
          <tr>
            <td>
              ${item.name}
              ${
                item.selectedSize
                  ? `<br>المقاس: ${item.selectedSize}`
                  : ""
              }
              ${
                item.selectedColor
                  ? `<br>اللون: ${item.selectedColor}`
                  : ""
              }
            </td>

            <td>${item.quantity}</td>

            <td>${Number(item.price)} جنيه</td>

            <td>${itemTotal} جنيه</td>
          </tr>
        `;
      })
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>

      <html lang="ar" dir="rtl">

      <head>

        <meta charset="UTF-8">

        <title>
          بوليصة الطلب #${order.id}
        </title>

        <style>

          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #222;
          }

          .header {
            background: #db2777;
            color: white;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 25px;
          }

          .store {
            font-size: 32px;
            font-weight: bold;
          }

          .number {
            margin-top: 10px;
            font-size: 20px;
          }

          .section {
            border: 1px solid #ddd;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
          }

          .title {
            color: #db2777;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
          }

          .customer {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: right;
          }

          th {
            background: #fce7f3;
          }

          .total {
            display: flex;
            justify-content: space-between;
            background: #fce7f3;
            padding: 20px;
            border-radius: 12px;
            font-size: 24px;
            font-weight: bold;
          }

          .footer {
            text-align: center;
            margin-top: 30px;
            color: #777;
          }

          @media print {
            body {
              padding: 0;
            }
          }

        </style>

      </head>

      <body>

        <div class="header">

          <div class="store">
            Sabaya Store
          </div>

          <div>
            بوليصة شحن
          </div>

          <div class="number">
            رقم البوليصة: #${order.id}
          </div>

        </div>

        <div class="section">

          <div class="title">
            بيانات العميل
          </div>

          <div class="customer">

            <div>
              <strong>الاسم:</strong>
              ${order.customer_name}
            </div>

            <div>
              <strong>الهاتف:</strong>
              ${order.phone}
            </div>

            <div>
              <strong>المحافظة:</strong>
              ${order.governorate}
            </div>

            <div>
              <strong>العنوان:</strong>
              ${order.address}
            </div>

          </div>

        </div>

        <div class="section">

          <div class="title">
            تفاصيل الطلب
          </div>

          <table>

            <thead>

              <tr>
                <th>المنتج</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>الإجمالي</th>
              </tr>

            </thead>

            <tbody>

              ${products}

            </tbody>

          </table>

        </div>

        <div class="total">

          <span>
            إجمالي الطلب
          </span>

          <span>
            ${Number(order.total)} جنيه
          </span>

        </div>

        <div class="section">

          <div>
            <strong>حالة الطلب:</strong>
            ${order.status || "جديد"}
          </div>

          <br>

          <div>
            <strong>تاريخ الطلب:</strong>
            ${formatDate(order.created_at)}
          </div>

          ${
            order.notes
              ? `
                <br>
                <div>
                  <strong>ملاحظات:</strong>
                  ${order.notes}
                </div>
              `
              : ""
          }

        </div>

        <div class="footer">

          <strong>
            شكرًا لتسوقك من Sabaya Store
          </strong>

          <br>

          رقم الطلب: #${order.id}

        </div>

      </body>

      </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  }

  if (loading) {
    return (
      <div className="p-10 text-center">
        جاري تحميل الطلبات...
      </div>
    );
  }

  return (
    <main
      className="min-h-screen bg-gray-50 p-6"
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">

        <h1 className="text-4xl font-bold text-pink-600">
          طلبات Sabaya Store
        </h1>

        <div className="bg-white rounded-2xl shadow px-6 py-3 font-bold">
          عدد الطلبات:{" "}
          <span className="text-pink-600">
            {orders.length}
          </span>
        </div>

      </div>

      {orders.length === 0 ? (

        <div className="bg-white rounded-3xl shadow p-10 text-center">

          <div className="text-6xl mb-4">
            📦
          </div>

          <h2 className="text-2xl font-bold">
            لا يوجد طلبات
          </h2>

          <p className="text-gray-500 mt-2">
            عند وصول طلب جديد سيظهر هنا.
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {orders.map((order) => (

            <div
              key={order.id}
              className="bg-white rounded-3xl shadow p-6"
            >

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

                <div>

                  <h2 className="text-2xl font-bold">
                    طلب #{order.id}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {formatDate(order.created_at)}
                  </p>

                </div>

                <select
                  value={order.status || "جديد"}
                  onChange={(event) =>
                    updateStatus(
                      order.id,
                      event.target.value
                    )
                  }
                  className={
                    "px-4 py-2 rounded-xl font-bold " +
                    getStatusClass(order.status)
                  }
                >

                  <option value="جديد">
                    جديد
                  </option>

                  <option value="جاري التجهيز">
                    جاري التجهيز
                  </option>

                  <option value="تم الشحن">
                    تم الشحن
                  </option>

                  <option value="تم التسليم">
                    تم التسليم
                  </option>

                </select>

              </div>

              <div className="grid md:grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-5">

                <p>
                  العميل:{" "}
                  <strong>
                    {order.customer_name}
                  </strong>
                </p>

                <p>
                  الهاتف:{" "}
                  <strong>
                    {order.phone}
                  </strong>
                </p>

                <p>
                  المحافظة:{" "}
                  <strong>
                    {order.governorate}
                  </strong>
                </p>

                <p>
                  العنوان:{" "}
                  <strong>
                    {order.address}
                  </strong>
                </p>

                {order.notes && (
                  <p className="md:col-span-2">
                    الملاحظات:{" "}
                    <strong>
                      {order.notes}
                    </strong>
                  </p>
                )}

              </div>

              <h3 className="font-bold text-xl mt-6 mb-3">
                المنتجات
              </h3>

              {order.products?.map(
                (item, index) => (

                  <div
                    key={index}
                    className="border rounded-xl p-4 mb-3"
                  >

                    <p className="font-bold">
                      {item.name}
                    </p>

                    <p>
                      الكمية: {item.quantity}
                    </p>

                    <p>
                      السعر: {Number(item.price)} جنيه
                    </p>

                    {item.selectedSize && (
                      <p>
                        المقاس: {item.selectedSize}
                      </p>
                    )}

                    {item.selectedColor && (
                      <p>
                        اللون: {item.selectedColor}
                      </p>
                    )}

                  </div>

                )
              )}

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6">

                <p className="text-2xl font-bold text-pink-600">
                  الإجمالي:{" "}
                  {Number(order.total)} جنيه
                </p>

                <div className="flex gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedOrder(order)
                    }
                    className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-700 transition"
                  >
                    البوليصة
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      removeOrder(order.id)
                    }
                    className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition"
                  >
                    حذف الطلب
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {selectedOrder && (

        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6">

            <div className="flex justify-between items-center border-b pb-5">

              <div>

                <h2 className="text-3xl font-black text-pink-600">
                  Sabaya Store
                </h2>

                <p>
                  بوليصة شحن
                </p>

              </div>

              <div className="border-2 border-pink-600 rounded-xl px-5 py-3 text-center">

                <p className="text-sm">
                  رقم البوليصة
                </p>

                <p className="text-2xl font-black text-pink-600">
                  #{selectedOrder.id}
                </p>

              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-6">

              <div className="border rounded-2xl p-5">

                <h3 className="font-bold text-pink-600 mb-3">
                  بيانات العميل
                </h3>

                <p>
                  الاسم:{" "}
                  {selectedOrder.customer_name}
                </p>

                <p className="mt-2">
                  الهاتف:{" "}
                  {selectedOrder.phone}
                </p>

              </div>

              <div className="border rounded-2xl p-5">

                <h3 className="font-bold text-pink-600 mb-3">
                  عنوان الشحن
                </h3>

                <p>
                  المحافظة:{" "}
                  {selectedOrder.governorate}
                </p>

                <p className="mt-2">
                  العنوان:{" "}
                  {selectedOrder.address}
                </p>

              </div>

            </div>

            <div className="bg-pink-50 rounded-2xl p-5 mt-6">

              <div className="flex justify-between">

                <span className="font-bold">
                  إجمالي الطلب
                </span>

                <span className="font-black text-pink-600">
                  {Number(selectedOrder.total)} جنيه
                </span>

              </div>

            </div>

            <div className="flex justify-center gap-3 mt-8">

              <button
                type="button"
                onClick={() =>
                  printInvoice(selectedOrder)
                }
                className="bg-pink-600 text-white px-8 py-3 rounded-xl font-bold"
              >
                طباعة البوليصة
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold"
              >
                إغلاق
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}