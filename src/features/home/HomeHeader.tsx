import { Link } from '@tanstack/react-router'
import { SearchIcon } from 'lucide-react'
import { motion } from 'motion/react'
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
    <header className="bg-linear-to-tl from-[#0B0B0B] to-[#383638] flex flex-col h-screen w-full flex-1">
      <div className="flex items-center justify-between  w-full h-16">
        <div className="container mx-auto flex items-center justify-between h-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/" className="flex items-center">
              <motion.img
                src="./logo.svg"
                alt="Logo"
                width={32}
                height={32}
                className="inline-block mr-1"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  duration: 0.8,
                  type: 'spring',
                  bounce: 0.5,
                  delay: 0.3,
                }}
              />
              <h1 className="text-base font-medium text-heading">ex-iphones</h1>
            </Link>
          </motion.div>
          <motion.ul
            className="flex text-heading font-bold text-base h-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, staggerChildren: 0.1 }}
          >
            <LinkItem to="/">Home</LinkItem>
            <LinkItem to="/products">Products</LinkItem>

            <LinkItem to="/about">About</LinkItem>

            <LinkItem to="/contact">Contact</LinkItem>
          </motion.ul>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <LoginLink />
          </motion.div>
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
    activeProps={{
      className: 'border-b-2 border-primary! text-primary',
    }}
  >
    {children}
  </Link>
)
export const HeaderBanner = () => {
  return (
    <div className="grid grid-cols-2 h-full w-full max-w-svw">
      <div className="flex items-right justify-center flex-col p-10 gap-10 lg:ml-50 mt-38">
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.h2
            className="text-white font-bold text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            Discover Most Affordable Apple products
          </motion.h2>
          <motion.p
            className="text-base font-bold text-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
          >
            Find the best, reliable and affordable apple products here. We focus
            on the product quality. Here you can find all the products apple
            ever made. Even the products apple officially stopped selling. So
            why you are waiting? Just order now!
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 1.1,
            type: 'spring',
            bounce: 0.3,
          }}
        >
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
        </motion.div>
      </div>
      <div className="flex items-end">
        <motion.img
          src={TwoIphone}
          alt="Header Banner"
          className="w-full object-contain"
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{
            duration: 0.9,
            delay: 0.7,
            type: 'spring',
            bounce: 0.3,
          }}
        />
      </div>
    </div>
  )
}
export default Header
