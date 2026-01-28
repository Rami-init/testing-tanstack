import { AwardIcon, CreditCardIcon, HeadsetIcon, VanIcon } from 'lucide-react'
import type { Product } from '@/db/schema'
import { Separator } from '@/components/ui/separator'

const ProductDescription = ({ product }: { product: Product }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-2 pr-4">
        <h3 className="text-foreground font-semibold text-base">Overview</h3>
        {product.description ? (
          product.description.map((desc, index) => (
            <p key={index} className="text-sm text-heading pb-3">
              {desc}
            </p>
          ))
        ) : (
          <p className="text-sm text-heading">No description available.</p>
        )}
        <p className="text-sm text-heading"></p>
      </div>
      <div className="flex  gap-2 ">
        <ShippingInfo />
        <Separator orientation="vertical" className="h-auto mx-auto" />
        <FeatureItem />
      </div>
    </div>
  )
}
export const Description = ({
  title,
  content,
}: {
  title: string
  content: string
}) => {
  return (
    <div className="flex flex-col gap-2 pr-4">
      <h3 className="text-foreground font-semibold text-base">{title}</h3>
      <p className="text-sm text-heading">{content}</p>
    </div>
  )
}
const FeatureItem = () => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-foreground font-semibold text-base">Features</h3>
      <ul className="text-sm text-heading flex flex-col gap-4">
        <li className="flex gap-x-1.5 items-center [&>svg]:text-primary/80 [&>svg]:size-5">
          <AwardIcon />
          <span>Free 1 Year Warranty</span>
        </li>
        <li className="flex gap-x-1.5 items-center [&>svg]:text-primary/80 [&>svg]:size-5">
          <VanIcon />
          <span>Free Shipping & Fastest Delivery</span>
        </li>
        <li className="flex gap-x-1.5 items-center [&>svg]:text-primary/80 [&>svg]:size-5">
          <HeadsetIcon />
          <span>24/7 Customer Support</span>
        </li>
        <li className="flex gap-x-1.5 items-center [&>svg]:text-primary/80 [&>svg]:size-5">
          <CreditCardIcon />
          <span>Secure Payment Methods</span>
        </li>
      </ul>
    </div>
  )
}
const shippingOptions = [
  { name: 'Courier', time: '2-4 Business Days', cost: '$25.00' },
  {
    name: 'International',
    time: '5-10 Business Days',
    cost: '$15.00',
  },
  {
    name: 'UPS Ground',
    time: '3-5 Business Days',
    cost: '$10.00',
  },
  {
    name: 'FedEx Express',
    time: '2-3 Business Days',
    cost: '$20.00',
  },
  {
    name: 'DHL International',
    time: '5-7 Business Days',
    cost: '$30.00',
  },
  {
    name: 'Unishop Global Export',
    time: '7-14 Business Days',
    cost: '$40.00',
  },
]
const ShippingInfo = () => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-foreground font-semibold text-base">
        Shipping Information
      </h3>
      <ul className="text-sm text-heading flex flex-col gap-3">
        {shippingOptions.map((option, index) => (
          <ShippingOptionItem
            key={index}
            name={option.name}
            time={option.time}
            cost={option.cost}
          />
        ))}
      </ul>
    </div>
  )
}
const ShippingOptionItem = ({
  name,
  time,
  cost,
}: {
  name: string
  time: string
  cost: string
}) => {
  return (
    <li className="flex items-center gap-1">
      <span className="text-[#191C1F] font-medium">{name}:</span>
      <span>
        {time}, {cost}
      </span>
    </li>
  )
}
export default ProductDescription
