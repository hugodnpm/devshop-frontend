import React from 'react'

import { useRouter } from 'next/router'
import { useUpload, useQuery } from '../../../lib/graphql'
import { useFormik } from 'formik'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'

import Button from '../../../components/Button'
import Alert from '../../../components/Alert'

let id = ''
const UPLOAD_BRAND_LOGO = `
mutation uploadBrandLogo($id: String!, $file: Upload!){
  uploadBrandLogo (
        id: $id,
        file: $file        
    ) 
}
`

const Upload = () => {
  const router = useRouter()

  const { data } = useQuery(`
  query{
    getBrandById(id:"${router.query.id}"){
      name
      slug
    }
  }
  `)
  const [updatedData, updateBrand] = useUpload(UPLOAD_BRAND_LOGO)
  const form = useFormik({
    initialValues: {
      id: router.query.id,
      file: ''
    },

    onSubmit: async values => {
      const brand = {
        ...values,
        id: router.query.id
      }
      const data = await updateBrand(brand)
      if (data && !data.errors) {
        router.push('/brands')
      }
    }
  })

  return (
    <Layout>
      <div className='container mx-auto px-6 py-8'>
        <Title>
          Upload Logo da Marca:{' '}
          {data && data.getBrandById && data.getBrandById.name}
        </Title>

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
            <input
              type='file'
              name='file'
              onChange={evt => {
                console.log(evt.currentTarget.files[0])
                form.setFieldValue('file', evt.currentTarget.files[0])
              }}
            />
            <Button>Salvar Marca</Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
export default Upload
