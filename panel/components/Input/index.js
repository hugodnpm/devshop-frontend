import React from 'react'

const Input = ({
  type = 'text',
  placeholder = '',
  label = '',
  value,
  onChange,
  name
}) => {
  return (
    <div className='p-6 '>
      <div className=' '>
        <div className='border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1'>
          <div className='-mt-4 absolute tracking-wider px-1 uppercase text-xs'>
            <p>
              <label
                htmlFor={'id-' + name}
                className='bg-white text-gray-600 px-1'
              >
                {label}
              </label>
            </p>
          </div>
          <p>
            <input
              id={'id-' + name}
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              name={name}
              className='py-4 px-4 text-gray-900 outline-none block h-full w-full'
            />
          </p>
        </div>
      </div>
    </div>
  )
}
export default Input
