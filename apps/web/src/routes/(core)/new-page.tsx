import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(core)/new-page')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(core)/new-page"!</div>
}
