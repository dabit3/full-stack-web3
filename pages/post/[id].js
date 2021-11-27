import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Arweave from 'arweave'

const arweave = Arweave.init({});

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    readFromArweave()
  }, [router.query.id])
  async function readFromArweave() {
    if(!router.query.id) return
    arweave.transactions
      .getData(router.query.id, {
        decode: true,
        string: true,
      })
      .then((data) => {
        console.log('data: ', data)
      })
      .catch(err => console.log({ err }))
  }
  return (
    <div>
      <h1>Hello</h1>
    </div>
  )
}

