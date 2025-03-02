import React from 'react'
import { SetStateActionLink } from '@/types/ts-types'
import { getTagColor } from '@/lib/utils'

export type Link = {
  id?: string
  title: string
  url: string
  position?: number
  tags?: string[]
}

interface LinkCardProps {
  link: Link
  onClick: SetStateActionLink
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onClick }) => {
  return (
    <div
      className='border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow duration-200 w-full min-h-[106px]'
      onClick={() => onClick(link)}
    >
      <h3 className='font-medium text-center truncate'>{link.title}</h3>
      <div className='flex justify-center items-center'>
        {link.tags && link.tags.length > 0 && (
          <div className='flex gap-1 my-1 max-w-60 overflow-hidden'>
            {link.tags.map((tag) => (
              <span
                key={tag}
                className={`${getTagColor(
                  tag
                )} text-xs px-2 py-0.5 rounded-full`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <p className='text-sm text-gray-500 truncate text-center'>{link.url}</p>
    </div>
  )
}

export default LinkCard
