import Head from 'next/head'
import React, { useState } from 'react'
import Layout from '../../components/layout'
import useValidation from '../../lib/useValidation'
import genres from '../../lib/genres'
import { useRouter } from 'next/router'
import app from '../../lib/axiosConfig'
import FlashCard from '../../components/flash-card'

export default function Create() {
  const currYear = new Date().getFullYear()
  const { errors, validate, resetErrors } = useValidation()
  const [genre1, setGenre1] = useState('')
  const router = useRouter()
  const [serverError, setServerError] = useState(false)

  const handleSubmit = async e => {
    const { movie, isValid } = validate(e)

    if (isValid) {
      try {
        const { data: { insertId } } = await app.post(`/api/movies/`, movie)
        if (insertId) {
          router.push('/movies/' + insertId)
          setServerError(false)
        } else {
          console.log('No id received')
          setServerError(true)
        }
      } catch (err) {
        setServerError(true)
      }
    }
  }

  const handleResetClick = () => {
    resetErrors()
    setGenre1('')
    setServerError(false)
  }

  return (
    <Layout>
      <Head>
        <title> Add a Movie </title>
      </Head>
      {serverError && <FlashCard />}
      <form className="grid grid-cols-2 gap-x-2 gap-y-3" onSubmit={handleSubmit}>
        <div className="col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Movie Title</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input type="text" name="name" id="name" placeholder="Title"
              className="focus:ring-gray-600 focus:border-gray-600 block w-full pr-12 sm:text-sm border-gray-300 rounded-md" />
          </div>
          <p className="h-2 my-0.5 text-xs text-red-600 border-0">{errors.name}</p>
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year Released</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input type="number" name="year" id="year" defaultValue={currYear}
              className="focus:ring-gray-600 focus:border-gray-600 block w-full pr-20 sm:text-sm border-gray-300 rounded-md" />
          </div>
          <p className="h-2 my-0.5 text-xs text-red-600 border-0">{errors.year}</p>
        </div>
        <div>
          <label htmlFor="rank" className="block text-sm font-medium text-gray-700">Rank</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input type="number" name="rank" id="rank" placeholder="10.0" defaultValue={8}
              className="focus:ring-gray-600 focus:border-gray-600 block w-full pr-20 sm:text-sm border-gray-300 rounded-md" />
          </div>
          <p className="h-2 my-0.5 text-xs text-red-600 border-0">{errors.rank}</p>
        </div>
        <div>
          <label htmlFor="genre-1" className="block text-sm font-medium text-gray-700">Genre 1</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <select name="genre1" id="genre-1" className="focus:ring-gray-600 focus:border-gray-600 
            block w-full pr-20 sm:text-sm border-gray-300 rounded-md cursor-pointer" value={genre1} onChange={e => setGenre1(e.target.value)}>
              <option value="" hidden>Select a genre...</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="genre-2" className="block text-sm font-medium text-gray-700">Genre 2</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <select name="genre2" id="genre-2" className="focus:ring-gray-600 focus:border-gray-600 
            block w-full pr-20 sm:text-sm border-gray-300 rounded-md cursor-pointer" disabled={!genre1} defaultValue="">
              <option value="" hidden>Select a genre...</option>
              {genres.filter(g => g != genre1).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div className="col-span-2 flex justify-end mt-4">
          <input type="reset" onClick={handleResetClick}
            className="inline-flex justify-center py-2 px-4 border 
          border-transparent shadow-sm text-sm font-medium rounded-md text-white 
          bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 mx-2 cursor-pointer"/>
          <input type="submit" value="Add"
            className="inline-flex justify-center py-2 px-4 border 
            border-transparent shadow-sm text-sm font-medium rounded-md text-white 
            bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer" />
        </div>
      </form>
    </Layout >
  )
}