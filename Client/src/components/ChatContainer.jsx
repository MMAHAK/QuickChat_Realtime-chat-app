import React, { useEffect, useRef } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'

const ChatContainer = ({ selectedUser, setSelectedUser }) => {

  const scrollEnd = useRef()

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesDummyData])

  return selectedUser ? (
    <div className='h-full relative backdrop-blur-lg overflow-hidden'>

      {/* Header */}
      <div className='flex items-center gap-3 py-3 px-4 border-b border-gray-600'>
        <img src={assets.profile_martin} alt="" className="w-8 rounded-full" />

        <p className='flex-1 text-white flex items-center gap-2'>
          {selectedUser.fullName}
          <span className='w-2 h-2 bg-green-500 rounded-full'></span>
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className='md:hidden w-5 cursor-pointer'
        />

        <img
          src={assets.help_icon}
          alt=""
          className='hidden md:block w-5 cursor-pointer'
        />
      </div>

      {/* Messages */}
      <div className='overflow-y-scroll h-[calc(100%-120px)] p-4 pb-20'>

        {messagesDummyData.map((msg, index) => {

          const isMe = msg.senderId === '680f50e4f10f3cd28382ecf9';

          return (
            <div
              key={index}
              className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
            >

              <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? 'flex-row-reverse' : ''}`}>

                {/* Avatar */}
                <img
                  src={isMe ? assets.avatar_icon : assets.profile_martin}
                  alt=""
                  className='w-7 h-7 rounded-full'
                />

                {/* Message + Time */}
                <div className='flex flex-col'>

                  {msg.image ? (
                    <img
                      src={msg.image}
                      alt=""
                      className='rounded-lg max-w-[220px]'
                    />
                  ) : (
                    <div
                      className={`px-3 py-2 text-sm text-white rounded-lg ${
                        isMe
                          ? 'bg-violet-500 rounded-br-none'
                          : 'bg-gray-700 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* Time */}
                  <span
                    className={`text-[10px] text-gray-400 mt-1 ${
                      isMe ? 'text-right' : 'text-left'
                    }`}
                  >
                    {formatMessageTime(msg?.createdAt)}
                  </span>

                </div>

              </div>
            </div>
          )
        })}

        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom Input Bar */}
      <div className='absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md p-3 border-t border-gray-700'>

        <div className='flex items-center gap-3'>

          {/* Input + Image Upload */}
          <div className='flex flex-1 items-center bg-gray-800 px-3 rounded-full'>

            <input
              type="text"
              placeholder="Send a message"
              className='flex-1 bg-transparent text-sm p-3 outline-none text-white placeholder-gray-400'
            />

            {/* Hidden File Input */}
            <input
              type="file"
              id="image"
              accept="image/png, image/jpeg"
              hidden
            />

            {/* Upload Button */}
            <label htmlFor="image">
              <img
                src={assets.gallery_icon}
                alt="upload"
                className="w-5 mr-2 cursor-pointer"
              />
            </label>

          </div>

          {/* Send Button */}
          <img
            src={assets.send_button}
            alt="send"
            className="w-8 cursor-pointer hover:scale-110 transition"
          />

        </div>
      </div>

    </div>
  ) : (

    /* ----------- EMPTY STATE (NO USER SELECTED) ----------- */
    <div className='flex flex-col items-center justify-center gap-4 h-full
    bg-white/10 text-gray-400 max-md:hidden'>

      <img
        src={assets.logo_icon}
        alt="logo"
        className='max-w-16 opacity-80'
      />

      <p className='text-lg font-medium text-white'>
        Chat anytime, anywhere
      </p>

    </div>

  )
}

export default ChatContainer