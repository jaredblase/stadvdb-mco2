import Link from 'next/link'

export default function MovieTable({ movies }) {
  return (
    <div class="flex flex-col my-8">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"></div>
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {movies.map(m => (
                <tr>
                  <td class="px-6 py-4 whitespace-prewrap text-sm text-gray-500 max-w-md">{m.name}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.year}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.rank}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/movies/${m.id}`}>
                      <a class="text-indigo-600 hover:text-indigo-900">Edit</a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}