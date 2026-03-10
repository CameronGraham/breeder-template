import { defineType, defineField } from 'sanity'

export const litter = defineType({
  name: 'litter',
  title: 'Litter',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Litter Title',
      type: 'string',
      description: 'e.g. "Bella x Max — Spring 2024"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'None (hidden)', value: 'none' },
          { title: 'Planned', value: 'planned' },
          { title: 'Expecting', value: 'expecting' },
          { title: 'Born', value: 'born' },
          { title: 'Available', value: 'available' },
          { title: 'All Placed', value: 'all placed' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'expectedDate',
      title: 'Expected / Due Date',
      type: 'date',
    }),
    defineField({
      name: 'actualDate',
      title: 'Actual Birth Date',
      type: 'date',
    }),
    defineField({
      name: 'numberOfPuppies',
      title: 'Total Number of Puppies',
      type: 'number',
    }),
    defineField({
      name: 'numberOfDogs',
      title: 'Number of Dogs (Males)',
      type: 'number',
    }),
    defineField({
      name: 'numberOfBitches',
      title: 'Number of Bitches (Females)',
      type: 'number',
    }),
    defineField({
      name: 'description',
      title: 'Description',
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
    // Sire (internal reference)
    defineField({
      name: 'sire',
      title: 'Sire (from this site)',
      type: 'reference',
      to: [{ type: 'dog' }],
      description: 'Use this if the sire has a profile on this site',
    }),
    // Dam (internal reference)
    defineField({
      name: 'dam',
      title: 'Dam (from this site)',
      type: 'reference',
      to: [{ type: 'dog' }],
      description: 'Use this if the dam has a profile on this site',
    }),
    // External Sire info
    defineField({
      name: 'sireName',
      title: 'Sire Name (external)',
      type: 'string',
      description: 'Used if the sire is not on this site',
    }),
    defineField({
      name: 'sireRegistrationNumbers',
      title: "Sire's Registration Numbers",
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
      name: 'sirePhoto',
      title: 'Sire Photo (external)',
      type: 'image',
      options: { hotspot: true },
      description: 'Used if the sire is not on this site',
    }),
    defineField({
      name: 'sireHealthTests',
      title: "Sire's Health Tests (external)",
      type: 'array',
      of: [{ type: 'healthTest' }],
      description: 'Used if the sire is not on this site',
    }),
    // External Dam info
    defineField({
      name: 'damName',
      title: 'Dam Name (external)',
      type: 'string',
      description: 'Used if the dam is not on this site',
    }),
    defineField({
      name: 'damRegistrationNumbers',
      title: "Dam's Registration Numbers",
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
      name: 'damPhoto',
      title: 'Dam Photo (external)',
      type: 'image',
      options: { hotspot: true },
      description: 'Used if the dam is not on this site',
    }),
    defineField({
      name: 'damHealthTests',
      title: "Dam's Health Tests (external)",
      type: 'array',
      of: [{ type: 'healthTest' }],
      description: 'Used if the dam is not on this site',
    }),
    // Puppies
    defineField({
      name: 'puppies',
      title: 'Puppies',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'puppy',
          title: 'Puppy',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'sex', title: 'Sex', type: 'string', options: { list: [{ title: 'Dog (Male)', value: 'dog' }, { title: 'Bitch (Female)', value: 'bitch' }], layout: 'radio' } }),
            defineField({ name: 'colour', title: 'Colour / Coat', type: 'string' }),
            defineField({ name: 'status', title: 'Status', type: 'string', options: { list: [{ title: 'None (hidden)', value: 'none' }, { title: 'Available', value: 'available' }, { title: 'Reserved', value: 'reserved' }, { title: 'Placed', value: 'placed' }, { title: 'Kept', value: 'kept' }], layout: 'radio' }, initialValue: 'none' }),
            defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'notes', title: 'Notes', type: 'text', rows: 2 }),
            defineField({
              name: 'dogProfile',
              title: 'Dog Profile',
              type: 'reference',
              to: [{ type: 'dog' }],
              description: 'Link to a full dog profile if this puppy has one on the site',
            }),
          ],
          preview: {
            select: { name: 'name', sex: 'sex', status: 'status', media: 'photo' },
            prepare({ name, sex, status, media }) {
              const sexLabel = sex === 'bitch' ? 'Bitch' : sex === 'dog' ? 'Dog' : ''
              return { title: name, subtitle: [sexLabel, status !== 'none' ? status : ''].filter(Boolean).join(' · '), media }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'puppyPedigree',
      title: 'Expected Puppy Pedigree',
      type: 'pedigreeTree',
      description: 'The expected pedigree tree for puppies from this litter',
      options: { collapsible: true, collapsed: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      of: [{ type: 'galleryImage' }],
    }),
    defineField({
      name: 'timeline',
      title: 'Litter Diary / Timeline',
      type: 'array',
      of: [{ type: 'litterUpdate' }],
      description: 'Diary entries for this litter — shown in reverse chronological order',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      sirePhoto: 'sire.mainPhoto',
    },
    prepare({ title, status, sirePhoto }) {
      return {
        title,
        subtitle: status !== 'none' ? status : undefined,
        media: sirePhoto,
      }
    },
  },
})
