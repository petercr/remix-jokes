// Component: NewJoke
// Handles the creation of a new joke
// at route /jokes/new

import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import {
  useActionData,
  useCatch,
  useTransition,
  Link,
  Form,
} from "@remix-run/react"

import { JokeDisplay } from "~/components/jokes"
import { db } from "~/utils/db.server"
import { requireUserId, getUserId } from "~/utils/session.server"

import styles from "~/styles/jokes.css"

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 })
  }
  return json({})
}

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return `That joke is too short`
  }
}

function validateJokeName(name: string) {
  if (name.length < 3) {
    return `That joke's name is too short`
  }
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    name: string | undefined
    content: string | undefined
  }
  fields?: {
    name: string
    content: string
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const form = await request.formData()
  const name = form.get("name")
  const content = form.get("content")

  // Do a type check to keep TS happy 😅
  if (typeof name !== "string" || typeof content !== "string") {
    return badRequest({
      formError: "Form not filled out correctly",
    })
  }

  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content),
  }

  const fields = { name, content }
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }

  const joke = await db.joke.create({
    data: { ...fields, jokesterId: userId },
  })
  return redirect(`/jokes/${joke.id}`)
}

export default function NewJoke() {
  const actionData = useActionData<ActionData>()
  const transition = useTransition()

  if (transition.submission) {
    const name = transition.submission.formData.get("name")
    const content = transition.submission.formData.get("content")
    if (
      typeof name === "string" &&
      typeof content === "string" &&
      !validateJokeContent(content) &&
      !validateJokeName(name)
    ) {
      return (
        <JokeDisplay
          joke={{ name, content }}
          isOwner={true}
          canDelete={false}
        />
      )
    }
  }

  return (
    <div className="new-joke">
      <h1 className="jokes-header">Add your own hilarious joke</h1>
      <Form method="post">
        <div>
          <label htmlFor="name" className="top-label">
            Name of Joke
          </label>
          <input
            type="text"
            defaultValue={actionData?.fields?.name}
            name="name"
            id="name"
            aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
            aria-errormessage={
              actionData?.fieldErrors?.name ? "name-error" : undefined
            }
          />
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="joke-textbox">Content</label>
          <textarea
            defaultValue={actionData?.fields?.content}
            name="content"
            id="joke-textbox"
            maxLength={280}
            aria-invalid={
              Boolean(actionData?.fieldErrors?.content) || undefined
            }
            aria-errormessage={
              actionData?.fieldErrors?.content ? "content-error" : undefined
            }
          />
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              role="alert"
              id="content-error"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p className="form-validation-error" role="alert">
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="button form-button">
            Add Joke
          </button>
        </div>
      </Form>
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link to="/login">Login</Link>
      </div>
    )
  }
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  )
}
