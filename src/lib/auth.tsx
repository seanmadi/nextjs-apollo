import React, { useState, useContext, createContext, ReactNode } from "react"
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql,
  concat,
  ApolloLink,
} from "@apollo/client"
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
  const [authCredentials, setAuthCredentials] =
    useState<AuthCredentials | null>(null)

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

    return new ApolloClient({
      link: concat(authMiddleware, httpLink),
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

    const result = await client.mutate<UserLoginMutation>({
      mutation: LoginMutation,
      variables: { email: username, password },
    })

    if (
      result?.data?.userLogin?.credentials?.accessToken &&
      result?.data?.userLogin?.credentials?.client &&
      result?.data?.userLogin?.credentials?.uid
    ) {
      setAuthCredentials({
        accessToken: result.data.userLogin.credentials.accessToken,
        client: result.data.userLogin.credentials.client,
        uid: result.data.userLogin.credentials.uid,
      })
    }
  }

  const signOut = () => {
    setAuthCredentials(null)
  }

  return {
    setAuthCredentials,
    isSignedIn,
    signIn,
    signOut,
    createApolloClient,
  }
}
