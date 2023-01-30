import { useGetArtistsQuery } from "@/gql/__generated__/schema"

export const Artists = () => {
  const { loading, error, data } = useGetArtistsQuery()

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
