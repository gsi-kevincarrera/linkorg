import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link } from './link-card'
import { toast } from 'sonner'
import { TagInput } from './tag-input'

const LinkSchema = z.object({
  title: z
    .string()
    .max(50, { message: 'Title must be less than 50 characters' })
    .min(1, { message: 'Enter the link title' }),
  tags: z.array(z.string()),
  url: z.string().refine(
    (value) => {
      try {
        // if it does not start with http, add it
        const formatted = value.startsWith('http') ? value : `https://${value}`
        const url = new URL(formatted)

        // Make sure is a valid domain (avoid inputs like "hello" or "1234")
        return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(url.hostname)
      } catch {
        return false
      }
    },
    {
      message: 'Invalid URL format',
    }
  ),
})

export default function LinkAdditionForm({
  closeDialog,
  onAddLink,
  onEditLink,
  link,
  existingTags,
}: {
  closeDialog: () => void
  onAddLink: (link: Omit<Link, 'id'>) => Promise<Link>
  onEditLink: (newLink: Link) => Promise<string>
  link: Link | null
  existingTags: string[]
}) {
  const defaultLink = {...link, tags: link?.tags ?? []}
  const form = useForm<z.infer<typeof LinkSchema>>({
    defaultValues: defaultLink ?? {
      title: '',
      url: '',
      tags: [],
    },
    resolver: zodResolver(LinkSchema),
  })

  const onSubmit = async (data: z.infer<typeof LinkSchema>) => {
    try {
      if (!link) {
        await onAddLink(data)
        toast.success('Link added successfully')
      } else {
        const editedLink: Link = {
          ...data,
          id: link.id,
        }
        await onEditLink(editedLink)
        toast.success('Link edited successfully')
      }
      closeDialog()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
        return
      }
      toast.error('Something went wrong')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder='Enter the title of the link' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL *</FormLabel>
              <FormControl>
                <Input placeholder='eg: www.example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagInput
                  selectedTags={field.value}
                  onChange={field.onChange}
                  existingTags={existingTags}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
          type='submit'
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}
