import { Link } from '@tanstack/react-router'
import { SearchIcon } from 'lucide-react'
import TwoIphone from '@/assets/two-iphone.png'
import { LoginLink } from '@/components/Header'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

const Header = () => {
  return (
    <header className="bg-linear-to-tl from-[#0B0B0B] to-[#383638] flex flex-col">
      <div className="flex items-center justify-between  w-full h-16">
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
            <LinkItem to="/products">Products</LinkItem>

            <LinkItem to="/about">About</LinkItem>

            <LinkItem to="/contact">Contact</LinkItem>
          </ul>
          <LoginLink />
        </div>
      </div>
      <HeaderBanner />
    </header>
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
      'border-b-2 border-transparent hover:border-current px-2 h-full flex items-center hover:text-primary transition cursor-pointer',
      className,
    )}
  >
    {children}
  </Link>
)
export const HeaderBanner = () => {
  return (
    <div className="grid grid-cols-2">
      <div className="flex items-right justify-center flex-col p-10 gap-10 lg:ml-50">
        <div className="flex flex-col gap-4 ">
          <h2 className="text-white font-bold text-6xl">
            Discover Most Affordable Apple products
          </h2>
          <p className="text-base font-bold text-heading">
            Find the best, reliable and affordable apple products here. We focus
            on the product quality. Here you can find all the products apple
            ever made. Even the products apple officially stopped selling. So
            why you are waiting? Just order now!
          </p>
        </div>
        <InputGroup className="max-w-md bg-white h-15 rounded-2xl">
          <InputGroupInput placeholder="Find the best product" />
          <InputGroupAddon>
            <SearchIcon className="w-6 h-6 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              variant="default"
              className="h-12 px-6 rounded-2xl"
            >
              Search
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <img
        src={TwoIphone}
        alt="Header Banner"
        className="w-full object-cover"
      />
    </div>
  )
}
export default Header
