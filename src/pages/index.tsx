import Head from "next/head"

import { Login } from "@/components/login"
import { Artists } from "@/components/artists"
import { useAuth } from "@/lib/auth"

export default function Home() {
  const { isSignedIn, signOut } = useAuth()

  return (
    <>
      <Head>
        <title>Graphql Test App</title>
        <meta name="description" content="Graphql Test App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          {isSignedIn() ? (
            <>
              <Artists />
              <a
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault
                  signOut()
                }}
              >
                Logout
              </a>
            </>
          ) : (
            <Login />
          )}
        </div>
      </main>
    </>
  )
}
