'use client'

import { useState, FormEvent } from 'react'
import type { ContactFormBlock as ContactFormBlockType } from '@/types'

interface ContactFormBlockProps {
  block: ContactFormBlockType
}

interface FormState {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactFormBlock({ block }: ContactFormBlockProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitState('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }

      setSubmitState('success')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setSubmitState('error')
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.')
    }
  }

  const inputClasses =
    'w-full px-4 py-3 bg-white border border-[#e8dfd2] focus:outline-none focus:border-[#c4a05a] focus:ring-1 focus:ring-[#c4a05a]/30 transition-colors font-body text-[#1a1714] placeholder-[#c8bfb0] rounded'
  const labelClasses = 'block font-body text-xs font-medium uppercase tracking-[0.12em] text-[#7a6c5c] mb-2'

  if (submitState === 'success') {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 border border-emerald-300 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="h-px w-10 bg-[#c4a05a] mx-auto mb-5" />
          <h2 className="font-heading font-normal text-3xl text-[#1a1714] mb-4 tracking-wide">Message Sent</h2>
          <p className="font-body text-[#7a6c5c] text-base mb-8 leading-relaxed">
            Thank you for getting in touch. We&apos;ll get back to you as soon as possible.
          </p>
          <button
            onClick={() => setSubmitState('idle')}
            className="font-body text-sm tracking-[0.12em] uppercase border border-[#1a1714] text-[#1a1714] px-8 py-3 hover:bg-[#1a1714] hover:text-[#f0e8d8] transition-all duration-200"
          >
            Send Another Message
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {block.heading && (
          <>
            <div className="h-px w-10 bg-[#c4a05a] mb-5" />
            <h2 className="font-heading font-normal text-4xl md:text-5xl tracking-wide text-[#1a1714] mb-4">
              {block.heading}
            </h2>
          </>
        )}
        {block.introText && (
          <p className="font-body text-[#7a6c5c] text-base mb-10 leading-relaxed">
            {block.introText}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className={labelClasses}>
                Name <span className="text-[#c4a05a]">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClasses}>
                Email <span className="text-[#c4a05a]">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="phone" className={labelClasses}>
                Phone <span className="text-[#c8bfb0] font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+44 1234 567890"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="subject" className={labelClasses}>
                Subject <span className="text-[#c4a05a]">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                required
                value={form.subject}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Select a subject…</option>
                <option value="Puppy Enquiry">Puppy Enquiry</option>
                <option value="Waiting List">Waiting List</option>
                <option value="Stud Dog Enquiry">Stud Dog Enquiry</option>
                <option value="General Enquiry">General Enquiry</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="message" className={labelClasses}>
              Message <span className="text-[#c4a05a]">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us a bit about yourself and what you're looking for…"
              className={`${inputClasses} resize-none`}
            />
          </div>

          {submitState === 'error' && (
            <div className="border border-red-200 bg-red-50 p-4 text-red-700 text-sm font-body">
              <strong>Error: </strong>{errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={submitState === 'submitting'}
            className="w-full bg-[#1a1714] hover:bg-[#c4a05a] disabled:bg-[#c8bfb0] text-[#f0e8d8] hover:text-[#1a1714] font-body text-sm tracking-[0.15em] uppercase py-4 px-8 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {submitState === 'submitting' ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending…
              </>
            ) : (
              'Send Message'
            )}
          </button>

          <p className="font-body text-xs text-[#c8bfb0] text-center">
            We respect your privacy and will never share your details with third parties.
          </p>
        </form>
      </div>
    </section>
  )
}
