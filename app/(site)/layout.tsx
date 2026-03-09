import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { SiteSettings } from '@/types'

export const revalidate = 3600

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings: SiteSettings | null = await client.fetch(siteSettingsQuery).catch(() => null)

  return (
    <div className="flex flex-col min-h-screen">
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  )
}
