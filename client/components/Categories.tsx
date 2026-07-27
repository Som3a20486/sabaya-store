export default function Categories() {
  const categories = [
    {
      icon: "👗",
      title: "ملابس",
      color: "from-pink-400 to-pink-600",
    },
    {
      icon: "👜",
      title: "شنط",
      color: "from-amber-400 to-orange-500",
    },
    {
      icon: "👠",
      title: "أحذية",
      color: "from-purple-400 to-fuchsia-600",
    },
    {
      icon: "💍",
      title: "إكسسوارات",
      color: "from-cyan-400 to-blue-500",
    },
  ];

  return (
    <section className="py-20 bg-white">

      <h2 className="text-4xl font-bold text-center mb-14">
        تسوقي حسب الفئة
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">

        {categories.map((item) => (
          <div
            key={item.title}
            className={`bg-gradient-to-br ${item.color}
            rounded-3xl h-56
            flex flex-col justify-center items-center
            text-white
            cursor-pointer
            shadow-xl
            hover:scale-110
            hover:-translate-y-3
            duration-500`}
          >

            <div className="text-6xl">
              {item.icon}
            </div>

            <h3 className="text-2xl font-bold mt-5">
              {item.title}
            </h3>

          </div>
        ))}

      </div>

    </section>
  );
}