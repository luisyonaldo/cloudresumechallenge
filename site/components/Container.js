/** @jsx jsx */
import { jsx, css } from '@emotion/core'

export default function Container({ children, ...props }) {
  return (
    <div {...props} css={css`
      display: flex;
      flex-direction:row;
      justify-content: space-between;
      * {
        display: block;
        margin: 0.125rem 0;
      }
    `}>
      {children}
    </div>
  )
}
