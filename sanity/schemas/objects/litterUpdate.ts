import { defineType, defineField } from 'sanity'

export const litterUpdate = defineType({
  name: 'litterUpdate',
  title: 'Litter Update',
  type: 'object',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Week 1 - Eyes Opening!", "Ready for their new homes"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [{ type: 'galleryImage' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
    },
    prepare({ title, date }) {
      return {
        title,
        subtitle: date,
      }
    },
  },
})
