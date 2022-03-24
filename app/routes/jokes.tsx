import { Outlet } from "remix"

export default function jokes() {
  return (
    <div>
      <h1>Jokes</h1>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
