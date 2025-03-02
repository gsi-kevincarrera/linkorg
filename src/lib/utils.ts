import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTagColor = (tag: string) => {
  // Generate a simple hash based on text
  const hash = Array.from(tag).reduce(
    (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc),
    0
  )

  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-indigo-100 text-indigo-800',
    'bg-pink-100 text-pink-800',
  ]

  // Select color based on hash
  return colors[Math.abs(hash) % colors.length]
}
