import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!link) return null

  const onCancelDelete = () => setConfirmDelete(false)
  const onConfirmDelete = () => {
    if (!link.id) return
    onDelete(link.id)
    onClose()
    setConfirmDelete(false)
    toast.success('Link deleted successfully')
  }

  return createPortal(
    <>
      <Dialog open={!!link} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
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
                  const formattedLink = link.url.startsWith('http')
                    ? link.url
                    : `https://${link.url}`
                  window.open(formattedLink, '_blank')
                }}
              >
                Visit Site
              </Button>
              <Button
                variant='destructive'
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </Button>
            </div>
          </div>
          <DialogDescription />
        </DialogContent>
      </Dialog>
      <ConfirmDeleteDialog
        open={confirmDelete}
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
      />
    </>,
    document.body
  )
}

function ConfirmDeleteDialog({open, onConfirm, onCancel}:{open: boolean, onConfirm: () => void, onCancel: () => void}) {
  return createPortal(
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <p>Are you sure you want to delete this link?</p>
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={onCancel} className='hover:bg-secondary-foreground'>
              Cancel
            </Button>
            <Button variant='destructive' onClick={onConfirm}>
              Delete
            </Button>
          </div>
        </div>
        <DialogDescription />
      </DialogContent>
    </Dialog>, document.body
  )
}

export default LinkDetailsDialog
