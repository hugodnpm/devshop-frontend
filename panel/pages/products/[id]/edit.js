import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '../../../lib/graphql'
import { useFormik } from 'formik'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import Select from '../../../components/Select'
import Alert from '../../../components/Alert'

const UPDATEPRODUCT = `
mutation updateProduct($id: String!, $name: String!, $slug: String!, $description: String!, $category: boolean!){
    updateProduct (input: {
        id: $id,
        name: $name,
        slug: $slug,
        description: $description,
        category: $category
    }) {
        id
        name
        slug
        description
        category
    }
}`
const GET_ALL_CATEGORIES = `
    query{
      getAllCategories{
        id
        name
        slug
      }
    }
    `
const Edit = () => {
  const router = useRouter()
  const { data } = useQuery(`
  query{
    getProductById(id:"${router.query.id}"){
      name
      slug
      description
      category
    }
  }
  `)
  const { data: categories, mutate } = useQuery(GET_ALL_CATEGORIES)
  const [updatedData, updateProduct] = useMutation(UPDATEPRODUCT)
  const form = useFormik({
    initialValues: {
      name: '',
      slug: '',
      description: '',
      category: ''
    },
    onSubmit: async values => {
      const product = {
        ...values,
        id: router.query.id
      }
      const data = await updateProduct(product)
      if (data && !data.errors) {
        router.push('/products')
      }
    }
  })
  //passou os dados para o formulário
  useEffect(() => {
    if (data && data.getProductById) {
      form.setFieldValue('name', data.getProductById.name)
      form.setFieldValue('slug', data.getProductById.slug)
      form.setFieldValue('description', data.getProductById.description)
      form.setFieldValue('category', data.getProductById.category)
    }
  }, [data])
  //tratar options:
  let options = []
  if (categories && categories.getAllCategories) {
    options = categories.getAllCategories.map(item => {
      return {
        id: item.id,
        label: item.name
      }
    })
  }

  return (
    <Layout>
      <div className='container mx-auto px-6 py-8'>
        <Title>Editar Produto</Title>
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
              label='Nome do Produto'
              placeholder='Preencha com o nome do Produto'
              value={form.values.name}
              onChange={form.handleChange}
              name='name'
            />
            <Input
              label='Slug do Produto'
              placeholder='Preencha com o Slug do Produto'
              value={form.values.slug}
              onChange={form.handleChange}
              name='slug'
            />
            <Input
              label='Descrição do Produto'
              placeholder='Preencha com a descrição do Produto'
              value={form.values.description}
              onChange={form.handleChange}
              name='description'
            />
            <Select
              label='Selecione a sua categoria'
              name='category'
              onChange={form.handleChange}
              value={form.values.category}
              options={options}
            />
            <Button>Salvar Produto</Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
export default Edit
