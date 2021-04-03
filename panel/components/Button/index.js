import Link from 'next/link'
import React from 'react'

const Button = ({ children, type = 'submit' }) => {
  return (
    <div className='pl-6'>
      <button
        type={type}
        className='inline-block pl-6 px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-blue-600 rounded shadow ripple hover:shadow-lg hover:bg-blue-800 focus:outline-none'
      >
        {children}
      </button>
    </div>
  )
}
const ButtonLink = ({ href, children }) => {
  return (
    <Link href={href}>
      <a className='inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-blue-600 rounded shadow ripple hover:shadow-lg hover:bg-blue-500 focus:outline-none'>
        {children}
      </a>
    </Link>
  )
}
const ButtonLinkOutline = ({ href, children }) => {
  return (
    <Link href={href}>
      <a className='inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-blue-700 uppercase transition bg-transparent border-2 border-blue-700 rounded ripple hover:bg-blue-500 hover:text-white focus:outline-none waves-effect'>
        {children}
      </a>
    </Link>
  )
}

Button.Link = ButtonLink
Button.LinkOutline = ButtonLinkOutline
export default Button
