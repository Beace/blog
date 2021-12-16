import * as React from "react"
import { graphql, useStaticQuery, Link } from 'gatsby'
import Layout from '../components/layout'
import * as styles from './index.module.css'
export const query = graphql`
  query {
    allMdx(sort: {fields: frontmatter___date, order: DESC}) {
      nodes {
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          title
        }
        id
        slug
      }
    }
  }
`
const IndexPage = () => {
  const data = useStaticQuery(query)
  console.log(data)
  return (
    <Layout pageTitle="Home">
      <div className={styles.container}>
        {
          data.allMdx.nodes.map(node => (
            <article key={node.id} className={styles.article}>
              <h2 className={styles.title}>
                <Link to={`/blog/${node.slug}`}>
                  {node.frontmatter.title}
                </Link>
              </h2>
              <p className={styles.desc}>Posted: {node.frontmatter.date}</p>
            </article>
          ))}
      </div>
    </Layout>
  )
}

export default IndexPage
