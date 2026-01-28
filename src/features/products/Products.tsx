import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import type { ProductFilters } from '@/data/products'
import type { Product } from '@/db/schema'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Rating } from '@/components/ui/rating'
import { fetchProductsQueryOptions } from '@/data/products'

type ProductsProps = {
  filters: ProductFilters
}

const Products = ({ filters }: ProductsProps) => {
  const { data, isLoading } = useQuery(fetchProductsQueryOptions(filters))
  const navigate = useNavigate()

  if (isLoading) {
    return <div>Loading products...</div>
  }

  const currentPage = data?.page ?? 1
  const totalPages = data?.totalPages ?? 1

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    navigate({
      to: '/products',
      search: { ...filters, page },
    })
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: Array<number | 'ellipsis'> = []
    const maxVisible = 5

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('ellipsis')
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex flex-col gap-6 justify-between flex-1">
      <section className="grid grid-cols-4 gap-2.5 flex-1">
        {data?.products.map((product: Product, index: number) => (
          <ProductCard key={index} product={product} />
        ))}
      </section>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={
                  currentPage === 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>

            {pageNumbers.map((pageNum, idx) =>
              pageNum === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNum)}
                    isActive={pageNum === currentPage}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
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
