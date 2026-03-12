import type { Metadata } from 'next'
import './globals.css'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import type { SiteSettings } from '@/types'

export const revalidate = 3600

async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch(siteSettingsQuery)
  } catch {
    return null
  }
}

// Map font names to Google Fonts families
function getFontUrl(heading: string, body: string): string {
  const headingMap: Record<string, string> = {
    'Cormorant Garamond': 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700',
    'Playfair Display': 'Playfair+Display:ital,wght@0,400;0,600;0,700;1,400',
    'Lora': 'Lora:ital,wght@0,400;0,600;1,400',
    'Merriweather': 'Merriweather:ital,wght@0,300;0,400;0,700;1,300',
    'Montserrat': 'Montserrat:wght@300;400;600;700',
    'Raleway': 'Raleway:wght@300;400;600;700',
  }
  const bodyMap: Record<string, string> = {
    'Outfit': 'Outfit:wght@300;400;500;600;700',
    'Lato': 'Lato:ital,wght@0,300;0,400;0,700;1,300;1,400',
    'Open Sans': 'Open+Sans:ital,wght@0,300;0,400;0,600;1,300;1,400',
    'Nunito': 'Nunito:wght@300;400;600;700',
    'Source Sans Pro': 'Source+Sans+3:ital,wght@0,300;0,400;0,600;1,300;1,400',
    'Inter': 'Inter:wght@300;400;500;600',
  }
  const fonts = [
    headingMap[heading] || headingMap['Playfair Display'],
    bodyMap[body] || bodyMap['Lato'],
  ]
  return `https://fonts.googleapis.com/css2?family=${fonts.join('&family=')}&display=swap`
}

function blendWithWhite(r: number, g: number, b: number, factor: number): string {
  const nr = Math.min(255, Math.round(r + (255 - r) * factor))
  const ng = Math.min(255, Math.round(g + (255 - g) * factor))
  const nb = Math.min(255, Math.round(b + (255 - b) * factor))
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`
}

function blendWithBlack(r: number, g: number, b: number, factor: number): string {
  const nr = Math.round(r * (1 - factor))
  const ng = Math.round(g * (1 - factor))
  const nb = Math.round(b * (1 - factor))
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`
}

function hexToShades(hex: string): Record<string, string> {
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)

  return {
    '50':  blendWithWhite(r, g, b, 0.95),
    '100': blendWithWhite(r, g, b, 0.85),
    '200': blendWithWhite(r, g, b, 0.70),
    '300': blendWithWhite(r, g, b, 0.50),
    '400': blendWithWhite(r, g, b, 0.25),
    '500': hex,
    '600': blendWithBlack(r, g, b, 0.15),
    '700': blendWithBlack(r, g, b, 0.30),
    '800': blendWithBlack(r, g, b, 0.45),
    '900': blendWithBlack(r, g, b, 0.60),
  }
}

function hexToAccentVariants(hex: string): { light: string; dark: string } {
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)
  return {
    light: blendWithWhite(r, g, b, 0.5),
    dark: blendWithBlack(r, g, b, 0.3),
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: {
      template: `%s | ${settings?.siteName || 'Dog Breeder'}`,
      default: settings?.siteName || 'Dog Breeder',
    },
    description: settings?.tagline,
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  const headingFont = settings?.headingFont || 'Cormorant Garamond'
  const bodyFont = settings?.bodyFont || 'Outfit'
  const fontUrl = getFontUrl(headingFont, bodyFont)

  let cssVarsString = ''

  if (settings?.primaryColor) {
    const shades = hexToShades(settings.primaryColor)
    const shadeVars = Object.entries(shades)
      .map(([k, v]) => `--color-primary-${k}: ${v};`)
      .join(' ')
    cssVarsString += shadeVars
  }

  if (settings?.accentColor) {
    const { light, dark } = hexToAccentVariants(settings.accentColor)
    cssVarsString += `
      --color-accent: ${settings.accentColor};
      --color-accent-light: ${light};
      --color-accent-dark: ${dark};
    `
  }

  cssVarsString += `
    --font-heading: '${headingFont}', Georgia, serif;
    --font-body: '${bodyFont}', system-ui, sans-serif;
  `

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontUrl} rel="stylesheet" />
        <style>{`:root { ${cssVarsString} }`}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
