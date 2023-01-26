import { useAuth } from "@/lib/auth"
import React, { useState } from "react"

export const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { signIn } = useAuth()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    signIn({ username, password })
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}
