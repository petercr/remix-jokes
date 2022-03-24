// Component: newJoke
// Handles the creation of a new joke
// at route /jokes/new

import { Form } from "remix"
import styles from "~/styles/jokes.css"

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export default function newJoke() {
  return (
    <div className="new-joke">
      <h3>Add your own hilarious joke</h3>
      <Form method="post">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" />
        <label htmlFor="joke-textbox">Content</label>
        <textarea name="content" id="joke-textbox" maxLength={280} />
        <button type="submit" className="form-button">
          Add Joke
        </button>
      </Form>
    </div>
  )
}
