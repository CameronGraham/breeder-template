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
    'w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow text-gray-900 placeholder-gray-400'
  const labelClasses = 'block text-sm font-semibold text-gray-700 mb-1.5'

  if (submitState === 'success') {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-heading text-3xl font-semibold text-gray-900 mb-4">Message Sent!</h2>
          <p className="text-gray-600 text-lg mb-8">
            Thank you for getting in touch. We&apos;ll get back to you as soon as possible.
          </p>
          <button
            onClick={() => setSubmitState('idle')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
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
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900 mb-4 text-center">
            {block.heading}
          </h2>
        )}
        {block.introText && (
          <p className="text-gray-600 text-lg text-center mb-10 leading-relaxed">
            {block.introText}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className={labelClasses}>
                Name <span className="text-red-500">*</span>
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
                Email <span className="text-red-500">*</span>
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
                Phone <span className="text-gray-400 font-normal">(optional)</span>
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
                Subject <span className="text-red-500">*</span>
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
              Message <span className="text-red-500">*</span>
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              <strong>Error: </strong>{errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={submitState === 'submitting'}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-semibold py-4 px-8 rounded-xl transition-colors duration-200 text-lg flex items-center justify-center gap-2"
          >
            {submitState === 'submitting' ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending…
              </>
            ) : (
              'Send Message'
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            We respect your privacy and will never share your details with third parties.
          </p>
        </form>
      </div>
    </section>
  )
}
