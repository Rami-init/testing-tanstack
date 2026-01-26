import * as React from 'react'
import RatingIcon from '@/assets/icons/RatingIcon'
import { cn } from '@/lib/utils'

type RatingProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  value?: number
  max?: number
  onChange?: (value: number) => void
  ref?: React.Ref<HTMLInputElement>
}

export const Rating = ({
  ref,
  value = 0,
  max = 5,
  className,
  onChange,
  disabled,
  readOnly,
  ...props
}: RatingProps) => {
  return (
    <div className={cn('flex', className)}>
      <input
        type="number"
        className="hidden"
        ref={ref}
        value={value}
        readOnly
        disabled={disabled}
        {...props}
      />
      {Array.from({ length: max }).map((_, i) => (
        <RatingIcon
          key={i}
          className={cn(
            'transition-colors text-[#E4E7E9]',
            disabled || readOnly
              ? 'cursor-default'
              : 'cursor-pointer hover:text-[#FA8232]',
            i < value ? 'text-[#FA8232]' : 'text-[#E4E7E9]',
          )}
        />
      ))}
    </div>
  )
}
Rating.displayName = 'Rating'
