import { useState, useRef, useMemo, useEffect } from 'react' // new
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css"
import { css } from '@emotion/css'

import Arweave from 'arweave'

/* connect to an Arweave node or specify a gateway  */
const arweave = Arweave.init({});

const SimpleMDE = dynamic(
  () => import('react-simplemde-editor'),
  { ssr: false }
)

const initialState = { title: '', content: '' }

function CreatePost() {
  const [post, setPost] = useState(initialState)
  const [image, setImage] = useState(null)
  const hiddenFileInput = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const { title, content } = post
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true)
    }, 100)
  }, [])

  async function saveToArweave() {
    try {
      console.log('content: ', post.content)
      let transaction = await arweave.createTransaction({ data: post.content })
      await arweave.transactions.sign(transaction)
      let uploader = await arweave.transactions.getUploader(transaction)

      while (!uploader.isComplete) {
        await uploader.uploadChunk()
        // console.log(
        //   `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`,
        // )
      }
      console.log('transaction:', transaction)
    } catch (err) {
      console.log('error: ', err)
    }
  }

  const options = useMemo(() => {
    return {
      placeholder: "What's on your mind?"
    }
  }, []);

  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }
  async function createNewPost() {
    await saveToArweave()
    return
    if (!title || !content) return
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
  async function uploadImage() {
    hiddenFileInput.current.click();
  }
  function handleChange (e) {
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
        options={options}
        onChange={value => setPost({ ...post, content: value })}
      />
      {
        loaded && (
          <button
            className={button}
            type="button"
            onClick={createNewPost}
          >Create Post</button>
        )
      }
    </div>
  )
}

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
  width: 900px;
  margin: 0 auto;
`

const button = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 16px;
  padding: 10px 30px;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 10px;
  box-shadow: 7px 7px rgba(0, 0, 0, .1);
`

export default CreatePost