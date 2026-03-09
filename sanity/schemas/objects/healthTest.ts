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
      title: 'Result',
      type: 'string',
      description: 'e.g. Clear, Carrier, Affected, Pass, Fail',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'grade',
      title: 'Grade / Score',
      type: 'string',
      description: 'For hip/elbow scores, e.g. 4:3 (7 total), or Excellent/Good/Fair',
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
      grade: 'grade',
    },
    prepare({ testName, result, grade }) {
      return {
        title: testName,
        subtitle: grade ? `${result} (${grade})` : result,
      }
    },
  },
})
