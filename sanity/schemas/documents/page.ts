import { defineType, defineField } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isHomepage',
      title: 'Homepage',
      type: 'boolean',
      description: 'Enable to make this the homepage (only one page should have this enabled)',
      initialValue: false,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Large text overlaid on the hero image (defaults to page title)',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'richText',
          title: 'Rich Text Block',
          fields: [
            {
              name: 'heading',
              title: 'Optional Heading',
              type: 'string',
            },
            {
              name: 'body',
              title: 'Content',
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
                { type: 'image', options: { hotspot: true } },
              ],
            },
            {
              name: 'alignment',
              title: 'Text Alignment',
              type: 'string',
              options: {
                list: [
                  { title: 'Left', value: 'left' },
                  { title: 'Centre', value: 'center' },
                ],
                layout: 'radio',
              },
              initialValue: 'left',
            },
          ],
          preview: {
            select: { heading: 'heading' },
            prepare({ heading }) {
              return { title: heading || 'Rich Text Block', subtitle: 'Text content' }
            },
          },
        },
        {
          type: 'object',
          name: 'imageBlock',
          title: 'Image Block',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule: { required: () => unknown }) => Rule.required(),
            },
            { name: 'caption', title: 'Caption', type: 'string' },
            { name: 'altText', title: 'Alt Text', type: 'string' },
            {
              name: 'layout',
              title: 'Layout',
              type: 'string',
              options: {
                list: [
                  { title: 'Full width', value: 'full' },
                  { title: 'Float left', value: 'left' },
                  { title: 'Float right', value: 'right' },
                ],
                layout: 'radio',
              },
              initialValue: 'full',
            },
          ],
          preview: {
            select: { media: 'image', caption: 'caption' },
            prepare({ media, caption }) {
              return { title: caption || 'Image Block', media }
            },
          },
        },
        {
          type: 'object',
          name: 'twoColumnText',
          title: 'Two Column Text',
          fields: [
            {
              name: 'leftContent',
              title: 'Left Column',
              type: 'array',
              of: [{ type: 'block' }],
            },
            {
              name: 'rightContent',
              title: 'Right Column',
              type: 'array',
              of: [{ type: 'block' }],
            },
          ],
          preview: {
            prepare() {
              return { title: 'Two Column Text' }
            },
          },
        },
        {
          type: 'object',
          name: 'featuredDogs',
          title: 'Featured Dogs',
          fields: [
            { name: 'heading', title: 'Section Heading', type: 'string' },
            {
              name: 'dogs',
              title: 'Dogs',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'dog' }] }],
            },
          ],
          preview: {
            select: { heading: 'heading' },
            prepare({ heading }) {
              return { title: heading || 'Featured Dogs' }
            },
          },
        },
        {
          type: 'object',
          name: 'featuredLitters',
          title: 'Featured Litters',
          fields: [
            { name: 'heading', title: 'Section Heading', type: 'string' },
            {
              name: 'litters',
              title: 'Litters',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'litter' }] }],
            },
          ],
          preview: {
            select: { heading: 'heading' },
            prepare({ heading }) {
              return { title: heading || 'Featured Litters' }
            },
          },
        },
        {
          type: 'object',
          name: 'latestNews',
          title: 'Latest News',
          fields: [
            { name: 'heading', title: 'Section Heading', type: 'string', initialValue: 'Latest News' },
            {
              name: 'count',
              title: 'Number of Posts',
              type: 'number',
              initialValue: 3,
              validation: (Rule: { min: (n: number) => { max: (n: number) => unknown } }) => Rule.min(1).max(12),
            },
          ],
          preview: {
            select: { heading: 'heading' },
            prepare({ heading }) {
              return { title: heading || 'Latest News' }
            },
          },
        },
        {
          type: 'object',
          name: 'contactForm',
          title: 'Contact Form',
          fields: [
            { name: 'heading', title: 'Heading', type: 'string', initialValue: 'Get in Touch' },
            { name: 'introText', title: 'Introduction Text', type: 'text', rows: 3 },
          ],
          preview: {
            select: { heading: 'heading' },
            prepare({ heading }) {
              return { title: heading || 'Contact Form' }
            },
          },
        },
        {
          type: 'object',
          name: 'callToAction',
          title: 'Call to Action',
          fields: [
            { name: 'heading', title: 'Heading', type: 'string' },
            { name: 'text', title: 'Text', type: 'text', rows: 2 },
            { name: 'buttonLabel', title: 'Button Label', type: 'string' },
            { name: 'buttonUrl', title: 'Button URL', type: 'string' },
          ],
          preview: {
            select: { heading: 'heading' },
            prepare({ heading }) {
              return { title: heading || 'Call to Action' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'seoTitle', title: 'SEO Title', type: 'string' },
        { name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 3 },
        { name: 'ogImage', title: 'OG Image', type: 'image', options: { hotspot: true } },
      ],
      options: { collapsible: true, collapsed: true },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      isHomepage: 'isHomepage',
    },
    prepare({ title, slug, isHomepage }) {
      return {
        title,
        subtitle: isHomepage ? '(Homepage) /' : `/${slug}`,
      }
    },
  },
})
