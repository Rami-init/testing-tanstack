import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Clock,
  Search,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
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

const NavFilter = () => {
  return (
    <nav className="flex items-center justify-between w-full">
      <FieldSet className="w-full max-w-xl">
        <FieldGroup>
          <div className="grid grid-cols-3 gap-4">
            <Field className="col-span-2">
              <InputGroup className="bg-white">
                <InputGroupInput
                  id="inline-end-input"
                  type="text"
                  placeholder="Search products"
                />
                <InputGroupAddon align="inline-end">
                  <Search />
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
                      variant="ghost"
                      className="justify-between hover:outline-none hover:ring-0 hover:bg-transparent"
                    >
                      Open
                    </Button>
                  </InputGroup>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" sideOffset={4}>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <ArrowUpNarrowWide />
                      Price: Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ArrowDownNarrowWide />
                      Price: High to Low
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Clock />
                      Newest Arrivals
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TrendingUp />
                      Best Selling
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Star />
                      Customer Ratings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Sparkles />
                      Featured
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>
      <div className="flex gap-2 text-sm">
        <span className="font-medium">20/40</span>
        <span className="text-muted-foreground">Result Loaded</span>
      </div>
    </nav>
  )
}

export default NavFilter
