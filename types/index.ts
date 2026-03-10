// ── Sanity base types ─────────────────────────────────────────────────────────

export interface SanityAsset {
  _ref: string
  _type: 'reference'
}

export interface SanityImage {
  _type: 'image'
  asset: SanityAsset
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface SanitySlug {
  _type: 'slug'
  current: string
}

export interface PortableTextBlock {
  _type: 'block'
  _key: string
  style: string
  children: Array<{
    _type: 'span'
    _key: string
    text: string
    marks: string[]
  }>
  markDefs: Array<{
    _key: string
    _type: string
    href?: string
    blank?: boolean
  }>
}

// ── Sanity Objects ────────────────────────────────────────────────────────────

export interface PedigreeEntry {
  name: string
  colour?: string
  breeder?: string
  owner?: string
  linkType: 'none' | 'internal' | 'external'
  internalDog?: {
    name: string
    slug: SanitySlug
  }
  externalUrl?: string
}

export interface PedigreeTree {
  sire?: PedigreeEntry
  sireSire?: PedigreeEntry
  sireSireSire?: PedigreeEntry
  sireSireDam?: PedigreeEntry
  sireDam?: PedigreeEntry
  sireDamSire?: PedigreeEntry
  sireDamDam?: PedigreeEntry
  dam?: PedigreeEntry
  damSire?: PedigreeEntry
  damSireSire?: PedigreeEntry
  damSireDam?: PedigreeEntry
  damDam?: PedigreeEntry
  damDamSire?: PedigreeEntry
  damDamDam?: PedigreeEntry
}

export interface HealthTest {
  testName: string
  result: string
  grade?: string
  date?: string
  certificateUrl?: string
}

export interface GalleryImage {
  _key: string
  image: SanityImage
  caption?: string
  altText?: string
}

export interface LitterUpdate {
  _key: string
  date: string
  title: string
  content?: PortableTextBlock[]
  photos?: GalleryImage[]
}

// ── Sanity Documents ──────────────────────────────────────────────────────────

export interface NavLink {
  label: string
  href: string
  isExternal: boolean
}

export interface SiteSettings {
  siteName: string
  tagline?: string
  logo?: SanityImage
  favicon?: SanityImage
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  headingFont?: string
  bodyFont?: string
  navLinks?: NavLink[]
  footerText?: string
  address?: string
  phone?: string
  email?: string
  facebookUrl?: string
  instagramUrl?: string
  contactFormEmail?: string
}

// Page content block types
export interface RichTextBlock {
  _type: 'richText'
  _key: string
  heading?: string
  body?: PortableTextBlock[]
  alignment?: 'left' | 'center'
}

export interface ImageBlock {
  _type: 'imageBlock'
  _key: string
  image: SanityImage
  caption?: string
  altText?: string
  layout?: 'full' | 'left' | 'right'
}

export interface TwoColumnTextBlock {
  _type: 'twoColumnText'
  _key: string
  leftContent?: PortableTextBlock[]
  rightContent?: PortableTextBlock[]
}

export interface FeaturedDogsBlock {
  _type: 'featuredDogs'
  _key: string
  heading?: string
  dogs?: DogSummary[]
}

export interface FeaturedLittersBlock {
  _type: 'featuredLitters'
  _key: string
  heading?: string
  litters?: LitterSummary[]
}

export interface LatestNewsBlock {
  _type: 'latestNews'
  _key: string
  heading?: string
  count?: number
  posts?: NewsPostSummary[]
}

export interface ContactFormBlock {
  _type: 'contactForm'
  _key: string
  heading?: string
  introText?: string
}

export interface CallToActionBlock {
  _type: 'callToAction'
  _key: string
  heading?: string
  text?: string
  buttonLabel?: string
  buttonUrl?: string
}

export type PageContentBlock =
  | RichTextBlock
  | ImageBlock
  | TwoColumnTextBlock
  | FeaturedDogsBlock
  | FeaturedLittersBlock
  | LatestNewsBlock
  | ContactFormBlock
  | CallToActionBlock

export interface SEO {
  seoTitle?: string
  seoDescription?: string
  ogImage?: SanityImage
}

export interface Page {
  _id: string
  title: string
  slug: SanitySlug
  isHomepage?: boolean
  heroImage?: SanityImage
  heroTitle?: string
  heroSubtitle?: string
  content?: PageContentBlock[]
  seo?: SEO
}

export interface DogSummary {
  _id: string
  name: string
  slug: SanitySlug
  breed?: string
  sex?: 'dog' | 'bitch'
  mainPhoto: SanityImage
  status?: 'none' | 'active' | 'retired' | 'deceased'
  summary?: PortableTextBlock
}

export interface ShowResult {
  showName: string
  date?: string
  result: string
  judge?: string
}

export interface Dog {
  _id: string
  name: string
  slug: SanitySlug
  sex?: 'dog' | 'bitch'
  breed?: string
  dateOfBirth?: string
  colour?: string
  registrationNumbers?: { label: string; value: string }[]
  displayName?: string
  status?: 'none' | 'active' | 'retired' | 'deceased'
  mainPhoto: SanityImage
  blurb?: PortableTextBlock[]
  healthTests?: HealthTest[]
  pedigree?: PedigreeTree
  gallery?: GalleryImage[]
  showResults?: ShowResult[]
}

export interface LitterSummary {
  _id: string
  title: string
  slug: SanitySlug
  status: 'none' | 'planned' | 'expecting' | 'born' | 'available' | 'all placed'
  expectedDate?: string
  actualDate?: string
  sire?: { name: string; mainPhoto?: SanityImage }
  dam?: { name: string; mainPhoto?: SanityImage }
  sireName?: string
  damName?: string
  sirePhoto?: SanityImage
  damPhoto?: SanityImage
}

export interface Litter {
  _id: string
  title: string
  slug: SanitySlug
  status: 'none' | 'planned' | 'expecting' | 'born' | 'available' | 'all placed'
  expectedDate?: string
  actualDate?: string
  numberOfPuppies?: number
  numberOfDogs?: number
  numberOfBitches?: number
  description?: PortableTextBlock[]
  sire?: Dog
  dam?: Dog
  sireName?: string
  sireKcTitle?: string
  sireKcReg?: string
  sirePhoto?: SanityImage
  sireHealthTests?: HealthTest[]
  damName?: string
  damKcTitle?: string
  damKcReg?: string
  damPhoto?: SanityImage
  damHealthTests?: HealthTest[]
  puppyPedigree?: PedigreeTree
  gallery?: GalleryImage[]
  timeline?: LitterUpdate[]
}

export interface NewsPostSummary {
  _id: string
  title: string
  slug: SanitySlug
  publishedAt: string
  featuredImage?: SanityImage
  excerpt?: string
  tags?: string[]
}

export interface NewsPost {
  _id: string
  title: string
  slug: SanitySlug
  publishedAt: string
  featuredImage?: SanityImage
  excerpt?: string
  tags?: string[]
  body?: PortableTextBlock[]
}
