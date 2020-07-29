import Header from '../components/Header'
import Section from '../components/Section'
import Experience from '../components/Experience'
import Education from '../components/Education'
import Certifications from '../components/Certifications'
import Skills from '../components/Skills'
import Visits from '../components/Visits'

import resume from '../data/resume'

export default function Home({ resume: { profile, organizations, education, certifications, skills } }) {
  return (
    <div>
      <Header profile={profile} />
      <main>
        <Section title="Work Experience">
          <Experience organizations={organizations} />
        </Section>
        <Section title="Education">
          <Education education={education} />
        </Section>
        <Section title="Certifications">
          <Certifications certifications={certifications} />
        </Section>
        <Section title="Technologies and Languages">
          <Skills skills={skills} />
        </Section>
        <Visits />
      </main>
    </div>
  )
}

export function getStaticProps() {
  return {
    props: {
      resume,
    }
  }
}
