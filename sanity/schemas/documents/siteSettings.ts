import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'A short description shown under the site name',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Small icon shown in browser tabs (recommended: 32x32 or 64x64 PNG)',
    }),
    defineField({
      name: 'primaryColor',
      title: 'Primary Colour',
      type: 'string',
      description: 'Used for buttons, links, highlights. Enter a hex value e.g. #3a9a3a',
    }),
    defineField({
      name: 'secondaryColor',
      title: 'Secondary Colour',
      type: 'string',
      description: 'Used for secondary elements. Enter a hex value e.g. #1e4e1e',
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Colour',
      type: 'string',
      description: 'Used for highlights and decorative elements. Enter a hex value e.g. #c8a96e',
    }),
    defineField({
      name: 'headingFont',
      title: 'Heading Font',
      type: 'string',
      options: {
        list: [
          { title: 'Playfair Display (elegant serif)', value: 'Playfair Display' },
          { title: 'Lora (literary serif)', value: 'Lora' },
          { title: 'Merriweather (readable serif)', value: 'Merriweather' },
          { title: 'Montserrat (modern sans-serif)', value: 'Montserrat' },
          { title: 'Raleway (geometric sans-serif)', value: 'Raleway' },
        ],
        layout: 'radio',
      },
      initialValue: 'Playfair Display',
    }),
    defineField({
      name: 'bodyFont',
      title: 'Body Font',
      type: 'string',
      options: {
        list: [
          { title: 'Lato (clean and modern)', value: 'Lato' },
          { title: 'Open Sans (highly readable)', value: 'Open Sans' },
          { title: 'Nunito (friendly and rounded)', value: 'Nunito' },
          { title: 'Source Sans Pro (professional)', value: 'Source Sans Pro' },
          { title: 'Inter (versatile and crisp)', value: 'Inter' },
        ],
        layout: 'radio',
      },
      initialValue: 'Lato',
    }),
    defineField({
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'href', title: 'URL / Path', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'isExternal', title: 'Opens in new tab?', type: 'boolean', initialValue: false },
          ],
          preview: {
            select: { label: 'label', href: 'href' },
            prepare({ label, href }) {
              return { title: label, subtitle: href }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'text',
      rows: 3,
      description: 'Text displayed in the footer, e.g. a short about blurb',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'contactFormEmail',
      title: 'Contact Form Recipient Email',
      type: 'string',
      description: 'Email address to send contact form submissions to',
    }),
  ],
  preview: {
    select: {
      title: 'siteName',
    },
  },
})
