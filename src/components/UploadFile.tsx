import React from 'react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button, buttonVariants } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'

export const PersonalInfoAvatar = ({
  image: initialImage,
}: {
  image?: string | null
}) => {
  const [image, setImage] = React.useState<string | null>(initialImage || null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    setImage(URL.createObjectURL(file))
    setTimeout(() => {
      toast.error(' Failed to upload image.')
    }, 2000)
  }
  return (
    <div className="flex gap-x-2">
      <Avatar className="size-15">
        <AvatarImage src={image ?? undefined} />
        <AvatarFallback>{getInitials('You')}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-y-2">
        <div className="flex gap-x-3">
          <label
            className={buttonVariants({
              variant: 'primaryOutline',
              size: 'sm',
              className: 'cursor-pointer min-w-30',
            })}
            htmlFor="upload-photo"
          >
            Upload New Photo
          </label>
          <input
            id="upload-photo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            onClick={() => setImage(null)}
            type="button"
            variant={'neutralOutline'}
            size={'sm'}
          >
            Reset
          </Button>
        </div>
        <p className="text-sm font-normal text-text-caption">
          Allowed JPG, GIF or PNG. Max size of 800K
        </p>
      </div>
    </div>
  )
}
