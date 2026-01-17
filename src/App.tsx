import {
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from 'react-router-dom'
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type Blog = {
  id: number
  title: string
  description: string
  category: string[]
  coverImage: string
  content: string
  date: string
}

function BlogList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await axios.get<Blog[]>(
        'http://localhost:3001/blogs'
      )
      return res.data
    },
  })

  if (isLoading)
    return <div className="p-4 text-muted-foreground">Loading…</div>
  if (isError)
    return (
      <div className="p-4 text-red-500">Failed to load blogs.</div>
    )

  return (
    <div className="space-y-4 p-4">
      {data!.map((blog) => (
        <Link key={blog.id} to={`/blog/${blog.id}`}>
          <Card className="hover:shadow-md transition">
            <CardHeader className="pb-2">
              <h3 className="font-semibold leading-tight">
                {blog.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {blog.category.join(', ')}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {blog.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function BlogDetail() {
  const { id } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const res = await axios.get<Blog>(
        `http://localhost:3001/blogs/${id}`
      )
      return res.data
    },
    enabled: !!id,
  })

  if (!id)
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a blog to view details
      </div>
    )

  if (isLoading)
    return (
      <div className="p-6 text-muted-foreground">Loading blog…</div>
    )

  if (isError || !data)
    return <div className="p-6 text-red-500">Blog not found.</div>

  return (
    <div className="h-full overflow-y-auto p-6">
      <img
        src={data.coverImage}
        alt={data.title}
        className="mb-6 h-56 w-full rounded-xl object-cover"
      />
      <h1 className="text-2xl font-bold">{data.title}</h1>

      <div className="mt-2 flex gap-2">
        {data.category.map((c) => (
          <span
            key={c}
            className="rounded-full bg-muted px-3 py-1 text-xs"
          >
            {c}
          </span>
        ))}
      </div>

      <p className="mt-6 leading-relaxed text-neutral-700">
        {data.content}
      </p>
    </div>
  )
}

function CreateBlog() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [content, setContent] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      return axios.post('http://localhost:3001/blogs', {
        title,
        description,
        category: categories.split(',').map((c) => c.trim()),
        coverImage,
        content,
        date: new Date().toISOString(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      navigate('/')
    },
  })

  return (
    <div className="mx-auto max-w-xl p-6">
      <h2 className="mb-6 text-2xl font-bold">Create Blog</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          mutation.mutate()
        }}
        className="space-y-4"
      >
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Input
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <Input
          placeholder="Categories (comma separated)"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          required
        />

        <Input
          placeholder="Cover image URL"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          required
        />

        <Textarea
          rows={6}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating…' : 'Create Blog'}
        </Button>
      </form>
    </div>
  )
}

function HomeLayout() {
  return (
    <div className="grid h-[calc(100vh-64px)] grid-cols-[320px_1fr]">
      <aside className="border-r overflow-y-auto">
        <BlogList />
      </aside>
      <section className="bg-background">
        <Routes>
          <Route path="/" element={<BlogDetail />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Routes>
      </section>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link to="/" className="text-lg font-semibold">
            CA Monk Blogs
          </Link>
          <Link to="/create">
            <Button>New Blog</Button>
          </Link>
        </div>
      </header>

      <Routes>
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/*" element={<HomeLayout />} />
      </Routes>
    </div>
  )
}

export default App
