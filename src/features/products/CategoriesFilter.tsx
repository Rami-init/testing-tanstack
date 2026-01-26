import { useQuery } from '@tanstack/react-query'
import * as React from 'react'
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

const CategoriesFilter = () => {
  return (
    <aside className="flex flex-col sticky top-0 left-0 gap-8 p-4 min-w-64 border-gray-200">
      <CategoriesFilterItem />
      <PriceSlider />
    </aside>
  )
}
const CategoriesFilterItem = () => {
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
    <FieldSet className="w-full max-w-xs">
      <FieldLegend
        variant="label"
        className="text-heading font-normal text-lg uppercase"
      >
        Category
      </FieldLegend>
      <RadioGroup defaultValue={categories[0]?.slug}>
        {categories.map((category) => (
          <Field key={category.slug} orientation="horizontal">
            <RadioGroupItem
              value={category.slug}
              id={category.slug}
              className="peer"
            />
            <FieldLabel
              htmlFor={category.slug}
              className="font-medium text-sm peer-data-[state=checked]:text-primary"
            >
              {category.name}
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
    </FieldSet>
  )
}
const PriceSlider = () => {
  const [value, setValue] = React.useState([0, 800])

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
            onValueChange={(newValue) => setValue(newValue as [number, number])}
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
            <Input min={0} id="min" type="number" placeholder="Min Price" />
          </Field>
          <Field>
            <Input min={0} id="max" type="number" placeholder="Max Price" />
          </Field>
        </div>
      </FieldGroup>
      <RadioGroup defaultValue="all">
        <Field orientation="horizontal">
          <RadioGroupItem value="all" id="all" className="peer" />
          <FieldLabel
            htmlFor="all"
            className="font-medium text-sm peer-data-[state=checked]:text-primary"
          >
            All Prices
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="under-500" id="under-500" className="peer" />
          <FieldLabel
            htmlFor="under-500"
            className="font-medium text-sm peer-data-[state=checked]:text-primary"
          >
            under $500
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="500-1000" id="500-1000" className="peer" />
          <FieldLabel
            htmlFor="500-1000"
            className="font-medium text-sm peer-data-[state=checked]:text-primary"
          >
            $500 - $1000
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="1000-1500" id="1000-1500" className="peer" />
          <FieldLabel
            htmlFor="1000-1500"
            className="font-medium text-sm peer-data-[state=checked]:text-primary"
          >
            $1000 - $1500
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="1500-above" id="1500-above" className="peer" />
          <FieldLabel
            htmlFor="1500-above"
            className="font-medium text-sm peer-data-[state=checked]:text-primary"
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
