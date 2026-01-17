import { useState } from 'react'
import { useCreateBlog } from '@/hooks/useBlogs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function CreateBlogForm() {
  const [open, setOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')

  const createBlog = useCreateBlog()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createBlog.mutate(
      {
        title,
        description,
        content,
        coverImage,
        category: category.split(',').map((c) => c.trim()),
        date: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setOpen(false)
          setTitle('')
          setCategory('')
          setDescription('')
          setContent('')
          setCoverImage('')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Blog</Button>
      </DialogTrigger>

      {/* Solid, professional modal surface */}
      <DialogContent
        className="sm:max-w-lg shadow-2xl border border-gray-200"
        style={{
            backgroundColor: "#ffffff",
            color: "#000000",
            width: "80%",
            padding: "40px 40px 32px 40px",
            borderRadius: "20px",
  }}
>

        <DialogHeader>
          <DialogTitle>Create New Blog</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Categories (comma separated)
            </label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Short Description</label>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Cover Image URL</label>
            <Input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createBlog.isPending}
          >
            {createBlog.isPending ? 'Creating…' : 'Create Blog'}
          </Button>

          {createBlog.isError && (
            <p className="text-sm text-red-500">
              Failed to create blog.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
