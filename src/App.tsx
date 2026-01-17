import { useState } from 'react'
import BlogList from '@/components/BlogList'
import BlogDetail from '@/components/BlogDetail'
import CreateBlogForm from '@/components/CreateBlogForm'

export default function App() {
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <h1 className="text-lg font-semibold">CA Monk Blog</h1>
          <CreateBlogForm />
        </div>
      </header>

      <main className="mx-auto max-w-7xl">
        <div className="grid h-[calc(100vh-64px)] grid-cols-[320px_1fr]">
          {/* Left Panel */}
          <aside className="border-r overflow-y-auto">
            <BlogList
              selectedId={selectedBlogId}
              onSelect={setSelectedBlogId}
            />
          </aside>

          {/* Right Panel */}
          <section className="bg-background">
            <BlogDetail blogId={selectedBlogId} />
          </section>
        </div>
      </main>
    </div>
  )
}
