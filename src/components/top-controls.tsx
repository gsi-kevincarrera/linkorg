import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    setInputValue(searchTerm)
  }, [searchTerm])

  return (
    <div className='flex flex-col sm:flex-row sm:justify-center gap-4 mb-6'>
      <Button onClick={() => setOpenAddLinkDialog('add')}>Add Link</Button>
      <Input
        placeholder='Search by link title or url'
        value={inputValue}
        onChange={handleInputChange}
        className='max-w-80'
      />
      <Button>Filters</Button>
    </div>
  )
}
