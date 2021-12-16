import * as React from 'react'

import { Disqus } from 'gatsby-plugin-disqus'

const Comment = ({ title, id }) => {
  const disqusConfig = {
    url: window.location.href,
    identifier: id,
    title: title,
  }
  return (
    <Disqus config={disqusConfig} />
  )
}

export default Comment