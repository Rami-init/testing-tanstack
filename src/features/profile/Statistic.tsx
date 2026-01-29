import type { ComponentType } from 'react'
import { Icon } from '@/lib/Icon'

const Statistic = ({
  icon,
  color,
  iconColor,
  total,
  caption,
}: {
  icon: ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
  iconColor?: string
  total: number | string
  caption: string
}) => {
  return (
    <div
      className="w-full p-4 bg-blue-300 flex gap-4 shadow-xs"
      style={{
        backgroundColor: color,
      }}
    >
      <div
        className="flex items-center justify-center size-14 bg-white"
        style={{
          color: iconColor,
        }}
      >
        <Icon icon={icon} className="size-8 shrink-0" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-foreground font-semibold text-xl">{total}</span>
        <p className="text-heading text-sm font-normal">{caption}</p>
      </div>
    </div>
  )
}

export default Statistic
