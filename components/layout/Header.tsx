'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import type { SiteSettings } from '@/types'
import { urlForImage } from '@/sanity/lib/image'

interface HeaderProps {
  settings: SiteSettings | null
}

export default function Header({ settings }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = settings?.navLinks || [
    { label: 'Home', href: '/', isExternal: false },
    { label: 'Our Dogs', href: '/dogs', isExternal: false },
    { label: 'Litters', href: '/litters', isExternal: false },
    { label: 'News', href: '/news', isExternal: false },
    { label: 'Contact', href: '/contact', isExternal: false },
  ]

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-gray-100 transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / Site Name */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            {settings?.logo ? (
              <Image
                src={urlForImage(settings.logo).height(60).url()}
                alt={settings.siteName || 'Home'}
                width={120}
                height={60}
                className="h-12 w-auto object-contain"
              />
            ) : (
              <span className="font-heading text-xl md:text-2xl font-bold text-primary-700">
                {settings?.siteName || 'Dog Breeder'}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                target={link.isExternal ? '_blank' : undefined}
                rel={link.isExternal ? 'noopener noreferrer' : undefined}
                className="px-3 py-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-medium transition-colors duration-200 text-sm tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <nav
            className="md:hidden pb-4 border-t border-gray-100 pt-3"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={`mobile-${link.href}-${link.label}`}
                  href={link.href}
                  target={link.isExternal ? '_blank' : undefined}
                  rel={link.isExternal ? 'noopener noreferrer' : undefined}
                  className="px-3 py-2.5 rounded-md text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                  {link.isExternal && (
                    <svg className="inline-block ml-1 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
