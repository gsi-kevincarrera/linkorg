import { SetStateActionLink } from '@/types/event-types'
import LinkCard, { Link } from './link-card'

interface LinkListProps {
  links: Link[]
  setSelectedLink: SetStateActionLink
}

export default function LinkList({ links, setSelectedLink }: LinkListProps) {
  return (
    <div className='border rounded-lg mb-6 p-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {links.length > 0 ? links.map((link) => (
          <LinkCard
            key={link.id}
            link={link}
            onClick={setSelectedLink}
          />
        )) : (
          <div className='p-4 text-center'>There are no links to display</div>
        )}
      </div>
    </div>
  )
}
