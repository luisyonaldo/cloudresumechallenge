/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import useSWR from 'swr'

export default function Visits() {
  const fetcher = url => fetch(url, { method: 'PUT' }).then(r => r.json())
  const { data, error } = useSWR('/api/visits', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  if (error || !data) return null
  return (
    <div css={css`text-align: center;`}>
      You are the <b>{data.visits}</b> visitor on this site!
    </div>
  )
}
