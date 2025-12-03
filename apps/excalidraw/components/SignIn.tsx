import React from 'react'

const SignInComponent = () => {

  return (
    <div className='bg-slate-700'>
      <div>
        <input
        type='email'
        placeholder='Enter Your Email'
        />
      </div>
      <div>
        <input
        type='password'
        placeholder='Enter Your Password'
        />
      </div>
    </div>
  )
}

export default SignInComponent
