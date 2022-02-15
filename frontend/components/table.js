export default function Table({ headers, data }) {
  return (
    <div className="my-10 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"></div>
        <table className="min-w-full divide-y divide-gray-200 table-fixed border-2">
          <thead className="bg-gray-50">
            <tr className="text-gray-600">
              {headers.map(h => <th key={h} scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{h}</th>)}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.map(m => (
              <tr className="text-gray-600" key={m.id}>
                <td className="px-6 py-4 whitespace-prewrap text-sm w-52">{m.label}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-left">{m.cnt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-left">{m.avg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}