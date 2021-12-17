import styled, { css } from "styled-components"
import SearchBox from "./search-box"

export default styled(SearchBox)`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: 0;
  .SearchInput {
    outline: none;
    height: 20px;
    border: ${({ hasFocus }) => (hasFocus ? "1px solid #30363d" : "1px solid #000")};
    font-size: 1em;
    transition: 100ms;
    padding: 4px 16px;
    font-size: 14px;
    border-radius: 4px;
    color: #333;
  }
`