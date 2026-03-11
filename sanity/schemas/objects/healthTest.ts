import { defineType, defineField } from 'sanity'

export const healthTest = defineType({
  name: 'healthTest',
  title: 'Health Test',
  type: 'object',
  fields: [
    defineField({
      name: 'testName',
      title: 'Test Name',
      type: 'string',
      description: 'e.g. Hip Score, Elbow Score, Eye Test, DNA Test for PRA',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'result',
      title: 'Result / Grade',
      type: 'string',
      description: 'e.g. Clear, Carrier, Affected, Pass, 4:3 (7 total), Excellent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Test Date',
      type: 'date',
    }),
    defineField({
      name: 'certificateUrl',
      title: 'Certificate URL',
      type: 'url',
      description: 'Link to the official test certificate',
    }),
  ],
  preview: {
    select: {
      testName: 'testName',
      result: 'result',
    },
    prepare({ testName, result }) {
      return {
        title: testName,
        subtitle: result,
      }
    },
  },
})
