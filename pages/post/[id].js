import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    readFromIPFS()
  }, [router.query.id])
  async function readFromIPFS() {
    if(!router.query.id) return
  }
  return (
    <div>
      <h1>Hello</h1>
    </div>
  )
}

