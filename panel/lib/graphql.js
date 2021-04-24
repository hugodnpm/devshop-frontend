import { useState } from 'react'
import useSWR from 'swr'

const fetcher = async query => {
  const res = await fetch(process.env.NEXT_PUBLIC_API, {
    headers: {
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: query
  })
  const json = await res.json()

  return json
}

const useQuery = queryStr => {
  const query = {
    query: queryStr
  }
  const allData = useSWR(JSON.stringify(query), fetcher)
  const { data, ...rest } = allData
  return { data: data ? data.data : null, ...rest }
}

const useMutation = query => {
  const [data, setData] = useState(null)
  const mutate = async variables => {
    const mutation = {
      query,
      variables
    }
    try {
      const returnedData = await fetcher(JSON.stringify(mutation))
      setData(returnedData)
      return returnedData
    } catch (err) {}
  }
  return [data, mutate]
}

const uploader = async formData => {
  const res = await fetch(process.env.NEXT_PUBLIC_API, {
    headers: {},
    method: 'POST',
    body: formData
  })
  const json = await res.json()

  return json
}

const useUpload = query => {
  const [data, setData] = useState(null)
  const mutate = async variables => {
    const mutation = {
      query,
      variables: {
        ...variables,
        file: null
      }
    }
    const map = {
      0: ['variables.file']
    }
    const formData = new FormData()
    formData.append('operations', JSON.stringify(mutation))
    formData.append('map', JSON.stringify(map))
    formData.append(0, variables.file)
    try {
      const returnedData = await uploader(formData)
      setData(returnedData)
      return returnedData
    } catch (err) {}
  }
  return [data, mutate]
}

export { useQuery, useMutation, fetcher, useUpload }

/*
const uploader = async formData => {
  console.log(formData)
  const res = await fetch(process.env.NEXT_PUBLIC_API, {
    headers: {},
    method: 'POST',
    body: formData
  })
  const json = await res.json()

  return json
}

const useUpload = query => {
  const [data, setData] = useState(null)
  const mutate = async variables => {
    const mutation = {
      query,
      variables: {
        ...variables,
        file: null
      }
    }
    const map = {
      0: ['variables.file']
    }
    const formData = new FormData()
    formData.append('operations', JSON.stringify(mutation))
    formData.append('map', JSON.stringify(map))
    formData.append(0, variables.file)
    try {
      const returnedData = await uploader(formData)
      setData(returnedData)
      return returnedData
    } catch (err) {}
  }
  return [data, mutate]


*/
