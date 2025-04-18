import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { ChangeEvent, SetStateActionLinkModalState } from '@/types/ts-types'

interface TopControlsProps {
  searchTerm: string
  onSearch: (searchTerm: string) => void
  setOpenAddLinkDialog: SetStateActionLinkModalState
}

export default function TopControls({
  searchTerm,
  onSearch,
  setOpenAddLinkDialog,
}: TopControlsProps) {
  const [inputValue, setInputValue] = useState(() => searchTerm)

  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearch(value)
  }, 300)

  const handleInputChange = (e: ChangeEvent) => {
    const value = e.target.value
    setInputValue(value)
    debouncedSearch(value)
  }

  return (
    <div className='flex flex-col sm:flex-row sm:justify-center gap-4 mb-6'>
      <Input
        placeholder='Search by link title, url or tag'
        value={inputValue}
        onChange={handleInputChange}
        className='max-w-80'
      />
      <Button onClick={() => setOpenAddLinkDialog('add')}>Add Link</Button>
    </div>
  )
}
