import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { css } from '@emotion/css'

const ipfsURI = "https://ipfs.io/ipfs/"

export default function Post() {
  const [post, setPost] = useState(null)
  const router = useRouter()
  const { id } = router.query
  console.log('router: ', router)
  useEffect(() => {
    fetchPost()
  }, [id])
  async function fetchPost() {
    if (!id) return
    const ipfsUrl = `${ipfsURI}/${id}`
    const response = await fetch(ipfsUrl)
    const data = await response.json()
    if(data.coverImage) {
      let coverImage = `${ipfsURI}/${data.coverImage}`
      data.coverImage = coverImage
    }
    console.log('data:', data)
    setPost(data)
  }
  if (!post) return null
  return (
    <div>
      {
        post && (
          <div className={container}>
            {
              post.coverImage && (
                <img
                  src={post.coverImage}
                  className={coverImageStyle}
                />
              )
            }
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

const coverImageStyle = css`
  width: 900px;
`

const container = css`
  width: 900px;
  margin: 0 auto;
`

const contentContainer = css`
  margin-top: 60px;
  padding: 0px 40px;
  border-left: 1px solid #e7e7e7;
  border-right: 1px solid #e7e7e7;
  & img {
    max-width: 900px;
  }
`