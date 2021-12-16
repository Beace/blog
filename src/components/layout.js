import * as React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import Helmet from "react-helmet"
import { jsx, Themed } from 'theme-ui'
import Nav from './nav'
import '../global.css'
import './font.css'
const Layout = ({ pageTitle, children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)


  return (
    <div>
      <Helmet>
        <title>{pageTitle} | {data.site.siteMetadata.title}</title>
        {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism-dark.min.css"></link> */}
        {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/github-dark.min.css"></link> */}
      </Helmet>
      <Nav />
      <main>
        {children}
      </main>
    </div>
  )
}
export default Layout