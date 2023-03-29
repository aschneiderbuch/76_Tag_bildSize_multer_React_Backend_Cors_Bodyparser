import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import InputForm from './components/InputForm'
import SinglePost from './components/SinglePost'
import { v4 as uuidv4 } from 'uuid'

function App() {
  const [posts, setPosts] = useState()

  useEffect(() => {
    fetch("http://localhost:7777/api/getPosts")
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [])

  if (!posts) return

  return (
    <div className="App">
      <InputForm setPosts={setPosts} />
      {posts?.map((post) => {
        return (
          <SinglePost key={uuidv4()} post={post} />
        )
      })}
      {/* <img src="http://localhost:7777/images/000b2192fb2b9b140e439149e961fcea"></img> */}
    </div>

  )
}

export default App
