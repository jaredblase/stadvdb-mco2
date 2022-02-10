import Head from 'next/head'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import useSWR from 'swr'
import Layout from '../../components/layout'
import app from '../../lib/axiosConfig'
import useValidation from '../../lib/useValidation'

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
  const { errors, validate, resetErrors } = useValidation()
  const [isViewing, setIsViewing] = useState(true)
  const resetButton = useRef(null)

  const handleSubmit = async e => {
    console.log(e)
  }

  const handleEditClick = e => {
    e.preventDefault()
    setIsViewing(false)
  }

  const handleCancelClick = () => {
    resetButton.current.click()
    setIsViewing(true)
  }

  return (
    <Layout>
      <Head>
        <title>{movie ? movie.name : 'View Movie'}</title>
      </Head>
      {isLoading &&
        <div className="flex justify-center items-center m-10">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
      {movie &&
        <form className="grid grid-cols-2 gap-x-2 gap-y-3" onSubmit={handleSubmit}>
          <div className="col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Movie Title</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input type="text" name="name" id="name" placeholder="Title" defaultValue={movie.name} disabled={isViewing}
                className="focus:ring-gray-600 focus:border-gray-600 block w-full pr-12 sm:text-sm border-gray-300 rounded-md" />
            </div>
            <p className="h-2 my-0.5 text-xs text-red-600 border-0">{errors.name}</p>
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year Released</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input type="number" name="year" id="year" defaultValue={movie.year} disabled={isViewing}
                className="focus:ring-gray-600 focus:border-gray-600 block w-full pr-20 sm:text-sm border-gray-300 rounded-md" />
            </div>
            <p className="h-2 my-0.5 text-xs text-red-600 border-0">{errors.year}</p>
          </div>
          <div>
            <label htmlFor="rank" className="block text-sm font-medium text-gray-700">Rank</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input type="number" name="rank" id="rank" placeholder="10.0" defaultValue={movie.rank} disabled={isViewing}
                className="focus:ring-gray-600 focus:border-gray-600 block w-full pr-20 sm:text-sm border-gray-300 rounded-md" />
            </div>
            <p className="h-2 my-0.5 text-xs text-red-600 border-0">{errors.rank}</p>
          </div>

          {isViewing ?
            <div className="col-span-2 flex justify-end">
              <button
                className="inline-flex justify-center py-2 px-4 border 
          border-transparent shadow-sm text-sm font-medium rounded-md text-white 
          bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 mx-2 cursor-pointer">Delete</button>
              <button onClick={handleEditClick}
                className="inline-flex justify-center py-2 px-4 border 
            border-transparent shadow-sm text-sm font-medium rounded-md text-white 
            bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">Edit</button>
            </div>
            :
            <>
              <div>
                <input type="reset" onClick={handleCancelClick} value="Cancel"
                  className="inline-flex justify-center py-2 px-4 border 
                          border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                          bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 cursor-pointer"/>
              </div>
              <div className="flex justify-end">
                <input type="reset" onClick={resetErrors} ref={resetButton}
                  className="inline-flex justify-center py-2 px-4 border 
                          border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                          bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 mx-2 cursor-pointer"/>
                <input type="submit" value="Update"
                  className="inline-flex justify-center py-2 px-4 border 
                            border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                            bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer" />
              </div>
            </>
          }
        </form>
      }
      <div className="col-span-2 flex justify-end">

      </div>

    </Layout>
  )
}
