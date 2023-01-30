import { useAuth } from "@/lib/auth"
import React, { useState } from "react"

export const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)

  const { signIn } = useAuth()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn({ username, password })
    if (result?.error) {
      setLoginError(result?.error)
    } else {
      setLoginError(null)
    }
  }

  return (
    <div>
      {loginError && <div>{loginError}</div>}
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
