import * as React from "react"
import Layout from '../components/layout'

const FriendsPage = () => {
  return (
    <Layout pageTitle="Friends">
      <div className="container">
        <div className="markdown-body">
          <h2>友链</h2>
          <ul>
            <li>
              <a href="https://kalasearch.cn/" rel="noreferrer" target="_blank">卡拉搜索</a>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default FriendsPage
