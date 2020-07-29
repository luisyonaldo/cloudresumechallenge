import { CacheProvider } from '@emotion/core'
import { cache } from 'emotion'

import { globalStyles } from '../styles'

export default function App({ Component, pageProps }) {
  return (
    <CacheProvider value={cache}>
      {globalStyles}
      <Component {...pageProps} />
    </CacheProvider>
  )
}
