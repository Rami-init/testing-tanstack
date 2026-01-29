import * as React from 'react'

import { cn } from '@/lib/utils'

function Checkbox({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 size-4 cursor-pointer rounded border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] checked:border-transparent checked:bg-[#3858d6] checked:hover:bg-[#2e49b3]',
        className,
      )}
      {...props}
    />
  )
}

export { Checkbox }
