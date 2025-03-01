import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import LinkAdditionForm from './link-addition-form'
import { createPortal } from 'react-dom'
import { Link } from './link-card'

interface Props {
  open: boolean
  onClose: () => void
  onAddLink: (link: Omit<Link, 'id'>) => Promise<Link>
}

export default function LinkAdditionDialog({open, onClose, onAddLink}: Props) {
  return createPortal(
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
        </DialogHeader>
        <LinkAdditionForm closeDialog={onClose} onAddLink={onAddLink} />
        <DialogDescription />
      </DialogContent>
    </Dialog>, document.body
  )
}
