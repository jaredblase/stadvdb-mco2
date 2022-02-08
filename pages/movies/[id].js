import Head from 'next/head'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Layout from '../../components/layout'
import app from '../../lib/axiosConfig'

const fetcher = (url) => app.get(url)

function useMovie(id) {
  const { data, error } = useSWR(id ? `/api/movies/${id}` : null, fetcher)

  return {
    movie: data?.data?.result,
    isLoading: !error && !data,
    isError: error,
  }
}


export default function Movie() {
  const { query: { id } } = useRouter()
  const { movie, isLoading, isError } = useMovie(id)
  console.log(movie)

  return (
    <Layout>
      <Head>
        <title>{movie ? movie.name : 'View Movie'}</title>
      </Head>
      <p>{movie?.id}</p>
      <p>{movie?.name}</p>
      <p>{movie?.year}</p>
      <p>{movie?.rank}</p>

      <div className="col-span-2 flex justify-end">
        <button
          className="inline-flex justify-center py-2 px-4 border 
          border-transparent shadow-sm text-sm font-medium rounded-md text-white 
          bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 mx-2 cursor-pointer">Delete</button>
        <button
          className="inline-flex justify-center py-2 px-4 border 
            border-transparent shadow-sm text-sm font-medium rounded-md text-white 
            bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">Edit</button>
      </div>
    </Layout>
  )
}
