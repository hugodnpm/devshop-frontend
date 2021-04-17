import React from 'react'
import * as Yup from 'yup'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import { useQuery, useMutation, fetcher } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Select from '../../components/Select'
import Alert from '../../components/Alert'

const CREATE_PRODUCT = `
    mutation createProduct($name: String!, $slug: String!, $category: String!, $description: String!){
      createProduct(input: {
        name: $name,
        slug: $slug,
        category: $category,
        description: $description
      }){
        id
        name
        description
        }
     
    }
    `
const GET_ALL_CATEGORIES = `
    query{
      getAllCategories{
        id
        name
        slug
      }
    }
    `
const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Por favor, informe pelo menos um nome com 3 caracteres')
    .required('Campo obrigatório!!'),
  slug: Yup.string()
    .min(3, 'Por favor, informe pelo menos um slug com 3 caracteres')
    .required('Campo obrigatório!!')
    .test(
      'is-unique',
      'Por favor, utilize outro slug. Este já está e uso',
      async value => {
        const ret = await fetcher(
          JSON.stringify({
            query: `
            query{
              getProductBySlug(slug:"${value}"){
                id
              }
            }
            `
          })
        )
        if (ret.errors) {
          return true
        }
        return false
      }
    ),
  description: Yup.string()
    .min(20, 'Por favor, informe pelo menos um descrição com 20 caracteres')
    .required('Informe uma descrição'),

  category: Yup.string()
    .min(1, 'Por favor, selecione uma categoria.')
    .required('Por favor, selecione uma categoria.')
})
const Index = () => {
  const router = useRouter()
  const [data, createProduct] = useMutation(CREATE_PRODUCT)
  const { data: categories, mutate } = useQuery(GET_ALL_CATEGORIES)

  const form = useFormik({
    initialValues: {
      name: '',
      slug: '',
      description: '',
      category: ''
    },
    validationSchema: ProductSchema,
    onSubmit: async values => {
      const data = await createProduct(values)
      if (data && !data.errors) {
        router.push('/products')
      }
    }
  })
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
        <Title>Criar Novo Produto</Title>
        <div className='mt-8'></div>
        <div>
          <Button.LinkOutline href='/products'>Voltar</Button.LinkOutline>
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
                    label='Nome do Produto'
                    placeholder='Preencha com o nome do Produto'
                    value={form.values.name}
                    onChange={form.handleChange}
                    name='name'
                    errorMessage={form.errors.name}
                  />
                  <Input
                    label='Slug do Produto'
                    placeholder='Preencha com o Slug do Produto'
                    value={form.values.slug}
                    onChange={form.handleChange}
                    name='slug'
                    errorMessage={form.errors.slug}
                  />
                  <Input
                    label='Descrição do Produto'
                    placeholder='Preencha com a descrição do Produto'
                    value={form.values.description}
                    onChange={form.handleChange}
                    name='description'
                    errorMessage={form.errors.description}
                  />
                  <Select
                    label='Selecione a sua categoria'
                    name='category'
                    onChange={form.handleChange}
                    value={form.values.category}
                    options={options}
                    errorMessage={form.errors.category}
                    initial={{ id: '', label: 'Selecione...' }}
                  />
                  <Button>Criar Produto</Button>
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
