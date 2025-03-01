import { SetStateActionLink } from '@/types/ts-types'
import React from 'react'

export type Link = {
  id?: string
  title: string
  url: string
  position?: number
}

interface LinkCardProps {
  link: Link
  onClick: SetStateActionLink
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onClick }) => {
  return (
    <div
      className='border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow duration-200 w-full'
      onClick={() => onClick(link)}
    >
      <h3 className='font-medium text-center truncate'>{link.title}</h3>
      <p className='text-sm text-gray-500 truncate text-center'>{link.url}</p>
    </div>
  )
}

export default LinkCard
