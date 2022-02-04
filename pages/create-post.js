import { useState, useRef, useMemo, useEffect } from 'react' // new
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css"
import { css } from '@emotion/css'
import { ethers } from 'ethers'

import Blog from '../artifacts/contracts/Blog.sol/Blog.json'
import { create } from 'ipfs-http-client'

const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"

const client = create('https://ipfs.infura.io:5001/api/v0')

const SimpleMDE = dynamic(
  () => import('react-simplemde-editor'),
  { ssr: false }
)

const initialState = { title: '', content: '' }

function CreatePost(props) {
  console.log('props:', props)
  const [post, setPost] = useState(initialState)
  const fileRef = useRef(null)
  const [image, setImage] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const { title, content } = post
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true)
    }, 1000)
  }, [])

  async function savePost(hash) {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, Blog.abi, signer)
      console.log('contract: ', contract)
      try {
        const val = await contract.createPost(post.title, hash)
        console.log('val: ', val)
        // const data = await contract.greet()
        // console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  async function savePostToIpfs() {
    console.log('post:', post)
    try {
      const added = await client.add(JSON.stringify(post))
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log('url: ', url)
      // await savePost(added.path)
    } catch (err) {
      console.log('error: ', err)
    }
  }

  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }
  async function createNewPost() {   
    if (!title || !content) return
    await savePostToIpfs()
    return

    const id = uuid() 
    post.id = id
    // If there is an image uploaded, store it in S3 and add it to the post metadata
    if (image) {
      const fileName = `${image.name}_${uuid()}`
      post.coverImage = fileName
      await Storage.put(fileName, image)
    }

    router.push(`/posts/${id}`)
  }
  function onFileChange() {
    fileRef.current.click()
  }

  function handleFileChange (e) {
    const fileUploaded = e.target.files[0];
    if (!fileUploaded) return
    setImage(fileUploaded)
  }
  return (
    <div className={container}>
      <input
        onChange={onChange}
        name="title"
        placeholder="Give it a title ..."
        value={post.title}
        className={titleStyle}
      /> 
      {
        image && (
          <img src={URL.createObjectURL(image)} />
        )
      }
      <SimpleMDE
        className={mdEditor}
        placeholder="What's on your mind?"
        value={post.content}
        onChange={value => setPost({ ...post, content: value })}
      />
      {
        loaded && (
          <>
            <button
              className={button}
              type="button"
              onClick={createNewPost}
            >Publish</button>
            <button onClick={onFileChange} className={button}>Add cover image</button>
          </>
        )
      }

      <input id='selectImage' className={hiddenInput} type="file" onChange={handleFileChange} ref={fileRef} />
    </div>
  )
}

const hiddenInput = css`
  display: none;
`

const mdEditor = css`
  margin-top: 40px;
`

const titleStyle = css`
  margin-top: 40px;
  border: none;
  outline: none;
  background-color: inherit;
  font-size: 44px;
  font-weight: 600;
  &::placeholder {
    color: #999999;
  }
`

const container = css`
  width: 800px;
  margin: 0 auto;
`

const button = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 18px;
  padding: 16px 70px;
  box-shadow: 7px 7px rgba(0, 0, 0, .1);
`

export default CreatePost