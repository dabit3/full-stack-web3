import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav style={nav}>
        <Link href="/" >
          <a style={link}>
            Home
          </a>
        </Link>
        <Link href="/create-post">
          <a style={link}>
            Create Post
          </a>
        </Link>
        <Link href="/profile">
          <a style={link}>
          Profile
          </a>
        </Link>
      </nav>
      <div className="py-8 px-16">
        <Component {...pageProps} />
      </div>
    </div>
  )
}

const nav = {
  padding: '40px 80px',
  display: 'flex'
}

const link = {
  margin: '0px 40px 0px 0px',
  fontSize: '24px'
}

export default MyApp