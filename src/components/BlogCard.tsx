import { Blog } from '@/hooks/useBlogs'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

type Props = {
  blog: Blog
  onSelect: (id: number) => void
  isActive: boolean
}

export default function BlogCard({ blog, onSelect, isActive }: Props) {
  return (
    <Card
      onClick={() => onSelect(blog.id)}
      className={`cursor-pointer transition-all hover:shadow-md ${
        isActive ? 'ring-2 ring-black' : ''
      }`}
    >
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold leading-tight line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {blog.category.join(', ')}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {blog.description}
        </p>
        <p className="mt-2 text-[10px] text-muted-foreground">
          {new Date(blog.date).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  )
}
