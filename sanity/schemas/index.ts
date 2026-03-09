import { siteSettings } from './documents/siteSettings'
import { page } from './documents/page'
import { dog } from './documents/dog'
import { litter } from './documents/litter'
import { newsPost } from './documents/newsPost'
import { pedigreeEntry } from './objects/pedigreeEntry'
import { pedigreeTree } from './objects/pedigreeTree'
import { healthTest } from './objects/healthTest'
import { galleryImage } from './objects/galleryImage'
import { litterUpdate } from './objects/litterUpdate'

export const schemaTypes = [
  // Documents
  siteSettings,
  page,
  dog,
  litter,
  newsPost,
  // Objects
  pedigreeEntry,
  pedigreeTree,
  healthTest,
  galleryImage,
  litterUpdate,
]
