// resources/js/layouts/project/layout.tsx
import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Link } from '@inertiajs/react'
import { PropsWithChildren } from 'react'

interface Props {
  projects: { id: string; name: string }[]
  currentProjectId: string
}


export default function MyProjectsLayout({
  children,
  projects,
  currentProjectId,
}: PropsWithChildren<Props>) {
  if (typeof window === 'undefined') {
    return null
  }

  // not lagi window.location; gunakan currentProjectId
  return (
    <div className="px-4 py-6">
      <Heading
        title="Projects and Tasks"
        description="Manage your projects and tasks efficiently"
      />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="w-full max-w-xl lg:w-48">
          <nav className="flex flex-col space-y-1">
            {projects.map((proj) => (
              <Button
                key={proj.id}
                size="sm"
                variant="ghost"
                asChild
                className={cn('w-full justify-start', {
                  'bg-muted': proj.id === currentProjectId,
                })}
              >
                <Link href={route('my-projects.show', { project: proj.id })}>
                  {proj.name}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>

        <Separator className="my-6 md:hidden" />

        <div className="flex-1 overflow-x-auto">
          <section className="w-full min-w-full space-y-12">
            {children}
          </section>
        </div>
      </div>
    </div>
  )
}
