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
      description: "The dog's name (without titles/affixes)",
      validation: (Rule) => Rule.required(),
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
      name: 'kcRegistrationNumber',
      title: 'KC Registration Number',
      type: 'string',
    }),
    defineField({
      name: 'kcTitle',
      title: 'KC Title / Affix',
      type: 'string',
      description: 'Any KC title, prefix or affix (e.g. Ch., Sh Ch., a kennel affix)',
    }),
    defineField({
      name: 'suffix',
      title: 'Suffix',
      type: 'string',
      description: 'Any suffix that follows the name (e.g. JW, ShCM)',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
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
      kcTitle: 'kcTitle',
      sex: 'sex',
      status: 'status',
      media: 'mainPhoto',
    },
    prepare({ name, kcTitle, sex, status, media }) {
      const displayName = kcTitle ? `${kcTitle} ${name}` : name
      const sexLabel = sex === 'bitch' ? 'Bitch' : 'Dog'
      return {
        title: displayName,
        subtitle: `${sexLabel} · ${status || 'Active'}`,
        media,
      }
    },
  },
})