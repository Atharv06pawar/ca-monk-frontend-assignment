import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export type Blog = {
  id: number
  title: string
  category: string[]
  description: string
  date: string
  coverImage: string
  content: string
}

const API_BASE = 'http://localhost:3001'

export const useBlogs = () => {
  return useQuery<Blog[]>({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/blogs`)
      if (!res.ok) {
        throw new Error('Failed to fetch blogs')
      }
      return res.json()
    },
  })
}

export const useBlog = (id: number | null) => {
  return useQuery<Blog>({
    queryKey: ['blog', id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/blogs/${id}`)
      if (!res.ok) {
        throw new Error('Failed to fetch blog')
      }
      return res.json()
    },
    enabled: !!id,
  })
}

export const useCreateBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newBlog: Omit<Blog, 'id'>) => {
      const res = await fetch(`${API_BASE}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog),
      })

      if (!res.ok) {
        throw new Error('Failed to create blog')
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}
