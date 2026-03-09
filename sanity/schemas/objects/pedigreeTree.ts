import { defineType, defineField } from 'sanity'

export const pedigreeTree = defineType({
  name: 'pedigreeTree',
  title: 'Pedigree Tree',
  type: 'object',
  fieldsets: [
    {
      name: 'sireSection',
      title: 'Sire (Father)',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'sireSireSection',
      title: "Sire's Sire (Paternal Grandfather)",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'sireDamSection',
      title: "Sire's Dam (Paternal Grandmother)",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'damSection',
      title: 'Dam (Mother)',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'damSireSection',
      title: "Dam's Sire (Maternal Grandfather)",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'damDamSection',
      title: "Dam's Dam (Maternal Grandmother)",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    // Sire
    defineField({
      name: 'sire',
      title: 'Sire',
      type: 'pedigreeEntry',
      fieldset: 'sireSection',
    }),
    // Sire's Sire
    defineField({
      name: 'sireSire',
      title: "Sire's Sire",
      type: 'pedigreeEntry',
      fieldset: 'sireSireSection',
    }),
    defineField({
      name: 'sireSireSire',
      title: "Sire's Sire's Sire",
      type: 'pedigreeEntry',
      fieldset: 'sireSireSection',
    }),
    defineField({
      name: 'sireSireDam',
      title: "Sire's Sire's Dam",
      type: 'pedigreeEntry',
      fieldset: 'sireSireSection',
    }),
    // Sire's Dam
    defineField({
      name: 'sireDam',
      title: "Sire's Dam",
      type: 'pedigreeEntry',
      fieldset: 'sireDamSection',
    }),
    defineField({
      name: 'sireDamSire',
      title: "Sire's Dam's Sire",
      type: 'pedigreeEntry',
      fieldset: 'sireDamSection',
    }),
    defineField({
      name: 'sireDamDam',
      title: "Sire's Dam's Dam",
      type: 'pedigreeEntry',
      fieldset: 'sireDamSection',
    }),
    // Dam
    defineField({
      name: 'dam',
      title: 'Dam',
      type: 'pedigreeEntry',
      fieldset: 'damSection',
    }),
    // Dam's Sire
    defineField({
      name: 'damSire',
      title: "Dam's Sire",
      type: 'pedigreeEntry',
      fieldset: 'damSireSection',
    }),
    defineField({
      name: 'damSireSire',
      title: "Dam's Sire's Sire",
      type: 'pedigreeEntry',
      fieldset: 'damSireSection',
    }),
    defineField({
      name: 'damSireDam',
      title: "Dam's Sire's Dam",
      type: 'pedigreeEntry',
      fieldset: 'damSireSection',
    }),
    // Dam's Dam
    defineField({
      name: 'damDam',
      title: "Dam's Dam",
      type: 'pedigreeEntry',
      fieldset: 'damDamSection',
    }),
    defineField({
      name: 'damDamSire',
      title: "Dam's Dam's Sire",
      type: 'pedigreeEntry',
      fieldset: 'damDamSection',
    }),
    defineField({
      name: 'damDamDam',
      title: "Dam's Dam's Dam",
      type: 'pedigreeEntry',
      fieldset: 'damDamSection',
    }),
  ],
})
