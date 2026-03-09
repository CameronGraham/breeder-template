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
      name: 'sireKcTitle',
      title: "Sire's KC Title",
      type: 'string',
    }),
    defineField({
      name: 'sireKcReg',
      title: "Sire's KC Registration Number",
      type: 'string',
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
      name: 'damKcTitle',
      title: "Dam's KC Title",
      type: 'string',
    }),
    defineField({
      name: 'damKcReg',
      title: "Dam's KC Registration Number",
      type: 'string',
    }),
    defineField({
      name: 'damHealthTests',
      title: "Dam's Health Tests (external)",
      type: 'array',
      of: [{ type: 'healthTest' }],
      description: 'Used if the dam is not on this site',
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
        subtitle: status,
        media: sirePhoto,
      }
    },
  },
})
