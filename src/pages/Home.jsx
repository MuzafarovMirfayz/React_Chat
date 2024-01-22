import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'

const Home = () => {
  return (
    <div className='home'>
      <div className="container">
        <Sidebar/>
        <Chat/>
        {/* <h6>DASDSADASDASDADS</h6> */}
      </div>
    </div>
  )
}

export default Home