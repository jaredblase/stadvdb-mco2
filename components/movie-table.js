import Link from 'next/link'

export default function MovieTable({ movies }) {
  return (
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"></div>
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr className="text-gray-600">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Year</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rating</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movies.map(m => (
              <tr className="text-gray-600" key={m.id}>
                <td className="px-6 py-4 whitespace-prewrap text-sm max-w-md">{m.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{m.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{m.rank}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/movies/${m.id}`}>
                    <a className="text-indigo-600 hover:text-indigo-900">Edit</a>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}