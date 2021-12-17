import styled, { css } from "styled-components"
import SearchResult from "./search-result"
const Popover = css`
  max-height: 80vh;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  box-shadow: rgba(255, 255, 255,.2) 0px 2px 8px 0px;
  z-index: 2;
  right: 0;
  top: 100%;
  width: 80vw;
  max-width: 30em;
  margin-top: 0.5em;
  padding: 1em;
  border-radius: 6px;
  background: ${({ theme }) => theme.background};
  color: #333;
`
export default styled(SearchResult)`
  display: ${props => (props.show ? `block` : `none`)};
  ${Popover}
  .HitCount {
    display: flex;
    justify-content: flex-end;
  }
  .Hits {
    line-height: 16px;
    ul {
      list-style: none;
      margin-left: 0;
    }
    li.ais-Hits-item {
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 1em;
      cursor: pointer;
      background-color: #333;
      transition: all .3s;
      &:hover {
        background-color: #666;
        color: #fff;
        a {
          color: #fff;
        }
        .ais-Snippet {
          color: #ccc;
        }
      }
      a {
        color: ${({ theme }) => theme.foreground};
        h6 {
          font-size: 14px;
          margin-bottom: 4px;
          font-weight: bold;
        }
      }
      .ais-Snippet {
        font-size: 12px;
        line-height: 24px;
        color: #bbb;
      }
    }
  }
  .ais-PoweredBy {
    display: flex;
    justify-content: flex-end;
    font-size: 80%;
    svg {
      width: 70px;
    }
  }
`