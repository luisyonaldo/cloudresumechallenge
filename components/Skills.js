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
            <p>{values}</p>
          </Container>
        </li>
      ))}
    </>
  )
}
