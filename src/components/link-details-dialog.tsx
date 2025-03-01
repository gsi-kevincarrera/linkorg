import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Link } from './link-card'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'

interface LinkDetailsDialogProps {
  link: Link | null
  onClose: () => void
  onDelete: (id: string) => void
}

const LinkDetailsDialog: React.FC<LinkDetailsDialogProps> = ({
  link,
  onClose,
  onDelete,
}) => {
  if (!link) return null

  return createPortal(
    <Dialog open={!!link} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader >
          <DialogTitle>{link.title}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div>
            <h4 className='text-sm font-medium mb-1'>URL:</h4>
            <div className='flex items-center'>
              <Input value={link.url} readOnly className='flex-1' />
              <Button
                variant='ghost'
                size='sm'
                className='ml-2'
                onClick={() => {
                  navigator.clipboard.writeText(link.url)
                  toast('Link copied to clipboard')
                }}
              >
                Copy
              </Button>
            </div>
          </div>

          <div className='flex justify-between mt-4'>
            <Button
              variant='outline'
              onClick={() => {
                const formattedLink = link.url.startsWith('http') ? link.url : `https://${link.url}`
                console.log(formattedLink)
                window.open(formattedLink, '_blank')
              }}
            >
              Visit Site
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                if (!link.id) return
                onDelete(link.id)
                onClose()
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>,
    document.body
  )
}

export default LinkDetailsDialog
