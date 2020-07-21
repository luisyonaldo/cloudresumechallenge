/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import Container from './Container'

export default function Skills({ skills }) {
  return (
    <>
      {skills.map(({ category, values }, index) => (
        <li key={index}>
          <Container>
            <h3>{category}</h3>
            <p css={css`text-align: right;`}>{values}</p>
          </Container>
        </li>
      ))}
    </>
  )
}
