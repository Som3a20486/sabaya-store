import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "حذاء حريمي أبيض",
    price: "900 جنيه",
    image: "/products/shoe.jpg",
  },
  {
    id: 2,
    name: "شنطة حريمي",
    price: "950 جنيه",
    image: "/products/bag.jpg",
  },
  {
    id: 3,
    name: "فستان نسائي",
    price: "1200 جنيه",
    image: "/products/product3.jpg",
  },
  {
    id: 4,
    name: "إكسسوار نسائي",
    price: "650 جنيه",
    image: "/products/product4.jpg",
  },
];

export default function Products() {
  return (
    <section className="bg-pink-50 py-20">
      <h2 className="text-4xl font-bold text-center mb-14">
        أحدث المنتجات
      </h2>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
          />
        ))}
      </div>
    </section>
  );
}