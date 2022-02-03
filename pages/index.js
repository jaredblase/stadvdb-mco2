import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <form>
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
    </Layout>
  )
}
