import { LinkModalState } from "@/components/board"
import { Link } from "@/components/link-card"

//Events
type ChangeEvent = React.ChangeEvent<HTMLInputElement>
type SetStateActionLink = React.Dispatch<React.SetStateAction<Link | null>>
type SetStateActionBoolean = React.Dispatch<React.SetStateAction<boolean>>
type SetStateActionString = React.Dispatch<React.SetStateAction<string>>
type SetStateActionLinkModalState = React.Dispatch<React.SetStateAction<LinkModalState>>

type RefList = React.RefObject<HTMLUListElement>

export type {
  ChangeEvent,
  SetStateActionLink,
  SetStateActionBoolean,
  SetStateActionString,
  RefList,
  SetStateActionLinkModalState,
}