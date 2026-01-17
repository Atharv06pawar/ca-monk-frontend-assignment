import { useBlogs } from '@/hooks/useBlogs'
import BlogCard from './BlogCard'

type Props = {
  selectedId: number | null
  onSelect: (id: number) => void
}

export default function BlogList({ selectedId, onSelect }: Props) {
  const { data, isLoading, error } = useBlogs()

  if (isLoading) {
    return (
      <div className="p-4 space-y-3 text-muted-foreground text-sm">
        Loading blogs…
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-500">
        Failed to load blogs.
      </div>
    )
  }

  return (
    <div className="space-y-3 p-4">
      {data!.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          onSelect={onSelect}
          isActive={selectedId === blog.id}
        />
      ))}
    </div>
  )
}
