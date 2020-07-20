/** @jsx jsx */
import { jsx, css } from '@emotion/core'

const style = css`
display: flex;
flex-direction:row;
justify-content: space-between;
* {
  display: block;
  margin: 0.125rem 0;
}
`

export default function Container({ children, ...props }) {
  return (
    <div css={style} {...props}>
      {children}
    </div>
  )
}
