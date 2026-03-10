import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const body = await req.json()
  const type = body?._type
  const slug = body?.slug?.current

  const paths: string[] = ['/']

  if (type === 'dog') paths.push('/dogs', ...(slug ? [`/dogs/${slug}`] : []))
  if (type === 'litter') paths.push('/litters', ...(slug ? [`/litters/${slug}`] : []))
  if (type === 'newsPost') paths.push('/news', ...(slug ? [`/news/${slug}`] : []))
  if (type === 'page') paths.push(...(slug ? [`/${slug}`] : []))
  if (type === 'siteSettings') paths.push('/')

  paths.forEach((p) => revalidatePath(p))

  return NextResponse.json({ revalidated: true, paths })
}
