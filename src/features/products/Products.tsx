import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import type { Product } from '@/db/schema'
import { Rating } from '@/components/ui/rating'
import { fetchProductsQueryOptions } from '@/data/products'

const Products = () => {
  const { data, isLoading } = useQuery(fetchProductsQueryOptions) // Example hook to fetch products
  if (isLoading) {
    return <div>Loading products...</div>
  }
  return (
    <section className="grid grid-cols-4 gap-2.5">
      {data?.map((product: Product, index: number) => (
        <ProductCard key={index} product={product} />
      ))}
    </section>
  )
}
export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link
      to="/products/$id"
      params={{ id: String(product.id) }}
      key={product.id}
      className="flex flex-col gap-6 p-4"
    >
      <img
        src={product.thumbnail || ''}
        alt={product.title}
        className="w-full h-42 object-contain hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Rating value={Number(product.rating) || 0} readOnly />
          <span className="text-sm text-gray-500">
            ({product.reviewsCounts ?? 0}) reviews
          </span>
        </div>
        <h2 className="text-sm text-gray-900">{product.title}</h2>
        <div className="flex items-center gap-2">
          <p className="text-base  font-normal text-heading line-through">
            $
            {product.extractedPrice != null
              ? (Number(product.extractedPrice) + 78).toFixed(2)
              : product.price}
          </p>
          <p className="text-base font-medium text-blue-600">
            ${product.extractedPrice || product.price}
          </p>
        </div>
      </div>
    </Link>
  )
}
export default Products
