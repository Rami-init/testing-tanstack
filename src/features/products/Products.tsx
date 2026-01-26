import { Link } from '@tanstack/react-router'
import { Rating } from '@/components/ui/rating'
import { projectsData } from '@/data/productsData'

const Products = () => {
  // const { data, isLoading } = useQuery(fetchProductsQueryOPtions) // Example hook to fetch products
  // if (isLoading) {
  //   return <div>Loading products...</div>
  // }
  return (
    <section className="grid grid-cols-4 gap-2.5">
      {projectsData.map((product: any, index: number) => (
        <ProductCard key={index} product={product} />
      ))}
    </section>
  )
}
export const ProductCard = ({ product }: { product: any }) => {
  return (
    <Link
      to="/products/$id"
      params={{ id: product.asin }}
      key={product.position}
      className="flex flex-col gap-6 p-4"
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full h-42 object-contain"
      />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Rating value={product.rating} readOnly />
          <span className="text-sm text-gray-500">
            ({product.reviews ?? 0}) reviews
          </span>
        </div>
        <h2 className="text-sm text-gray-900">{product.title}</h2>
        <div className="flex items-center gap-2">
          <p className="text-base  font-normal text-heading line-through">
            $
            {product.extracted_price != null
              ? (Number(product.extracted_price) + 78).toFixed(2)
              : product.price}
          </p>
          <p className="text-base font-medium text-blue-600">
            ${product.extracted_price ?? 'N/A'}
          </p>
        </div>
      </div>
    </Link>
  )
}
export default Products
