import Head from 'next/head'
import React from 'react'
import Layout from '../../components/layout'

export default function Create() {
  const currYear = new Date().getFullYear()

  return (
    <Layout>
      <Head>
        <title> New Movie </title>
      </Head>
      <form className="grid grid-cols-2 gap-x-2 gap-y-3">
        <div className="col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Movie Title</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input type="text" name="title" id="title" placeholder="Title"
              className="focus:ring-gray-600 focus:border-gray-600 block w-full pr-12 sm:text-sm border-gray-300 rounded-md" />
          </div>
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year Released</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input type="number" name="year" id="year" defaultValue={currYear} min={1900} max={currYear}
              className="focus:ring-gray-600 focus:border-gray-600 block w-full pr-20 sm:text-sm border-gray-300 rounded-md" />
          </div>
        </div>
        <div>
          <label htmlFor="rank" className="block text-sm font-medium text-gray-700">Rank</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input type="number" name="rank" id="rank" placeholder="10.0" min={0} max={10}
              className="focus:ring-gray-600 focus:border-gray-600 block w-full pr-20 sm:text-sm border-gray-300 rounded-md" />
          </div>
        </div>
        <div className="col-span-2 flex justify-end">
          <input type="reset"
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