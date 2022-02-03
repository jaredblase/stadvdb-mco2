import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const siteTitle = 'IMDb Lite'

function NavItem({ path, text }) {
  const router = useRouter()

  return (
    <Link href={path}>
      {router.pathname == path ?
        <a className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium" aria-current="page">{text}</a>
        :
        <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">{text}</a>
      }
    </Link>
  )
}

export default function Layout({ children, home }) {
  return (
    <div className={''}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="IMDb Lite: a small project to simulate database concurrency"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      </Head>
      <header>
        <nav className="bg-gray-800">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                  <span className="sr-only">Open main menu</span>
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <Link href="/">
                  <div className="flex-shrink-0 flex items-center cursor-pointer">
                    <Image className="block w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow" width={36} height={36} />
                    <p className="md:block hidden w-auto ml-1 text-white text-xl font-bold">IMDb Lite</p>
                  </div>
                </Link>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    <NavItem path="/" text="Search" />
                    <NavItem path="/movies/add" text="Add" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium" aria-current="page">Search</a>
              <a href="/add" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Add</a>
            </div>
          </div>
        </nav>
      </header>
      <main className="mt-4 mx-4" style={{ height: "calc(100vh - 90px)" }}>
        <div className="max-w-xl mx-auto">
          {!home && (
            <div className="mb-5">
              <Link href="/">
                <span className="border-b border-transparent hover:border-gray-800 cursor-pointer">
                  <i className="fas fa-chevron-left fa-sm mr-2" />
                  <span>Back to home</span>
                </span>
              </Link>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}