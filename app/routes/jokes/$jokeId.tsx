import { json } from "remix"
import type { LoaderFunction } from "remix"

export const loader: LoaderFunction = async ({ params, request }) => {
  console.log("params", params)
  console.log("request", request)
  return json({ ok: true })
}

export default function jokeId() {
  return (
    <div>
      <p>Here comes the setup</p>
      <p>And here's the punchline!!! </p>
    </div>
  )
}
