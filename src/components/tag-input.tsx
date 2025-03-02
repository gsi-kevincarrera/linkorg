import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import TagCapsule from './tag-capsule'

interface TagInputProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  existingTags: string[]
}

export function TagInput({
  selectedTags,
  onChange,
  existingTags,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Filter suggestions based on user input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = existingTags.filter(
        (tag) =>
          tag.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.includes(tag)
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [inputValue, existingTags, selectedTags])

  // Manage when user adds a tag
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      onChange([...selectedTags, trimmedTag])
    }
    setInputValue('')
    setSuggestions([])
  }

  const removeTag = (tagToRemove: string) => {
    onChange(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className='w-full'>
      <div className='flex flex-wrap gap-2 mb-2'>
        {selectedTags &&
          selectedTags.map((tag) => (
            <TagCapsule tag={tag} key={tag} onRemoveTag={removeTag} />
          ))}
      </div>

      <div className='relative'>
        <input
          type='text'
          className='w-full p-2 border rounded'
          placeholder='Add tag name'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputValue.trim()) {
              e.preventDefault()
              addTag(inputValue)
            }
          }}
        />
        <Button
          onClick={(e) => {
            e.preventDefault()
            addTag(inputValue)
          }}
          className='absolute right-1 top-1'
        >
          <Plus className='h-4 w-4' />
        </Button>

        {suggestions.length > 0 && (
          <div className='absolute z-10 -bottom-20 w-full mt-1 bg-white border rounded shadow-lg max-h-40 overflow-y-auto'>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion}
                className='px-3 py-2 cursor-pointer hover:bg-gray-100'
                onClick={() => addTag(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
