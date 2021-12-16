import * as React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Disqus } from 'gatsby-plugin-disqus'

const Comment = ({ path, title, id }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `)

  const disqusConfig = {
    url: `${data.site.siteMetadata.siteUrl}/blog/${path}`,
    identifier: id,
    title: title,
  }
  return (
    <Disqus config={disqusConfig} />
  )
}

export default Comment