import { useEffect, useState } from 'react'
import { css } from '@emotion/css'
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter()
  async function navigate() {
    router.push('/create-post')
  }
  return (
    <div className={container}>
      <button className={buttonStyle} onClick={navigate}>
        Create your first post
        <img
          src='/right-arrow.svg'
          alt="Right arrow"
          className={arrow}
        />
        </button>
    </div>
  )
}

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