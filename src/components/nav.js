import * as React from 'react'
import { Link } from 'gatsby'
import * as styles from './nav.module.css'
const Nav = () => (
  <nav className={styles.topNav}>
    <div className={styles.topNavContainer}>
      <Link
        to="/"
        className={styles.topNavItem}
        activeClassName={styles.active}
      >
        <i className="iconfont icon-home" />
        HOME
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
        TIMELINE
      </Link>
      <Link
        to="/about/"
        className={styles.topNavItem}
        activeClassName={styles.active}
      >
        <i className="iconfont icon-about" />
        About
      </Link>
      <a
        href="https://github.com/BeAce"
        target="_blank"
        className={styles.topNavItem}
      >
        <i className="iconfont icon-GitHub" />
        GitHub
      </a>
      <Link
        to="/friends/"
        className={styles.topNavItem}
        activeClassName={styles.active}
      >
        <i className="iconfont icon-about" />
        Friends
      </Link>
    </div>
  </nav>
)

export default Nav
