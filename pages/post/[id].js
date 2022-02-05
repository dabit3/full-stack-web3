import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { css } from '@emotion/css'

export default function Home() {
  const [post, setPost] = useState(null)
  const router = useRouter()
  const ipfsHash = router.query.id
  useEffect(() => {
    readFromIPFS()
  }, [router.query.id])
  async function readFromIPFS() {
    if(!ipfsHash) return
    console.log('id: ', ipfsHash)
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`
    console.log('ipfsurl:', ipfsUrl)
    fetchMetadata(ipfsUrl)
  }
  async function fetchMetadata(ipfsUrl) {
    const response = await fetch(ipfsUrl)
    const data = await response.json()
    console.log('data: ', data)
    setPost(data)
  }
  return (
    <div>
      {
        post && (
          <div className={container}>
            <h1>{post.title}</h1>
            <div className={contentContainer}>
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        )
      }
    </div>
  )
}

const container = css`
  width: 900px;
  margin: 0 auto;
`

const contentContainer = css`
  margin-top: 60px;
  padding: 0px 40px;
  border-left: 1px solid #e7e7e7;
  border-right: 1px solid #e7e7e7;
`