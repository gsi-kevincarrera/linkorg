import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import LinkAdditionForm from './link-addition-form'
import { createPortal } from 'react-dom'
import { Link } from './link-card'
import { LinkModalState } from './board'

interface Props {
  openState: LinkModalState
  onClose: () => void
  onAddLink: (link: Omit<Link, 'id'>) => Promise<Link>
  onEditLink: (newLink: Link) => Promise<string>
  link: Link | null,
  existingTags: string[]
}

export default function LinkAdditionDialog({
  openState,
  onClose,
  onAddLink,
  onEditLink,
  link,
  existingTags
}: Props) {
  return createPortal(
    <Dialog
      open={['add', 'edit'].includes(openState)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {openState === 'add' ? 'Add Link' : 'Edit Link'}
          </DialogTitle>
        </DialogHeader>
        <LinkAdditionForm closeDialog={onClose} onAddLink={onAddLink} onEditLink={onEditLink} link={link} existingTags={existingTags} />
        <DialogDescription />
      </DialogContent>
    </Dialog>,
    document.body
  )
}
