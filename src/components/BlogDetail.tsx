import { useBlog } from '@/hooks/useBlogs'

type Props = {
  blogId: number | null
}

export default function BlogDetail({ blogId }: Props) {
  const { data, isLoading, error } = useBlog(blogId)

  if (!blogId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Select a blog from the left to view details
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading blog…
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6 text-sm text-red-500">
        Failed to load blog.
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-4">
      <img
        src={data.coverImage}
        alt={data.title}
        className="h-64 w-full rounded-xl object-cover"
      />

      <div>
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {data.category.join(', ')} •{' '}
          {new Date(data.date).toLocaleDateString()}
        </p>
      </div>

      <p className="leading-relaxed text-sm text-neutral-700">
        {data.content}
      </p>
    </div>
  )
}
