import Input from '../components/Input'
import { useFormik } from 'formik'
import Button from '../components/Button'
import { useMutation } from '../lib/graphql'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Alert from '../components/Alert'

const AUTH = `
    mutation auth($email: String!, $passwd: String!){
        auth(input:{
        email: $email,
        passwd: $passwd
      }){
        refreshToken
        accessToken
      }  
    }
    `

const Index = () => {
  const router = useRouter()
  const [authData, auth] = useMutation(AUTH)
  const [signInError, setSignInError] = useState(false)
  const form = useFormik({
    initialValues: {
      email: '',
      passwd: ''
    },
    onSubmit: async values => {
      const data = await auth(values)
      if (data && data.data) {
        localStorage.setItem('refreshToken', data.data.auth.refreshToken)
        localStorage.setItem('accessToken', data.data.auth.accessToken)
        router.push('/dashboard')
      } else {
        setSignInError(true)
      }
    }
  })
  useEffect(() => {
    let timer = setInterval(() => {
      if (
        localStorage.getItem('refreshToken') &&
        localStorage.getItem('accessToken')
      ) {
        router.push('/dashboard')
      }
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className='bg-grey-lighter min-h-screen flex flex-col'>
      <div className='container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2'>
        <div className='bg-white px-6 py-8 rounded shadow-md text-black w-full'>
          {signInError && <Alert>E-mail e/ou Senha Inválidos</Alert>}
          <h1 className='mb-8 text-3xl text-center'>Sign In</h1>
          <form onSubmit={form.handleSubmit}>
            <Input
              label='E-mail'
              placeholder='Preencha com o E-mail'
              value={form.values.email}
              onChange={form.handleChange}
              name='email'
              errorMessage={form.errors.email}
            />

            <Input
              label='Senha'
              placeholder='Coloque a sua  Senha'
              value={form.values.passwd}
              onChange={form.handleChange}
              name='passwd'
              errorMessage={form.errors.passwd}
            />

            <Button>Entrar</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Index
