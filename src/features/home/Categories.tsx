import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchCategoriesQueryOPtions } from '@/data/category'

const Categories = () => {
  return (
    <div className="flex flex-col gap-8 py-25 container mx-auto px-4 md:px-8 lg:px-16 items-center justify-center">
      <h1 className="font-bold text-4xl text-heading">
        Newest Collection Available
      </h1>

      <CategoryItem />
    </div>
  )
}
export const CategoryItem = () => {
  const {
    data: categories,
    isError,
    isPending,
  } = useQuery(fetchCategoriesQueryOPtions)
  if (isPending || !categories) {
    return <CategoriesSkeleton />
  }
  if (isError) {
    return <CategoriesError />
  }
  return (
    <Link to="/products" className="flex items-center gap-2.5">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex flex-col gap-4 cursor-pointer hover:shadow-lg p-4 rounded-lg items-center transition duration-300 ease-in-out"
        >
          <img
            src={category.image}
            alt={category.name}
            width={120}
            height={78}
            className="rounded-lg object-cover w-30 h-19.5"
          />
          <h2 className="font-semibold text-lg text-center">{category.name}</h2>
        </div>
      ))}
    </Link>
  )
}
const CategoriesSkeleton = () => {
  return (
    <div className="flex items-center gap-2.5">
      {[...Array.from({ length: 7 })].map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 cursor-pointer hover:shadow-lg p-4 rounded-lg items-center transition duration-300 ease-in-out"
        >
          <Skeleton className="rounded-lg object-cover w-30 h-19.5" />
          <Skeleton className="h-5 w-30" />
        </div>
      ))}
    </div>
  )
}
const CategoriesError = () => {
  return <div className="text-red-500">Error loading categories.</div>
}
export default Categories
