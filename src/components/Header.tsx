import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ChevronDownIcon } from 'lucide-react'
import { LoginLink } from './CartLink'
import { cn } from '@/lib/utils'
import { fetchCategoriesQueryOPtions } from '@/data/category'

const Header = () => {
  return (
    <header className="flex items-center justify-between fixed bg-background w-full top-0 left-0 right-0 h-16 shadow-md z-10">
      <div className="container mx-auto flex items-center justify-between h-full">
        <Link to="/" className="flex items-center">
          <img
            src="./logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="inline-block mr-1"
          />
          <h1 className="text-base font-medium text-heading">ex-iphones</h1>
        </Link>
        <ul className="flex text-heading font-bold text-base h-full">
          <LinkItem to="/">Home</LinkItem>
          <ProductsDropdown />
          <LinkItem to="/about">About</LinkItem>
          <LinkItem to="/contact">Contact</LinkItem>
        </ul>
        <LoginLink />
      </div>
    </header>
  )
}

const ProductsDropdown = () => {
  const { data: categories } = useQuery(fetchCategoriesQueryOPtions)

  return (
    <li className="relative group h-full list-none">
      <Link
        to="/products"
        className={cn(
          'border-b-2 border-transparent hover:border-current px-2 h-full flex items-center hover:text-primary transition cursor-pointer duration-300 gap-1',
        )}
        activeProps={{
          className: 'border-b-2 border-primary! text-primary',
        }}
      >
        Products
        <ChevronDownIcon className="size-4 transition-transform group-hover:rotate-180" />
      </Link>
      <div className="absolute top-full left-0 pt-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48">
          <Link
            to="/products"
            className="block px-4 py-2 text-sm font-medium text-heading hover:bg-primary hover:text-white transition-colors"
          >
            All Products
          </Link>
          {categories?.map((category) => (
            <Link
              key={category.id}
              to="/products"
              search={{ categoryId: category.id }}
              className="block px-4 py-2 text-sm font-medium text-heading hover:bg-primary hover:text-white transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </li>
  )
}

const LinkItem = ({
  to,
  children,
  className,
}: {
  to: string
  children: string
  className?: string
}) => (
  <Link
    to={to}
    className={cn(
      'border-b-2 border-transparent hover:border-current px-2 h-full flex items-center hover:text-primary transition cursor-pointer duration-300',
      className,
    )}
    activeProps={{
      className: 'border-b-2 border-primary! text-primary',
    }}
  >
    {children}
  </Link>
)
export default Header
