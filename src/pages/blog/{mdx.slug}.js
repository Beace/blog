import * as React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'

import Layout from '../../components/layout'
import * as styles from './slug.module.css'

const BlogPost = ({ data }) => {
  console.log(data)
  return (
    <Layout pageTitle={data.mdx.frontmatter.title}>
      <div className={styles.container}>
        <div className={styles.head}>
          <h1>{data.mdx.frontmatter.title}</h1>
          <p className={styles.desc}>{data.mdx.frontmatter.date}</p>
        </div>
        <div className="markdown-body">
          <MDXRenderer>
            {data.mdx.body}
          </MDXRenderer>
        </div>
      </div>
    </Layout>
  )
}
export const query = graphql`
  query ($id: String) {
    mdx(id: {eq: $id}) {
      frontmatter {
        title
        date(formatString: "MMMM D, YYYY")
      }
      body
    }
  }
`

export default BlogPost