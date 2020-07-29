/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import Head from 'next/head'

const P = ({ children, ...props }) => (
  <p css={css`
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  `} {...props}>
    {children}
  </p>
)

export default function Header({ profile: { email, firstName, lastName, location, headline } }) {
  const fullName = `${firstName} ${lastName}`

  return (
    <>
      <Head>
        <title>Resume - {fullName} </title>
      </Head>
      <h1 css={css`
        color: #2b6cb0;
        text-align: center;
      `}>{fullName}</h1>
      <div css={css`
        display: flex;
        flex-direction:row;
        justify-content: center;
      `}>
        <P>{email}</P>
        <P>-</P>
        <P>{location}</P>
      </div>
      <div>
        <p css={css`
          text-align: justify;
          text-indent: 10%;
        `}>{headline}</p>
      </div>
    </>
  )
}
