exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === "Mdx") {
    const date = new Date(node.frontmatter.date)

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const year_month = `${year}-${month}`
    const day = date.getDate()

    createNodeField({ node, name: "year", value: year })
    createNodeField({ node, name: "month", value: month })
    createNodeField({ node, name: "year-month", value: year_month })
    createNodeField({ node, name: "day", value: day })
  }
}