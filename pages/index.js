import Head from 'next/head'
import { useState } from 'react'
import useSWR from 'swr'
import Layout, { siteTitle } from '../components/layout'
import app from '../lib/axiosConfig'
import MovieTable from '../components/move-table'

const fetcher = (url) => app.get(url)

function useResults(q) {
  const { data, error } = useSWR(q ? `/api/movies?q=${encodeURIComponent(q)}` : null, fetcher)

  return {
    results: data?.data?.results,
    isLoading: q && !error && !data,
    isError: error,
  }
}

export default function Home() {
  const [search, setSearch] = useState('')
  const { results, isLoading, isError } = useResults(search)

  const handleSearch = e => {
    e.preventDefault()
    const { q } = Object.fromEntries(new FormData(e.target))
    if (q && q !== search) setSearch(q)
  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <form onSubmit={handleSearch}>
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search movie</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm"> <i className="fas fa-search fa-sm" /> </span>
            </div>
            <input type="search" name="q" id="search" placeholder="Input search term here..."
              className="focus:ring-gray-600 focus:border-gray-600 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md" />
          </div>
        </div>
      </form>
      {isLoading && <p>Stuff is loading</p>}
      {results && <MovieTable movies={results} />}
    </Layout>
  )
}
