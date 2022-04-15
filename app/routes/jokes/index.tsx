import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData, Link, useCatch } from "@remix-run/react"
import type { Joke } from "@prisma/client"

import { db } from "~/utils/db.server"

type LoaderData = { randomJoke: Joke }

export const loader: LoaderFunction = async ({ params }) => {
  // Get random joke from database
  const count = await db.joke.count()
  const randomRowNumber = Math.floor(Math.random() * count)
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  })
  // check for joke, if not throw error
  if (!randomJoke) {
    throw new Response("Joke not found", { status: 404 })
  }
  const data: LoaderData = { randomJoke }
  return json(data)
}

export default function JokesIndexRoute() {
  const data = useLoaderData<LoaderData>()
  return (
    <div>
      <h1>Here is your random joke:</h1>
      <p>{data.randomJoke.content}</p>
      <Link to=".">{data.randomJoke.name} Permalink</Link>
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div className="error-container">There are no jokes to display.</div>
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}

export function ErrorBoundary() {
  return <div className="error-container">I did a whoopsies.</div>
}
