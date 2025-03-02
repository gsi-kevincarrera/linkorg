import { getTagColor } from "@/lib/utils";
import { X } from "lucide-react";

export default function TagCapsule({tag, onRemoveTag, removable = true}: {tag: string, onRemoveTag?: (tag: string) => void, removable?: boolean}) {
  return (
    <span
      key={tag}
      className={`${getTagColor(
        tag
      )} text-xs px-2 py-1 rounded-full flex items-center`}
    >
      {tag}
      {removable && (
        <X
          className='ml-1 h-3 w-3 cursor-pointer'
          onClick={() => onRemoveTag && onRemoveTag(tag)}
        />
      )}
    </span>
  )
}