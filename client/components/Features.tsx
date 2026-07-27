import { Truck, ShieldCheck, CreditCard, RotateCcw } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Truck size={40} />,
      title: "شحن سريع",
      text: "توصيل لجميع المحافظات.",
    },
    {
      icon: <ShieldCheck size={40} />,
      title: "جودة مضمونة",
      text: "أفضل الخامات بأفضل الأسعار.",
    },
    {
      icon: <CreditCard size={40} />,
      title: "الدفع عند الاستلام",
      text: "اطلبي الآن وادفعي عند وصول المنتج.",
    },
    {
      icon: <RotateCcw size={40} />,
      title: "استبدال واسترجاع",
      text: "إمكانية الاستبدال خلال 14 يومًا.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-12">
          لماذا تختارين صبايا ستور؟
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((item) => (
            <div
              key={item.title}
              className="bg-pink-50 rounded-3xl p-8 text-center shadow-lg hover:-translate-y-2 hover:shadow-2xl transition"
            >
              <div className="text-pink-600 flex justify-center mb-5">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold">
                {item.title}
              </h3>

              <p className="text-gray-500 mt-3">
                {item.text}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}