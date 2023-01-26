import Head from "next/head"
import { useQuery, gql } from "@apollo/client"
import { GetArtistsQuery } from "@/gql/graphql"

const GET_ARTISTS = gql`
  query GetArtists {
    artists {
      id
      firstName
      lastName
    }
  }
`

export default function Home() {
  const { loading, error, data } = useQuery<GetArtistsQuery>(GET_ARTISTS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

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
          {data && (
            <ul>
              {data.artists.map((artist) => (
                <li key={artist.id}>
                  {artist.firstName} {artist.lastName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  )
}
