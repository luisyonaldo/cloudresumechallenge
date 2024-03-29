import { css, Global } from '@emotion/core'

export const globalStyles = (
  <Global
    styles={css`
      body {
        font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
        padding: 0;
        margin: 0 auto;
        max-width: 800px;
      }
    `}
  />
)
