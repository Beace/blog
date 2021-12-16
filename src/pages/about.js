import * as React from 'react'
import Layout from '../components/layout'

const About = () => (
  <Layout  pageTitle="About">
    <div className="container">
      <div className="markdown-body">
        <h2>个人简介</h2>
        <p>专注<code>web</code>领域开发。如今从事<code>React.js</code>及<code>Node.js</code>相关技术（栈）开发。</p>
        <h2>联系我</h2>
        <h3>Email</h3>
        <p>beaceshimin@gmail.com</p>
        <h3>Wechat</h3>
        <p>beaceshimin</p>
      </div>

    </div>
  </Layout>
)

export default About