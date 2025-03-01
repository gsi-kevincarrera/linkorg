import { Link } from "@/components/link-card"

type ChangeEvent = React.ChangeEvent<HTMLInputElement>
type SetStateActionLink = React.Dispatch<React.SetStateAction<Link | null>>
type SetStateActionBoolean = React.Dispatch<React.SetStateAction<boolean>>

export type { ChangeEvent, SetStateActionLink, SetStateActionBoolean }