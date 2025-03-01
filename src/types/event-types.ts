import { Link } from "@/components/link-card"

type ChangeEvent = React.ChangeEvent<HTMLInputElement>
type SetStateActionLink = React.Dispatch<React.SetStateAction<Link | null>>
type SetStateActionBoolean = React.Dispatch<React.SetStateAction<boolean>>
type SetStateActionString = React.Dispatch<React.SetStateAction<string>>

export type {
  ChangeEvent,
  SetStateActionLink,
  SetStateActionBoolean,
  SetStateActionString,
}