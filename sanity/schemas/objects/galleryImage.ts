import { defineType, defineField } from 'sanity'

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'altText',
      title: 'Alt Text',
      type: 'string',
      description: 'Describe the image for screen readers',
    }),
  ],
  preview: {
    select: {
      media: 'image',
      caption: 'caption',
      altText: 'altText',
    },
    prepare({ media, caption, altText }) {
      return {
        title: caption || altText || 'Gallery Image',
        media,
      }
    },
  },
})
