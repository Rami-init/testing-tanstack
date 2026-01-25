import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}
export async function AwaitedPromise() {
  return await new Promise((resolve) => setTimeout(resolve, 2000))
}
