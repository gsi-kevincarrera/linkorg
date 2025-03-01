import { SetStateActionLink, SetStateActionLinkModalState } from '@/types/ts-types'
import LinkCard, { Link } from './link-card'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { GripVertical, Edit, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface LinkListProps {
  links: Link[]
  setSelectedLink: SetStateActionLink
  setOpenAddLinkDialog: SetStateActionLinkModalState
  editLink: (link: Link) => Promise<string>
  refreshLinks: () => void
}

export default function LinkList({
  links,
  setSelectedLink,
  setOpenAddLinkDialog,
  editLink,
  refreshLinks
}: LinkListProps) {
  const [hasOrderChanged, setHasOrderChanged] = useState(false)
  const [parent, ddLinks, setValues] = useDragAndDrop<HTMLUListElement, Link>(
    links,
    {
      draggable: (el) => {
        return !el.dataset.noDrag // this is beacuse it can exist a direct children that should not be draggable, so it throws an error
      },
      dragHandle: '[data-drag-handle]',
      handleDragend: () => {
        // Verify if the order has changed, comparing them with original links
        const orderChanged = !links.every(
          (link, index) => ddLinks[index] && link.id === ddLinks[index].id
        )
        setHasOrderChanged(orderChanged)
      },
    }
  )

  useEffect(() => {
    setValues(links)
    setHasOrderChanged(false)
  }, [links, setValues])

    const saveNewOrder = async () => {
      try {
        // Update each link with its new position
        const updatedLinks = ddLinks.map((link, index) => ({
          ...link,
          position: index,
        }))

        // Save each updated Link
        for (const link of updatedLinks) {
          await editLink(link)
        }

        refreshLinks()
        setHasOrderChanged(false)
      } catch {
        toast.error('Error saving new order')
      }
    }

  return (
    <div className='border rounded-lg mb-6 p-4 relative'>
      {hasOrderChanged && (
        <Button 
          onClick={saveNewOrder}
          className='relative top-0 left-[25%] sm:left-[40%] lg:left-[42%] mb-3 bg-blue-500 text-white px-3 py-1 rounded-md flex items-center gap-1 z-20'
        >
          <Save className='h-4 w-4' />
          Save Order
        </Button>
      )}
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
