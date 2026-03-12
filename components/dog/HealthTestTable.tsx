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
    return 'text-emerald-700 border-emerald-300 bg-emerald-50'
  }
  if (
    lower.includes('carrier') ||
    lower.includes('fair') ||
    lower.includes('b2') ||
    lower.includes('c') ||
    lower.includes('borderline')
  ) {
    return 'text-amber-700 border-amber-300 bg-amber-50'
  }
  if (
    lower.includes('affected') ||
    lower.includes('poor') ||
    lower.includes('fail') ||
    lower.includes('positive') ||
    lower.includes('d') ||
    lower.includes('e')
  ) {
    return 'text-red-700 border-red-300 bg-red-50'
  }
  return 'text-[#7a6c5c] border-[#c8bfb0] bg-[#f5f0e8]'
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
      <p className="font-body text-sm text-[#9e8e7e] italic">
        No health test results recorded for {dogName}.
      </p>
    )
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {tests.map((test, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <span className="font-body text-sm text-[#7a6c5c] truncate">{test.testName}</span>
            <span className={`font-body text-xs font-medium px-2 py-0.5 border rounded uppercase tracking-wide flex-shrink-0 ${getResultColor(test.result)}`}>
              {test.result}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const hasCertificates = tests.some((t) => t.certificateUrl)

  return (
    <div className="overflow-x-auto border border-[#e8dfd2] rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#f5f0e8] border-b border-[#e8dfd2]">
            <th className="text-left py-3 px-4 font-body font-medium text-xs uppercase tracking-[0.1em] text-[#7a6c5c]">Test</th>
            <th className="text-left py-3 px-4 font-body font-medium text-xs uppercase tracking-[0.1em] text-[#7a6c5c]">Result / Grade</th>
            <th className="text-left py-3 px-4 font-body font-medium text-xs uppercase tracking-[0.1em] text-[#7a6c5c] hidden md:table-cell">Date</th>
            {hasCertificates && <th className="py-3 px-4 hidden lg:table-cell" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f0ece4]">
          {tests.map((test, i) => (
            <tr key={i} className="hover:bg-[#faf8f3] transition-colors">
              <td className="py-3 px-4 font-body font-medium text-[#1a1714]">{test.testName}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center font-body text-xs font-medium px-2.5 py-0.5 border rounded uppercase tracking-wide ${getResultColor(test.result)}`}>
                  {test.result}
                </span>
              </td>
              <td className="py-3 px-4 font-body text-[#7a6c5c] hidden md:table-cell">
                {test.date ? formatDate(test.date) : <span className="text-[#c8bfb0]">—</span>}
              </td>
              {hasCertificates && (
                <td className="py-3 px-4 hidden lg:table-cell">
                  {test.certificateUrl ? (
                    <a
                      href={test.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-xs text-primary-600 hover:text-primary-700 hover:underline"
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
