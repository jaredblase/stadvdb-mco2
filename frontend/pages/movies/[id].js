import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { toastServerError } from '../../components/toasts'
import Layout from '../../components/layout'
import app from '../../lib/axiosConfig'
import useValidation from '../../lib/useValidation'
import genres from '../../lib/genres'

const fetcher = (url) => app.get(url)

function useMovie(id) {
  const { data, error, mutate } = useSWRImmutable(id ? `/api/movies/${id}` : null, fetcher)
  return {
    movie: data?.data?.result,
    isLoading: !data && !error,
    isError: error,
    mutate,
  }
}

export default function Movie() {
  const { query: { id }, replace } = useRouter()
  const { movie, isLoading, mutate } = useMovie(id)
  const { errors, validate, resetErrors } = useValidation()
  const [isViewing, setIsViewing] = useState(true)
  const [genre1, setGenre1] = useState('')
  const resetButton = useRef(null)
  const formElem = useRef(null)
  const [postLoading, setPostLoading] = useState(false)

  useEffect(() => setGenre1(movie?.genre1 || ''), [movie])

  const handleSubmit = async e => {
    const { movie: newMovie, isValid } = validate(e, movie)

    if (isValid) {
      try {
        setPostLoading(true)
        const { data: { result } } = await app.put(`/api/movies/${id}`, newMovie)
        mutate()
        setIsViewing(true)
        if (!result) throw Error('Server Error')

      } catch (err) {
        toastServerError()
      } finally {
        setPostLoading(false)
      }
    }
  }

  const handleResetClick = e => {
    e.preventDefault()
    formElem.current.reset()
    resetErrors()
    setGenre1(movie.genre1 || '')
  }

  const handleDeleteClick = async e => {
    e.preventDefault()
    try {
      const { data: { result } } = await app.delete(`/api/movies/${movie.year}/${id}`)
      if (!result) throw Error('No record was deleted!')
      localStorage.setItem('deleted', movie.name)
      replace('/')
    } catch (err) {
      toastServerError()
    }
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
        <form className="grid grid-cols-2 gap-x-2 gap-y-3" onSubmit={handleSubmit} ref={formElem}>
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
              <input type="number" name="rank" id="rank" placeholder={isViewing ? 'None' : 10.0} defaultValue={movie.rank} disabled={isViewing}
                className="focus:ring-gray-600 focus:border-gray-600 block w-full pr-20 sm:text-sm border-gray-300 rounded-md" />
            </div>
            <p className="h-2 my-0.5 text-xs text-red-600 border-0">{errors.rank}</p>
          </div>
          <div>
            <label htmlFor="genre-1" className="block text-sm font-medium text-gray-700">Genre 1</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <select name="genre1" id="genre-1" disabled={isViewing} className="focus:ring-gray-600 focus:border-gray-600 
            block w-full pr-20 sm:text-sm border-gray-300 rounded-md cursor-pointer" value={genre1} onChange={e => setGenre1(e.target.value)}>
                <option value="" hidden>{isViewing ? 'None' : 'Select a genre...'}</option>
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="genre-2" className="block text-sm font-medium text-gray-700">Genre 2</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <select name="genre2" id="genre-2" className="focus:ring-gray-600 focus:border-gray-600 
            block w-full pr-20 sm:text-sm border-gray-300 rounded-md cursor-pointer" disabled={isViewing || !genre1} defaultValue={movie.genre2 || ''}>
                <option value="" hidden>{isViewing ? 'None' : 'Select a genre...'}</option>
                {genres.filter(g => g != genre1).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {isViewing ?
            <div className="col-span-2 flex justify-end mt-4">
              <button onClick={handleDeleteClick}
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
              <div className="mt-4">
                <input type="reset" onClick={handleCancelClick} value="Cancel" disabled={postLoading}
                  className="inline-flex justify-center py-2 px-4 border 
                          border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                          bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 cursor-pointer"/>
              </div>
              <div className="flex justify-end mt-4">
                <input type="reset" onClick={handleResetClick} ref={resetButton} disabled={postLoading}
                  className="inline-flex justify-center py-2 px-4 border 
                          border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                          bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 mx-2 cursor-pointer"/>
                <input type="submit" value={postLoading ? 'Updating...' : 'Update'} disabled={postLoading}
                  className="inline-flex justify-center py-2 px-4 border 
                            border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                            bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer" />
              </div>
            </>
          }
        </form>
      }
      {!isLoading && !movie && <p className="text-center">Page does not exist!</p>}
    </Layout>
  )
}
