import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import * as React from 'react'
import type { ProductFilters } from '@/data/products'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { fetchCategoriesQueryOPtions } from '@/data/category'

type CategoriesFilterProps = {
  filters: ProductFilters
}

const CategoriesFilter = ({ filters }: CategoriesFilterProps) => {
  return (
    <aside className="flex flex-col sticky top-0 left-0 gap-8 p-4 min-w-64 border-gray-200">
      <CategoriesFilterItem filters={filters} />
      <PriceSlider filters={filters} />
    </aside>
  )
}

type CategoriesFilterItemProps = {
  filters: ProductFilters
}

const CategoriesFilterItem = ({ filters }: CategoriesFilterItemProps) => {
  const navigate = useNavigate()
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

  const handleCategoryChange = (categorySlug: string) => {
    const category = categories.find((c) => c.slug === categorySlug)
    navigate({
      to: '/products',
      search: {
        ...filters,
        categoryId: category?.id,
        page: 1,
      },
    })
  }

  const currentCategory = categories.find((c) => c.id === filters.categoryId)

  return (
    <FieldSet className="w-full max-w-xs">
      <FieldLegend
        variant="label"
        className="text-heading font-normal text-lg uppercase"
      >
        Category
      </FieldLegend>
      <RadioGroup
        value={currentCategory?.slug ?? 'all'}
        onValueChange={handleCategoryChange}
      >
        <Field orientation="horizontal">
          <RadioGroupItem value="all" id="all-categories" className="peer" />
          <FieldLabel
            htmlFor="all-categories"
            className="font-medium text-sm peer-data-[state=checked]:text-primary cursor-pointer"
          >
            All Categories
          </FieldLabel>
        </Field>
        {categories.map((category) => (
          <Field key={category.slug} orientation="horizontal">
            <RadioGroupItem
              value={category.slug}
              id={category.slug}
              className="peer"
            />
            <FieldLabel
              htmlFor={category.slug}
              className="font-medium text-sm peer-data-[state=checked]:text-primary cursor-pointer"
            >
              {category.name}
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
    </FieldSet>
  )
}

type PriceSliderProps = {
  filters: ProductFilters
}

type PriceRange = 'all' | 'under-500' | '500-1000' | '1000-1500' | '1500-above'

const PriceSlider = ({ filters }: PriceSliderProps) => {
  const navigate = useNavigate()
  const [value, setValue] = React.useState<[number, number]>([
    filters.minPrice ?? 0,
    filters.maxPrice ?? 2000,
  ])
  const [minInput, setMinInput] = React.useState(
    filters.minPrice?.toString() ?? '',
  )
  const [maxInput, setMaxInput] = React.useState(
    filters.maxPrice?.toString() ?? '',
  )

  const getCurrentPriceRange = (): PriceRange => {
    if (!filters.minPrice && !filters.maxPrice) return 'all'
    if (!filters.minPrice && filters.maxPrice === 500) return 'under-500'
    if (filters.minPrice === 500 && filters.maxPrice === 1000) return '500-1000'
    if (filters.minPrice === 1000 && filters.maxPrice === 1500)
      return '1000-1500'
    if (filters.minPrice === 1500 && !filters.maxPrice) return '1500-above'
    return 'all'
  }

  const handleSliderChange = (newValue: Array<number>) => {
    setValue(newValue as [number, number])
  }

  const handleSliderCommit = (newValue: Array<number>) => {
    const [min, max] = newValue
    navigate({
      to: '/products',
      search: {
        ...filters,
        minPrice: min > 0 ? min : undefined,
        maxPrice: max < 2000 ? max : undefined,
        page: 1,
      },
    })
  }

  const handleInputChange = () => {
    const min = minInput ? parseInt(minInput, 10) : undefined
    const max = maxInput ? parseInt(maxInput, 10) : undefined
    navigate({
      to: '/products',
      search: {
        ...filters,
        minPrice: min && min > 0 ? min : undefined,
        maxPrice: max ? max : undefined,
        page: 1,
      },
    })
  }

  const handlePriceRangeChange = (range: PriceRange) => {
    let minPrice: number | undefined
    let maxPrice: number | undefined

    switch (range) {
      case 'under-500':
        maxPrice = 500
        break
      case '500-1000':
        minPrice = 500
        maxPrice = 1000
        break
      case '1000-1500':
        minPrice = 1000
        maxPrice = 1500
        break
      case '1500-above':
        minPrice = 1500
        break
      case 'all':
      default:
        break
    }

    setValue([minPrice ?? 0, maxPrice ?? 2000])
    setMinInput(minPrice?.toString() ?? '')
    setMaxInput(maxPrice?.toString() ?? '')

    navigate({
      to: '/products',
      search: {
        ...filters,
        minPrice,
        maxPrice,
        page: 1,
      },
    })
  }

  return (
    <FieldSet className="w-full max-w-xs">
      <FieldLegend
        variant="label"
        className="text-heading font-normal text-lg uppercase"
      >
        Price Range
      </FieldLegend>
      <Field className="w-full max-w-xs">
        <FieldContent>
          <FieldDescription>
            Set your price range ($
            <span className="font-medium tabular-nums">{value[0]}</span> -{' '}
            <span className="font-medium tabular-nums">{value[1]}</span>).
          </FieldDescription>
          <Slider
            value={value}
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderCommit}
            max={2000}
            min={0}
            step={10}
            className="mt-2 w-full"
            aria-label="Price Range"
          />
        </FieldContent>
      </Field>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Input
              min={0}
              id="min"
              type="number"
              placeholder="Min Price"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              onBlur={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleInputChange()}
            />
          </Field>
          <Field>
            <Input
              min={0}
              id="max"
              type="number"
              placeholder="Max Price"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              onBlur={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleInputChange()}
            />
          </Field>
        </div>
      </FieldGroup>
      <RadioGroup
        value={getCurrentPriceRange()}
        onValueChange={(range) => handlePriceRangeChange(range as PriceRange)}
      >
        <Field orientation="horizontal">
          <RadioGroupItem value="all" id="all" className="peer" />
          <FieldLabel
            htmlFor="all"
            className="font-medium text-sm peer-data-[state=checked]:text-primary cursor-pointer"
          >
            All Prices
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="under-500" id="under-500" className="peer" />
          <FieldLabel
            htmlFor="under-500"
            className="font-medium text-sm peer-data-[state=checked]:text-primary cursor-pointer"
          >
            under $500
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="500-1000" id="500-1000" className="peer" />
          <FieldLabel
            htmlFor="500-1000"
            className="font-medium text-sm peer-data-[state=checked]:text-primary cursor-pointer"
          >
            $500 - $1000
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="1000-1500" id="1000-1500" className="peer" />
          <FieldLabel
            htmlFor="1000-1500"
            className="font-medium text-sm peer-data-[state=checked]:text-primary cursor-pointer"
          >
            $1000 - $1500
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="1500-above" id="1500-above" className="peer" />
          <FieldLabel
            htmlFor="1500-above"
            className="font-medium text-sm peer-data-[state=checked]:text-primary cursor-pointer"
          >
            $1500 & Above
          </FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  )
}

const CategoriesSkeleton = () => {
  return (
    <div className="flex flex-col gap-2.5">
      {[...Array.from({ length: 7 })].map((_, index) => (
        <div key={index} className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-5 w-26" />
        </div>
      ))}
    </div>
  )
}
const CategoriesError = () => {
  return <div className="text-red-500">Failed to load categories.</div>
}
export default CategoriesFilter
