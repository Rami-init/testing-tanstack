import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}
export async function AwaitedPromise() {
  return await new Promise((resolve) => setTimeout(resolve, 2000))
}

const splitFullName = (fullName: string) => {
  const [firstName, middleName, lastName] = fullName.split(' ')
  return { firstName, middleName, lastName }
}
const getInitials = (fullName: string) => {
  const { firstName, lastName } = splitFullName(fullName)
  if (lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }
  return `${firstName.charAt(0)}${firstName.charAt(1)}`
}
export { getInitials, splitFullName }
