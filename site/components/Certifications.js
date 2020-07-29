/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import Container from './Container'

export default function Certification({ certifications }) {
  return (
    <>
      {certifications.map(({ name, startMonthYear, endMonthYear, authority, url }, index) => (
        <li key={index}>
          <Container>
            <h3>
              <a href={url} target="_blank" css={css`
                text-decoration: none;
                color: inherit;
                :hover {
                  color: #2b6cb0;
                }
              `}>
                {name}
              </a>
            </h3>
            <h4>{startMonthYear} {endMonthYear && ("- " + endMonthYear)}</h4>
          </Container>
          <Container>
            <p>{authority}</p>
          </Container>
        </li>
      ))}
    </>
  )
}
