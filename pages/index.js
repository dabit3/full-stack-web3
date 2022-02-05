import { useEffect, useState } from 'react'
import { css } from '@emotion/css'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import Link from 'next/link'

import {
  contractAddress
} from '../config'

import Blog from '../artifacts/contracts/Blog.sol/Blog.json'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loadingState, setLoadingState] = useState('loading')
  useEffect(() => {
    fetchPosts()
  }, [])
  const router = useRouter()
  async function navigate() {
    router.push('/create-post')
  }
  async function fetchPosts() {
    const provider = new ethers.providers.JsonRpcProvider()

    const contract = new ethers.Contract(contractAddress, Blog.abi, provider)
    const data = await contract.fetchPosts()
    console.log({ data })
    setPosts(data)
    setLoadingState('loaded')
  }
  if (loadingState === 'loading') {
    return <h2>Loading...</h2>
  }
  console.log('posts: ', posts)
  return (
    <div>
      <div className={postList}>
        {
          posts.map((post, index) => (
            <Link href={`/post/${post.items[0]}`} key={index}>
              <a>
                <div className={linkStyle}>
                  <p className={postTitle}>{post[1]}</p>
                  <div className={arrowContainer}>
                  <img
                      src='/right-arrow.svg'
                      alt="Right arrow"
                      className={smallArrow}
                    />
                  </div>
                </div>
              </a>
            </Link>
          ))
        }
      </div>
      <div className={container}>
        {
          posts && !posts.length && (
            <button className={buttonStyle} onClick={navigate}>
              Create your first post
              <img
                src='/right-arrow.svg'
                alt="Right arrow"
                className={arrow}
              />
            </button>
          )
        }
      </div>
    </div>
  )
}

const arrowContainer = css`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding-right: 20px;
`

const postTitle = css`
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
  margin: 0;
  padding: 20px;
`

const linkStyle = css`
  border: 1px solid #ddd;
  margin-top: 20px;
  border-radius: 8px;
  display: flex;
`

const postList = css`
  width: 700px;
  margin: 0 auto;
  padding-top: 50px;  
`

const container = css`
  display: flex;
  justify-content: center;
`

const buttonStyle = css`
  margin-top: 100px;
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 44px;
  padding: 20px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, .1);
`

const arrow = css`
  width: 35px;
  margin-left: 30px;
`

const smallArrow = css`
  width: 25px;
`