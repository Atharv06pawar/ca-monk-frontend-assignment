import { useState } from "react"
import { useCreateBlog } from "@/hooks/useBlogs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function CreateBlogForm() {
  const [open, setOpen] = useState(false)

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")

  const createBlog = useCreateBlog()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createBlog.mutate(
      {
        title,
        description,
        content,
        coverImage,
        category: category.split(",").map((c) => c.trim()),
        date: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setOpen(false)
          setTitle("")
          setCategory("")
          setDescription("")
          setContent("")
          setCoverImage("")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-medium">Create Blog</Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-xl border border-gray-200 shadow-2xl"
        style={{
            backgroundColor: "#ffffff",
            color: "#000000",
            width: "80%",
            padding: "40px 40px 32px 40px",
            borderRadius: "20px",
        }}
      >
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold tracking-tight text-gray-900">
            Create New Blog
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Categories
            </label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Tech, UI, React"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Short Description
            </label>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of the blog…"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Content</label>
            <Textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here…"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Cover Image URL
            </label>
            <Input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://image.url/cover.jpg"
              required
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-6 text-base font-semibold"
              disabled={createBlog.isPending}
            >
              {createBlog.isPending ? "Creating…" : "Create Blog"}
            </Button>
          </div>

          {createBlog.isError && (
            <p className="text-sm text-red-500 text-center">
              Failed to create blog.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
