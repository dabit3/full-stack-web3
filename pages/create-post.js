import { useState, useRef, useMemo } from 'react' // new
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css"
import { css } from '@emotion/css'
import ReactMarkdown from 'react-markdown'

const SimpleMDE = dynamic(
  () => import('react-simplemde-editor'),
  { ssr: false }
)

const initialState = { title: '', content: '' }

function CreatePost() {
  const [post, setPost] = useState(initialState)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(false)
  const hiddenFileInput = useRef(null);
  const { title, content } = post
  const router = useRouter()

  const options = useMemo(() => {
    return {
      placeholder: "What's on your mind?"
    }
  }, []);

  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }
  async function createNewPost() {
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
      <button onClick={() => setPreview(!preview)}>Preview</button>
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
      {
        preview && (
          <ReactMarkdown children={post.content} />
        )
      }
      {
        !preview && (
          <SimpleMDE
          className={mdEditor}
          placeholder="What's on your mind?"
          value={post.content}
          options={options}
          onChange={value => setPost({ ...post, content: value })}
        />
        )
      }
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
      />
      <button
        onClick={uploadImage}        
      >
        Upload Cover Image
      </button>
      <button
        type="button"
        onClick={createNewPost}
      >Create Post</button>
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

export default CreatePost