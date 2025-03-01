import { SetStateActionLink, SetStateActionLinkModalState } from '@/types/ts-types'
import LinkCard, { Link } from './link-card'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { GripVertical, Edit } from 'lucide-react'
import { useEffect } from 'react'

interface LinkListProps {
  links: Link[]
  setSelectedLink: SetStateActionLink
  setOpenAddLinkDialog: SetStateActionLinkModalState
}

export default function LinkList({
  links,
  setSelectedLink,
  setOpenAddLinkDialog,
}: LinkListProps) {
  const [parent, ddLinks, setValues] = useDragAndDrop<HTMLUListElement, Link>(
    links,
    {
      draggable: (el) => {
        return !el.dataset.noDrag // this is beacuse it can exist a direct children that should not be draggable, so it throws an error
      },
      dragHandle: '[data-drag-handle]',
    }
  )

  useEffect(() => {
    setValues(links)
  }, [links, setValues])

  return (
    <div className='border rounded-lg mb-6 p-4'>
      <ul
        className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'
        ref={parent}
      >
        {ddLinks.length > 0 ? (
          ddLinks.map((link) => (
            <li key={link.id} className='flex items-center space-x-2 relative'>
              <GripVertical
                data-drag-handle
                className='cursor-grab active:cursor-grabbing h-6 absolute top-[calc(50% - 24px)] left-0 sm:-left-0.5 md:-left-1 lg:left-3 z-10'
              />
              <LinkCard link={link} onClick={setSelectedLink} />
              <Edit
                className='h-4 absolute top-3 right-3'
                onClick={() => {
                  setSelectedLink(link)
                  setOpenAddLinkDialog('edit')
                }}
              />
            </li>
          ))
        ) : (
          <div data-no-drag className='p-4 text-center'>
            There are no links to display
          </div>
        )}
      </ul>
    </div>
  )
}
