import type { HealthTest } from '@/types'

interface HealthTestTableProps {
  tests: HealthTest[]
  dogName: string
  compact?: boolean
}

function getResultColor(result: string): string {
  const lower = result.toLowerCase()
  if (
    lower.includes('clear') ||
    lower.includes('excellent') ||
    lower.includes('pass') ||
    lower.includes('normal') ||
    lower.includes('negative') ||
    lower.includes('a1') ||
    lower.includes('a2') ||
    lower.includes('b1') ||
    lower.includes('0:0')
  ) {
    return 'bg-green-50 text-green-800 border-green-200'
  }
  if (
    lower.includes('carrier') ||
    lower.includes('fair') ||
    lower.includes('b2') ||
    lower.includes('c') ||
    lower.includes('borderline')
  ) {
    return 'bg-amber-50 text-amber-800 border-amber-200'
  }
  if (
    lower.includes('affected') ||
    lower.includes('poor') ||
    lower.includes('fail') ||
    lower.includes('positive') ||
    lower.includes('d') ||
    lower.includes('e')
  ) {
    return 'bg-red-50 text-red-800 border-red-200'
  }
  return 'bg-gray-50 text-gray-700 border-gray-200'
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function HealthTestTable({ tests, dogName, compact = false }: HealthTestTableProps) {
  if (!tests || tests.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        No health test results recorded for {dogName}.
      </p>
    )
  }

  if (compact) {
    return (
      <div className="space-y-1.5">
        {tests.map((test, i) => (
          <div key={i} className="flex items-center justify-between gap-2 text-sm">
            <span className="text-gray-600 truncate">{test.testName}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getResultColor(test.result)} flex-shrink-0`}>
              {test.result}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const hasCertificates = tests.some((t) => t.certificateUrl)

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Test</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Result / Grade</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 hidden md:table-cell">Date</th>
            {hasCertificates && <th className="py-3 px-4 hidden lg:table-cell" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tests.map((test, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 font-medium text-gray-900">{test.testName}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getResultColor(test.result)}`}>
                  {test.result}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-600 hidden md:table-cell">
                {test.date ? formatDate(test.date) : <span className="text-gray-300">—</span>}
              </td>
              {hasCertificates && (
                <td className="py-3 px-4 hidden lg:table-cell">
                  {test.certificateUrl ? (
                    <a
                      href={test.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 hover:underline text-xs font-medium"
                    >
                      View Certificate
                    </a>
                  ) : null}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
