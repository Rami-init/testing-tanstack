import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Clock,
  Search,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import type { ProductFilters, SortBy } from '@/data/products'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Field, FieldGroup, FieldSet } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { fetchProductsQueryOptions } from '@/data/products'

type NavFilterProps = {
  filters: ProductFilters
}

const sortOptions: Array<{
  value: SortBy
  label: string
  icon: React.ReactNode
}> = [
  {
    value: 'price-low-high',
    label: 'Price: Low to High',
    icon: <ArrowUpNarrowWide />,
  },
  {
    value: 'price-high-low',
    label: 'Price: High to Low',
    icon: <ArrowDownNarrowWide />,
  },
  { value: 'newest', label: 'Newest Arrivals', icon: <Clock /> },
  { value: 'best-selling', label: 'Best Selling', icon: <TrendingUp /> },
  { value: 'rating', label: 'Customer Ratings', icon: <Star /> },
  { value: 'featured', label: 'Featured', icon: <Sparkles /> },
]

const NavFilter = ({ filters }: NavFilterProps) => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState(filters.search ?? '')
  const { data } = useQuery(fetchProductsQueryOptions(filters))

  const currentSort =
    sortOptions.find((opt) => opt.value === filters.sortBy) ?? sortOptions[5]

  const handleSortChange = (sortBy: SortBy) => {
    navigate({
      to: '/products',
      search: { ...filters, sortBy, page: 1 },
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({
      to: '/products',
      search: { ...filters, search: searchValue || undefined, page: 1 },
    })
  }

  const loadedCount = data?.products.length ?? 0
  const totalCount = data?.total ?? 0

  return (
    <nav className="flex items-center justify-between w-full">
      <FieldSet className="w-full max-w-xl">
        <FieldGroup>
          <form onSubmit={handleSearch} className="grid grid-cols-3 gap-4">
            <Field className="col-span-2">
              <InputGroup className="bg-white">
                <InputGroupInput
                  id="inline-end-input"
                  type="text"
                  placeholder="Search products"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <button type="submit" className="cursor-pointer">
                    <Search />
                  </button>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <InputGroup className="[--radius:0.5rem] cursor-pointer">
                    <InputGroupAddon align="inline-start">
                      Sort By:
                    </InputGroupAddon>
                    <Button
                      type="button"
                      variant="ghost"
                      className="justify-between hover:outline-none hover:ring-0 hover:bg-transparent"
                    >
                      {currentSort.label}
                    </Button>
                  </InputGroup>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" sideOffset={4}>
                  <DropdownMenuGroup>
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={
                          filters.sortBy === option.value ? 'bg-accent' : ''
                        }
                      >
                        {option.icon}
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </Field>
          </form>
        </FieldGroup>
      </FieldSet>
      <div className="flex gap-2 text-sm">
        <span className="font-medium">
          {loadedCount}/{totalCount}
        </span>
        <span className="text-muted-foreground">Result Loaded</span>
      </div>
    </nav>
  )
}

export default NavFilter
