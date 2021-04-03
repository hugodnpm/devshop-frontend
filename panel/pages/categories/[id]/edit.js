import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '../../../lib/graphql'
import { useFormik } from 'formik'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import Alert from '../../../components/Alert'

const UPDATECATEGORY = `
mutation updateCategory($id: String!, $name: String!, $slug: String!){
    updateCategory (input: {
        id: $id,
        name: $name,
        slug: $slug
    }) {
        id
        name
        slug
    }
}`

const Edit = () => {
  const router = useRouter()
  const { data } = useQuery(`
  query{
    getCategoryById(id:"${router.query.id}"){
      name
      slug
    }
  }
  `)
  const [updatedData, updateCategory] = useMutation(UPDATECATEGORY)
  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    onSubmit: async values => {
      const category = {
        ...values,
        id: router.query.id
      }
      const data = await updateCategory(category)
      if (data && !data.errors) {
        router.push('/categories')
      }
    }
  })
  //passou os dados para o formulário
  useEffect(() => {
    if (data && data.getCategoryById) {
      form.setFieldValue('name', data.getCategoryById.name)
      form.setFieldValue('slug', data.getCategoryById.slug)
    }
  }, [data])
  return (
    <Layout>
      <div className='container mx-auto px-6 py-8'>
        <Title>Editar Categoria</Title>
        <div className='mt-8'></div>

        <div className='flex flex-col mt-8'>
          <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
            <div className='align-middle inline-block min-w-full overflow-hidden sm:rounded-lg border-b border-gray-200'></div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit}>
          <div className=' px-8 mb-6 md:mb-0 bg-white py-8 '>
            {updatedData && !!updatedData.errors && (
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
            <Button>Salvar Categoria</Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
export default Edit
