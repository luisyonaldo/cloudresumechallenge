/** @jsx jsx */
import { jsx, css } from '@emotion/core'

export default function Section({ title, children }) {
  return (
    <section>
      <h2 css={css`
        color: #2b6cb0;
        border-bottom: 2px solid #2b6cb0;
      `}>{title}</h2>
      <ul css={css`list-style: none; padding-left: 0;`}>
        {children}
      </ul>
    </section>
  )
}
