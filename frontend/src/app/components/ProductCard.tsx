export default function ProductCard({ product }: any) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-bold">{product.name}</h3>
      <p>${product.price}</p>
    </div>
  )
}
