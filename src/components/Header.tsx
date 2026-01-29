import { Link } from '@tanstack/react-router'
import { LoginLink } from './CartLink'
import { cn } from '@/lib/utils'

const linksList = [
  { name: 'Home', to: '/' },
  { name: 'Products', to: '/products' },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
]
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
          {linksList.map((link) => (
            <LinkItem key={link.to} to={link.to}>
              {link.name}
            </LinkItem>
          ))}
        </ul>
        <LoginLink />
      </div>
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
