import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.divider(),
      S.listItem()
        .title('Pages')
        .schemaType('page')
        .child(S.documentTypeList('page').title('Pages')),
      S.divider(),
      S.listItem()
        .title('Dogs & Bitches')
        .schemaType('dog')
        .child(S.documentTypeList('dog').title('Dogs & Bitches')),
      S.listItem()
        .title('Litters')
        .schemaType('litter')
        .child(S.documentTypeList('litter').title('Litters')),
      S.divider(),
      S.listItem()
        .title('News & Updates')
        .schemaType('newsPost')
        .child(S.documentTypeList('newsPost').title('News & Updates')),
    ])
