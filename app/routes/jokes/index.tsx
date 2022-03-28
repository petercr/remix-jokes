import { Link, json, useLoaderData } from "remix"
import { db } from "~/utils/db.server"
import type { LoaderFunction } from "remix"
import type { Joke } from "@prisma/client"

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
  if (!randomJoke) throw new Error("Joke not found")
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
