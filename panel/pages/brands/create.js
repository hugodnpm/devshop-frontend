import React from 'react'
import * as Yup from 'yup'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import { fetcher, useMutation } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Alert from '../../components/Alert'

const CREATE_BRAND = `
    mutation createBrand($name: String!, $slug: String!){
      createBrand(input:{
        name: $name,
        slug: $slug
      }){
        id
        name
        slug
      }  
    }
    `
const BrandSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Por favor, informe pelo menos uma Marca com 3 caracteres')
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
            getBrandBySlug(slug:"${value}"){
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
    )
})
const CreateBrand = () => {
  const router = useRouter()
  const [data, createBrand] = useMutation(CREATE_BRAND)
  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    validationSchema: BrandSchema,
    onSubmit: async values => {
      await createBrand(values)
      if (data && !data.errors) {
        router.push('/brands')
      }
    }
  })
  return (
    <Layout>
      <div className='container mx-auto px-6 py-8'>
        <Title>Criar Nova Marca</Title>
        <div className='mt-8'></div>

        <div>
          <Button.LinkOutline href='/brands'>Voltar</Button.LinkOutline>
        </div>
        <div className='flex flex-col mt-8'>
          <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
            <div className='align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200'>
              <form onSubmit={form.handleSubmit}>
                <div className=' px-8 mb-6 md:mb-0 bg-white py-8 '>
                  <pre>{JSON.stringify(data)}</pre>
                  {data && !!data.errors && (
                    <Alert>Ocorreu um erro ao Salvar os dados!!</Alert>
                  )}
                  <Input
                    label='Nome da Marca'
                    placeholder='Preencha com o nome da marca'
                    value={form.values.name}
                    onChange={form.handleChange}
                    name='name'
                    errorMessage={form.errors.name}
                  />
                  <Input
                    label='Slug da Marca'
                    placeholder='Preencha com o Slug da Marca'
                    value={form.values.slug}
                    onChange={form.handleChange}
                    name='slug'
                    errorMessage={form.errors.slug}
                  />
                  <Button>Criar Marca</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default CreateBrand
