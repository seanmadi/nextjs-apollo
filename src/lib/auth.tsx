import React, {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from "react"
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql,
  concat,
  ApolloLink,
} from "@apollo/client"
import { onError } from "@apollo/client/link/error"

import { UserLoginMutation } from "@/gql/__generated__/schema"

const authContext = createContext<ReturnType<typeof useProvideAuth>>(
  {} as ReturnType<typeof useProvideAuth>
)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useProvideAuth()

  return (
    <authContext.Provider value={auth}>
      <ApolloProvider client={auth.createApolloClient()}>
        {children}
      </ApolloProvider>
    </authContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(authContext)
}

type AuthCredentials = {
  accessToken: string
  client: string
  uid: string
}

function useProvideAuth() {
  const getAuthCredentials = (): AuthCredentials | null => {
    // check if SSR
    if (typeof window === "undefined") return null

    const maybeAuthCreds = window.localStorage.getItem("authCredentials")
    if (maybeAuthCreds) {
      return JSON.parse(maybeAuthCreds) as AuthCredentials
    } else {
      return null
    }
  }

  const [authCredentials, setAuthCredentialsInState] =
    useState<AuthCredentials | null>(null)
  // call setAuthCredentialsInState in useEffect to set default value
  // in order to avoid SSR hydration error
  useEffect(() => setAuthCredentialsInState(getAuthCredentials()), [])

  const setAuthCredentials = (authCredentials: AuthCredentials | null) => {
    if (authCredentials) {
      window.localStorage.setItem(
        "authCredentials",
        JSON.stringify(authCredentials)
      )

      setAuthCredentialsInState(authCredentials)
    } else {
      window.localStorage.removeItem("authCredentials")
      setAuthCredentialsInState(null)
    }
  }

  const isSignedIn = () => {
    if (authCredentials) {
      return true
    } else {
      return false
    }
  }

  const createApolloClient = () => {
    const httpLink = new HttpLink({
      uri: "http://localhost:3000/graphql",
    })

    const authMiddleware = new ApolloLink((operation, forward) => {
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          "access-token": authCredentials?.accessToken,
          client: authCredentials?.client,
          uid: authCredentials?.uid,
        },
      }))

      return forward(operation)
    })

    const resetToken = onError((error) => {
      if (
        error &&
        error.graphQLErrors?.some((val) =>
          val.message.includes("requires authentication")
        )
      ) {
        signOut()
      }
    })

    return new ApolloClient({
      link: concat(concat(authMiddleware, resetToken), httpLink),
      cache: new InMemoryCache(),
    })
  }

  const signIn = async ({
    username,
    password,
  }: {
    username: string
    password: string
  }) => {
    const client = createApolloClient()
    const LoginMutation = gql`
      mutation UserLogin($email: String!, $password: String!) {
        userLogin(email: $email, password: $password) {
          credentials {
            accessToken
            client
            uid
          }
        }
      }
    `

    try {
      const result = await client.mutate<UserLoginMutation>({
        mutation: LoginMutation,
        variables: { email: username, password },
      })

      if (
        result?.data?.userLogin?.credentials?.accessToken &&
        result?.data?.userLogin?.credentials?.client &&
        result?.data?.userLogin?.credentials?.uid
      ) {
        const credentials = {
          accessToken: result.data.userLogin.credentials.accessToken,
          client: result.data.userLogin.credentials.client,
          uid: result.data.userLogin.credentials.uid,
        }
        setAuthCredentials(credentials)
        return {
          data: credentials,
          error: null,
        }
      }
    } catch (e) {
      return {
        data: null,
        error: (e as { message: string }).message,
      }
    }
  }

  const signOut = () => {
    setAuthCredentials(null)
  }

  return {
    isSignedIn,
    signIn,
    signOut,
    createApolloClient,
  }
}
