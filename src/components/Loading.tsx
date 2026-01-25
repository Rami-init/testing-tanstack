import Spinner from './ui/spinner'
import { cn } from '@/lib/utils'

export default function Loading({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-1 items-center justify-center w-screen h-screen bg-overlay-dark fixed top-0 left-0 z-50',
        className,
      )}
      {...props}
    >
      <div className="size-35 bg-background-surface-base-alpha-40 rounded-2xl flex items-center justify-center flex-col gap-y-4">
        <Spinner className="border-[5px] border-t-icon-brand border-r-icon-brand h-10 w-10" />
        <p className="title-small-bold font-bold text-md text-text-primary">
          Loading
        </p>
      </div>
    </div>
  )
}
