import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { ChangeEvent } from '@/types/event-types'
import { Link } from './link-card'

interface TopControlsProps {
  searchTerm: string
  onSearch: (searchTerm: string) => void
  onAddLink: (newLink: Link) => void
}

export default function TopControls({
  searchTerm,
  onSearch,
  onAddLink
}: TopControlsProps) {
  const [inputValue, setInputValue] = useState(() => searchTerm)
  const [linkInputValue, setLinkInputValue] = useState('')

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
  
  const handleAddLink = () => {
    if(!linkInputValue) return
    const newLink = {
      title: 'Generic Name',
      url: linkInputValue
    }
    onAddLink(newLink)
  }

  return (
    <div className='flex flex-col sm:flex-row gap-4 mb-6'>
      <div className='flex gap-2 flex-1'>
        <Input
          value={linkInputValue}
          placeholder='Paste your url here'
          className='flex-1'
          onChange={(e) => setLinkInputValue(e.target.value)}
        />
        <Button onClick={handleAddLink}>Confirm</Button>
      </div>

      <div className='flex-1'>
        <Input
          placeholder='Search url name'
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>

      <Button>Filters</Button>
    </div>
  )
}
