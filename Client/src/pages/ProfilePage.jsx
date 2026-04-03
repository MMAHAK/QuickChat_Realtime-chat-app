import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';

const ProfilePage = () => {

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate()

  const [name, setName] = useState("Martin Johnson")
  const [bio, setBio] = useState("Hi Everyone, I am Using QuickChat")

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate("/") // redirect to homepage
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-cover bg-no-repeat'>
      
      <div className='w-[90%] max-w-2xl backdrop-blur-2xl text-gray-300 border border-gray-600 rounded-xl shadow-lg'>
        
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 p-8"
        >

          <h3 className="text-xl font-semibold text-center">Profile Details</h3>

          {/* Upload Image */}
          <label 
            htmlFor="avatar" 
            className='flex items-center justify-center gap-4 cursor-pointer'
          >
            <input 
              type="file" 
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
              onChange={(e)=>setSelectedImg(e.target.files[0])}
            />

            <img 
              src={selectedImg 
                ? URL.createObjectURL(selectedImg) 
                : assets.avatar_icon
              }
              alt="avatar"
              className={`w-14 h-14 object-cover ${selectedImg ? 'rounded-full' : ''}`}
            />

            <span className="text-sm text-gray-400">
              Upload profile image
            </span>
          </label>

          {/* Name */}
          <input
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="p-2 border border-gray-500 rounded-md bg-transparent focus:outline-none"
            placeholder="Your name"
          />

          {/* Bio */}
          <textarea
            value={bio}
            onChange={(e)=>setBio(e.target.value)}
            rows={3}
            className="p-2 border border-gray-500 rounded-md bg-transparent focus:outline-none"
            placeholder="Your bio"
          />

          {/* Button */}
          <button 
            type="submit"
            className="bg-violet-500 hover:bg-violet-600 transition text-white py-2 rounded-md"
          >
            Save Profile
          </button>

        </form>

      </div>
    </div>
  )
}

export default ProfilePage