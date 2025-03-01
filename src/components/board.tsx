// import LinkDetailsDialog from './link-details-dialog'
import TopControls from './top-controls'
import { useIndexedDB } from '@/hooks/useIndexedDB'
import LinkList from './link-list'
import { useSearchLinks } from '@/hooks/useSearchLinks'
import LinkDetailsDialog from './link-details-dialog'
import { useState } from 'react'
import { Link } from './link-card'
import LinkAdditionDialog from './link-addition-dialog'

const Board: React.FC = () => {

  const { links, isLoading, error, deleteLink, addLink } = useIndexedDB()
  const { searchTerm, filteredLinks, handleSearch } = useSearchLinks(links)

  const [selectedLink, setSelectedLink] = useState<Link | null>(null)
  const [openAddLinkDialog, setOpenAddLinkDialog] = useState(false)

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='max-w-6xl mx-auto bg-background shadow-md rounded-lg overflow-hidden border-2 border-dashed border-blue-300 p-4'>
        <TopControls
          onSearch={handleSearch}
          searchTerm={searchTerm}
          setOpenAddLinkDialog={setOpenAddLinkDialog}
        />

        {error && (
          <div className='text-red-500 p-4 text-center'>
            Error: {error?.message}
          </div>
        )}

        {isLoading ? (
          <div className='p-8 text-center'>Loading links...</div>
        ) : (
          <LinkList
            links={filteredLinks}
            setSelectedLink={setSelectedLink}
          />
        )}

        <LinkDetailsDialog
          link={selectedLink}
          onClose={() => setSelectedLink(null)}
          onDelete={deleteLink}
        />
        <LinkAdditionDialog
          open={openAddLinkDialog}
          onClose={() => setOpenAddLinkDialog(false)}
          onAddLink={addLink}
        />
      </div>
    </div>
  )
}

export default Board
