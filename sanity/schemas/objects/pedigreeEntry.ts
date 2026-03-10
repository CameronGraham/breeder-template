import { defineType, defineField } from 'sanity'

export const pedigreeEntry = defineType({
  name: 'pedigreeEntry',
  title: 'Pedigree Entry',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'colour',
      title: 'Colour / Coat',
      type: 'string',
    }),
    defineField({
      name: 'breeder',
      title: 'Breeder',
      type: 'string',
    }),
    defineField({
      name: 'owner',
      title: 'Owner',
      type: 'string',
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'No link', value: 'none' },
          { title: 'Internal (on this site)', value: 'internal' },
          { title: 'External URL', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'internalDog',
      title: 'Internal Dog',
      type: 'reference',
      to: [{ type: 'dog' }],
      hidden: ({ parent }) => (parent as { linkType?: string })?.linkType !== 'internal',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({ parent }) => (parent as { linkType?: string })?.linkType !== 'external',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      colour: 'colour',
    },
    prepare({ name, colour }) {
      return {
        title: name,
        subtitle: colour,
      }
    },
  },
})
