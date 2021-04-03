import React from 'react'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import { useQuery, useMutation } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Alert from '../../components/Alert'

const CREATE_CATEGORY = `
    mutation createCategory($name: String!, $slug: String!){
      createCategory(input:{
        name: $name,
        slug: $slug
      }){
        id
        name
        slug
      }  
    }
    `
const Index = () => {
  const router = useRouter()
  const [data, createCategory] = useMutation(CREATE_CATEGORY)
  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    onSubmit: async values => {
      const data = await createCategory(values)
      if (data && !data.errors) {
        router.push('/categories')
      }
    }
  })
  return (
    <Layout>
      <div className='container mx-auto px-6 py-8'>
        <Title>Criar Nova Categoria</Title>
        <div className='mt-8'></div>

        <div>
          <Button.LinkOutline href='/categories'>Voltar</Button.LinkOutline>
        </div>
        <div className='flex flex-col mt-8'>
          <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
            <div className='align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200'>
              <form onSubmit={form.handleSubmit}>
                <div className=' px-8 mb-6 md:mb-0 bg-white py-8 '>
                  {data && !!data.errors && (
                    <Alert>Ocorreu um erro ao Salvar os dados!!</Alert>
                  )}
                  <Input
                    label='Nome da categoria'
                    placeholder='Preencha com o nome da categoria'
                    value={form.values.name}
                    onChange={form.handleChange}
                    name='name'
                  />
                  <Input
                    label='Slug da categoria'
                    placeholder='Preencha com o Slug da Categoria'
                    value={form.values.slug}
                    onChange={form.handleChange}
                    name='slug'
                  />
                  <Button>Criar Categoria</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Index
