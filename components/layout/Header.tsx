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
      className={`sticky top-0 z-50 bg-[#1a1714] transition-all duration-300 ${
        scrolled ? 'border-b border-[#c4a05a]/40' : 'border-b border-[#2e2820]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo / Site Name */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            {settings?.logo ? (
              <Image
                src={urlForImage(settings.logo).height(60).url()}
                alt={settings.siteName || 'Home'}
                width={120}
                height={60}
                className="h-10 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
              />
            ) : (
              <span className="font-heading text-2xl md:text-3xl font-normal tracking-wide text-[#f0e8d8] group-hover:text-[#c4a05a] transition-colors duration-300">
                {settings?.siteName || 'Dog Breeder'}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                target={link.isExternal ? '_blank' : undefined}
                rel={link.isExternal ? 'noopener noreferrer' : undefined}
                className="relative px-4 py-2 font-body text-sm tracking-wide text-[#9e8e7e] hover:text-[#f0e8d8] transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-4 right-4 h-px bg-[#c4a05a] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                {link.isExternal && (
                  <svg className="inline-block ml-1 w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#9e8e7e] hover:text-[#f0e8d8] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <nav
            className="md:hidden pb-6 border-t border-[#2e2820] pt-4"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={`mobile-${link.href}-${link.label}`}
                  href={link.href}
                  target={link.isExternal ? '_blank' : undefined}
                  rel={link.isExternal ? 'noopener noreferrer' : undefined}
                  className="py-3 px-1 text-[#9e8e7e] hover:text-[#f0e8d8] font-body text-sm tracking-wide transition-colors border-b border-[#2e2820] last:border-0 flex items-center justify-between"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                  {link.isExternal && (
                    <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
