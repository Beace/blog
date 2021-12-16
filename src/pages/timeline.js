import * as React from "react"
import { graphql, useStaticQuery, Link } from 'gatsby'
import Layout from '../components/layout'
import * as styles from './index.module.css'
export const query = graphql`
  query {
    allMdx(sort: {fields: frontmatter___date, order: DESC}) {
      group(field: fields___year) {
        fieldValue
        totalCount
        edges {
          node {
            id
            slug
            frontmatter {
              title
              date(formatString: "YYYY-MM-DD")
            }
            fields {
              year
              month
              year_month
              day
            }
          }
        }
      }
    }
  }
`
const IndexPage = () => {
  const data = useStaticQuery(query)
  console.log(data)
  const {allMdx: {group}} = data
  return (
    <Layout pageTitle="Home">
      <div className={`${styles.container} markdown-body`}>
        {
          group.map(node => (
            <ul key={node.fieldValue}>
              <h2>{node.fieldValue}({node.totalCount}篇)</h2>
              {node.edges.map(edge => <li key={edge.node.id}><Link to={`/blog/${edge.node.slug}`}>[{edge.node.frontmatter.date}] {edge.node.frontmatter.title}</Link></li>)}
            </ul>
          ))}
      </div>
    </Layout>
  )
}

export default IndexPage
