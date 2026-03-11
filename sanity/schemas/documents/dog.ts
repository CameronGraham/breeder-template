import { defineType, defineField } from 'sanity'

export const dog = defineType({
  name: 'dog',
  title: 'Dog / Bitch',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: "The dog's call name / pet name (e.g. Giggle)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'displayName',
      title: 'Display Name',
      type: 'string',
      description: "Full registered name as it should appear publicly (e.g. Gitdoon Gee Us a Giggle)",
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sex',
      title: 'Sex',
      type: 'string',
      options: {
        list: [
          { title: 'Dog (Male)', value: 'dog' },
          { title: 'Bitch (Female)', value: 'bitch' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'breed',
      title: 'Breed',
      type: 'string',
    }),
    defineField({
      name: 'dateOfBirth',
      title: 'Date of Birth',
      type: 'date',
    }),
    defineField({
      name: 'colour',
      title: 'Colour / Coat',
      type: 'string',
    }),
    defineField({
      name: 'registrationNumbers',
      title: 'Registration Numbers',
      type: 'array',
      description: 'Add any registration numbers with their label (e.g. "KC Registration Number", "WBCS Number")',
      of: [
        {
          type: 'object',
          name: 'registrationNumber',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'value', title: 'Number', type: 'string', validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { label: 'label', value: 'value' },
            prepare({ label, value }) {
              return { title: label, subtitle: value }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'allowEnquiry',
      title: 'Show "Enquire About This Dog" button',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'None (hidden)', value: 'none' },
          { title: 'Active', value: 'active' },
          { title: 'Retired', value: 'retired' },
          { title: 'Deceased', value: 'deceased' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'mainPhoto',
      title: 'Main Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'blurb',
      title: 'About',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'string', title: 'URL' },
                  { name: 'blank', type: 'boolean', title: 'Open in new tab' },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'healthTests',
      title: 'Health Tests',
      type: 'array',
      of: [{ type: 'healthTest' }],
    }),
    defineField({
      name: 'pedigree',
      title: 'Pedigree',
      type: 'pedigreeTree',
      options: { collapsible: true, collapsed: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      of: [{ type: 'galleryImage' }],
    }),
    defineField({
      name: 'showResults',
      title: 'Show Results',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'showName', title: 'Show Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'date', title: 'Date', type: 'date' }),
            defineField({ name: 'result', title: 'Result / Award', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'judge', title: 'Judge', type: 'string' }),
          ],
          preview: {
            select: { showName: 'showName', result: 'result', date: 'date' },
            prepare({ showName, result, date }) {
              return { title: `${showName} - ${result}`, subtitle: date }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      name: 'name',
      displayName: 'displayName',
      sex: 'sex',
      status: 'status',
      media: 'mainPhoto',
    },
    prepare({ name, displayName, sex, status, media }) {
      const sexLabel = sex === 'bitch' ? 'Bitch' : 'Dog'
      return {
        title: displayName || name,
        subtitle: status && status !== 'none' ? `${sexLabel} · ${status}` : sexLabel,
        media,
      }
    },
  },
})