import Head from 'next/head'
import useSWR from 'swr'
import Layout, { siteTitle } from '../components/layout'
import app from '../lib/axiosConfig'

const fetcher = (url) => app.get(url)

function useReports() {
  const { data, error } = useSWR(`/api/movies/report`, fetcher)

  return {
    data: data?.data,
    isLoading: !data && !error,
    isError: error,
  }
}

export default function Report() {
  return (
    <Layout>
      <Head>
        <title>{siteTitle} Data</title>
      </Head>
      <p>Total Number of Movies in the database: </p>
      <p>Statistics per Genre: </p>
      <p>Statistics per Decade: </p>
    </Layout>
  )
}
