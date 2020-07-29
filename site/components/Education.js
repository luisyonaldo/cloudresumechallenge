import Container from './Container'

export default function Education({ education }) {
  return (
    <>
      {education.map(({ degree, school, startYear, endYear, notes }, index) => (
        <li key={index}>
          <Container>
            <h3>{degree}</h3>
            <h4>{startYear} - {endYear || "Present"}</h4>
          </Container>
          <Container>
            <p>{school}</p>
          </Container>
          <ul>
            {notes && notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </li>
      ))}
    </>
  )
}
