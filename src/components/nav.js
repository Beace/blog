import * as React from 'react'
import { Link } from 'gatsby'
import * as styles from './nav.module.css'
import Search from "./search"

const searchIndices = [{ name: `Pages`, title: `Pages` }]

const Nav = () => (
  <nav className={styles.topNav}>
    <div className={styles.topNavInner}>
      <div className={styles.topNavContainer}>
        <Link
          to="/"
          className={styles.topNavItem}
          activeClassName={styles.active}
        >
          <i className="iconfont icon-home" />
          <span>HOME</span>
        </Link>
        {/* <Link
          to="/tags"
          className={styles.topNavItem}
          activeClassName={styles.active}
        >
          <i className="iconfont icon-tags" />
          TAGS
        </Link> */}
        <Link
          to="/timeline"
          className={styles.topNavItem}
          activeClassName={styles.active}
        >
          <i className="iconfont icon-timeline" />
          <span>TIMELINE</span>
        </Link>
        <Link
          to="/about/"
          className={styles.topNavItem}
          activeClassName={styles.active}
        >
          <i className="iconfont icon-about" />
          <span>About</span>
        </Link>
        <a
          href="https://github.com/BeAce"
          target="_blank"
          rel="noreferrer"
          className={styles.topNavItem}
        >
          <i className="iconfont icon-GitHub" />
          <span>GitHub</span>
        </a>
        <Link
          to="/friends/"
          className={styles.topNavItem}
          activeClassName={styles.active}
        >
          <i className="iconfont icon-about" />
          <span>Friends</span>
        </Link>
      </div>
      <Search indices={searchIndices} />
    </div>
  </nav>
)

export default Nav
