import React, { useEffect } from 'react'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import { useMutation, useQuery, fetcher } from '../../../lib/graphql'
import { useFormik } from 'formik'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import Alert from '../../../components/Alert'

let id = ''
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

const CategorySchema = Yup.object().shape({
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
          getCategoryBySlug(slug:"${value}"){
            id
          }
        }
        `
          })
        )
        if (ret.errors) {
          return true
        }
        if (ret.data.getCategoryBySlug.id === id) {
          return true
        }

        return false
      }
    )
})

const Edit = () => {
  const router = useRouter()
  id = router.query.id
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
    validationSchema: CategorySchema,
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
              errorMessage={form.errors.name}
            />
            <Input
              label='Slug da categoria'
              placeholder='Preencha com o Slug da Categoria'
              value={form.values.slug}
              onChange={form.handleChange}
              name='slug'
              errorMessage={form.errors.slug}
            />
            <Button>Salvar Categoria</Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
export default Edit
