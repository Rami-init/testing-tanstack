import { Link, createFileRoute } from '@tanstack/react-router'
import { CreditCard, UserRound } from 'lucide-react'
import PackageIcon from '@/assets/icons/PackageIcon'
import ReceiptIcon from '@/assets/icons/ReceiptIcon'
import RocketIcon from '@/assets/icons/rocketIcon'
import AccountInfoCard, {
  AccountInfoContent,
  AddressInfoContent,
} from '@/features/profile/AccountInfoCard'
import Statistic from '@/features/profile/Statistic'

export const Route = createFileRoute('/_rootLayout/profile/overview')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-10 flex-1">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Statistic
          total={100}
          caption="Total Sales"
          color="#EAF6FE"
          iconColor="#2DA5F3"
          icon={RocketIcon}
        />
        <Statistic
          total={250}
          caption="Pending Orders"
          color="#FFF3EB"
          iconColor="#FA8232"
          icon={ReceiptIcon}
        />
        <Statistic
          total={75}
          caption="Completed Orders"
          color="#EAF7E9"
          iconColor="#2DB324"
          icon={PackageIcon}
        />
      </div>
      <div className="flex flex-col gap-2 max-w-lg">
        <h2 className="text-xl font-semibold text-foreground">
          Hello, Feyz Ibrahim
        </h2>
        <p className="text-heading text-sm font-normal">
          From your account dashboard. you can easily check & view your{' '}
          <ArticleLinks href="/profile" label="Recent Orders" />,{' '}
          <ArticleLinks
            href="/profile/account"
            label="manage your
          Shipping and Billing Addresses"
          />
          . Details, and{' '}
          <ArticleLinks
            href="/profile/account"
            label="Edit your Password and Account
          Information"
          />
          .
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AccountInfoCard
          title="Account Info"
          link="/profile/account"
          linkLabel="Edit Account"
          icon={UserRound}
        >
          <AccountInfoContent />
        </AccountInfoCard>
        <AccountInfoCard
          title="Billing Address"
          link="/profile/address"
          linkLabel="Edit Address"
          icon={CreditCard}
        >
          <AddressInfoContent />
        </AccountInfoCard>
      </div>
    </div>
  )
}

const ArticleLinks = ({ href, label }: { href: string; label: string }) => {
  return (
    <Link to={href} className="text-[#2DA5F3] hover:underline">
      {label}
    </Link>
  )
}
