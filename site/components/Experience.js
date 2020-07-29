/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import Container from './Container'

export default function Experience({ organizations }) {
  return (
    <>
      {organizations.map(({ name, startMonthYear, endMonthYear, occupation, location, notes }, index) => (
        <li key={index}>
          <Container>
            <h3>{name}</h3>
            <h4>{startMonthYear} - {endMonthYear || "Present"}</h4>
          </Container>
          <Container>
            <p>{occupation}</p>
            <p>{location}</p>
          </Container>
          <ul>
            {notes.map((note, index) => (
              <li key={index}>
                <p css={css`text-align: justify;`}>{note}</p>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </>
  )
}
