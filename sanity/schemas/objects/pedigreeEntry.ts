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
      name: 'kcTitle',
      title: 'KC Title / Affix',
      type: 'string',
      description: 'Any KC title, prefix or affix',
    }),
    defineField({
      name: 'kcRegistrationNumber',
      title: 'KC Registration Number',
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
      kcTitle: 'kcTitle',
    },
    prepare({ name, kcTitle }) {
      return {
        title: kcTitle ? `${kcTitle} ${name}` : name,
      }
    },
  },
})
