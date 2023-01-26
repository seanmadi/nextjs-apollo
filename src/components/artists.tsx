import { useQuery, gql } from "@apollo/client"
import { GetArtistsQuery } from "@/gql/__generated__/graphql"

const GET_ARTISTS = gql`
  query GetArtists {
    artists {
      id
      firstName
      lastName
    }
  }
`

export const Artists = () => {
  const { loading, error, data } = useQuery<GetArtistsQuery>(GET_ARTISTS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      {data && (
        <ul>
          {data.artists.map((artist) => (
            <li key={artist.id}>
              {artist.firstName} {artist.lastName}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
