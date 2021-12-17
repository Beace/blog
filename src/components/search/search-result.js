import { Link } from "gatsby"
import * as React from "react"
import {
  Highlight,
  Hits,
  Index,
  Snippet,
} from "react-instantsearch-dom"

const PageHit = ({ hit }) => (
  <Link to={`/blog/${hit.slug}`}>
    <h6>
      <Highlight attribute="title" hit={hit} tagName="mark" />
    </h6>
    <Snippet attribute="excerpt" hit={hit} tagName="mark" />...
  </Link>
)
const HitsInIndex = ({ index }) => (
  <Index indexName={index.name}>
    <Hits className="Hits" hitComponent={PageHit} />
  </Index>
)
const SearchResult = ({ indices, className }) => (
  <div className={className}>
    {indices.map(index => (
      <HitsInIndex index={index} key={index.name} />
    ))}
  </div>
)
export default SearchResult