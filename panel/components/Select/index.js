import React from 'react'

const Select = ({
  placeholder = '',
  label = '',
  value,
  onChange,
  name,
  options = [],
  initial = {},
  errorMessage = ''
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
            <select
              id={'id-' + name}
              placeholder={placeholder}
              onChange={onChange}
              name={name}
              className='py-4 px-4 text-gray-900 outline-none block h-full w-full bg-transparent'
            >
              {initial && <option value={initial.id}>{initial.label}</option>}
              {options.map(opt => {
                return (
                  <option
                    key={opt.id}
                    value={opt.id}
                    selected={value === opt.id}
                  >
                    {opt.label}
                  </option>
                )
              })}
            </select>
          </p>
          {errorMessage && (
            <p className='text-red-500 pt-2 text-xs italic'>{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  )
}
export default Select
