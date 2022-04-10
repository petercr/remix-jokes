import { Link, json, useLoaderData, useParams } from "remix"
import { db } from "~/utils/db.server"
import type { LoaderFunction } from "remix"
import type { Joke } from "@prisma/client"

type LoaderData = { joke: Joke }

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  })
  if (!joke) throw new Error("Joke not found")
  const data: LoaderData = { joke }
  return json(data)
}

export default function JokeId() {
  const data = useLoaderData<LoaderData>()
  return (
    <div>
      <h1>Here is your funny joke: </h1>
      <p>{data.joke.content}</p>
      <Link to=".">{data.joke.name} Permalink</Link>
    </div>
  )
}

export function ErrorBoundary() {
  const { jokeId } = useParams()
  return (
    <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  )
}
