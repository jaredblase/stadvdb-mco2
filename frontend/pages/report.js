import Head from 'next/head'
import useSWR from 'swr'
import Layout, { siteTitle } from '../components/layout'
import app from '../lib/axiosConfig'

const fetcher = (url) => app.get(url)

function useReports() {
  const { data, error } = useSWR(`/api/report`, fetcher)

  return {
    data: data?.data,
    isLoading: !data && !error,
    isError: error,
  }
}

export default function Report() {
  const { data, isLoading, isError } = useReports()

  return (
    <Layout>
      <Head>
        <title>{siteTitle} Data</title>
      </Head>
      {isLoading &&
        <div className="flex justify-center items-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
      { data &&
        <table>
          <p>Total Number of Movies in the database: </p>
          <p>Statistics per Genre: </p>
          <p>Statistics per Decade: </p>
        </table>
      }
    </Layout>
  )
}
