import { Link } from "@/components/link-card"

type ChangeEvent = React.ChangeEvent<HTMLInputElement>
type SetStateActionLink = React.Dispatch<React.SetStateAction<Link | null>>

export type { ChangeEvent, SetStateActionLink }