import { defineType, defineField } from 'sanity'

export const pedigreeEntry = defineType({
  name: 'pedigreeEntry',
  title: 'Pedigree Entry',
  type: 'object',
  fieldsets: [
    {
      name: 'details',
      title: 'Additional Details',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Leave blank when linking to an internal dog — name will be pulled automatically',
    }),
    defineField({
      name: 'colour',
      title: 'Colour / Coat',
      type: 'string',
      fieldset: 'details',
    }),
    defineField({
      name: 'breeder',
      title: 'Breeder',
      type: 'string',
      fieldset: 'details',
    }),
    defineField({
      name: 'owner',
      title: 'Owner',
      type: 'string',
      fieldset: 'details',
    }),
    defineField({
      name: 'linkType',
      title: 'Link',
      type: 'string',
      options: {
        list: [
          { title: 'No link', value: 'none' },
          { title: 'Internal (on this site)', value: 'internal' },
          { title: 'External URL', value: 'external' },
        ],
      },
      initialValue: 'none',
      fieldset: 'details',
    }),
    defineField({
      name: 'internalDog',
      title: 'Internal Dog',
      type: 'reference',
      to: [{ type: 'dog' }],
      hidden: ({ parent }) => (parent as { linkType?: string })?.linkType !== 'internal',
      fieldset: 'details',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({ parent }) => (parent as { linkType?: string })?.linkType !== 'external',
      fieldset: 'details',
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
