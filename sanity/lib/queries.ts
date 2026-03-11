import { groq } from 'next-sanity'

// ── Pedigree helpers ───────────────────────────────────────────────────────────
// Single entry projection — resolves name from internalDog if not manually set
const PE = `{ "name": coalesce(name, internalDog->name), colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} }`

// Full pedigree tree projection.
// For grandparents: if the parent has an internalDog link, resolve from that dog's pedigree.
// For great-grandparents: first try via the parent's internalDog, then via the grandparent's internalDog.
const pedigreeBlock = (field: string) => `
  ${field} {
    sire ${PE},
    dam ${PE},
    "sireSire": select(sire.linkType == "internal" => sire.internalDog->pedigree.sire ${PE}, sireSire ${PE}),
    "sireDam":  select(sire.linkType == "internal" => sire.internalDog->pedigree.dam  ${PE}, sireDam  ${PE}),
    "damSire":  select(dam.linkType  == "internal" => dam.internalDog->pedigree.sire  ${PE}, damSire  ${PE}),
    "damDam":   select(dam.linkType  == "internal" => dam.internalDog->pedigree.dam   ${PE}, damDam   ${PE}),
    "sireSireSire": select(
      sire.linkType    == "internal" => sire.internalDog->pedigree.sireSire ${PE},
      sireSire.linkType == "internal" => sireSire.internalDog->pedigree.sire ${PE},
      sireSireSire ${PE}
    ),
    "sireSireDam": select(
      sire.linkType    == "internal" => sire.internalDog->pedigree.sireDam ${PE},
      sireSire.linkType == "internal" => sireSire.internalDog->pedigree.dam ${PE},
      sireSireDam ${PE}
    ),
    "sireDamSire": select(
      sire.linkType   == "internal" => sire.internalDog->pedigree.damSire ${PE},
      sireDam.linkType == "internal" => sireDam.internalDog->pedigree.sire ${PE},
      sireDamSire ${PE}
    ),
    "sireDamDam": select(
      sire.linkType   == "internal" => sire.internalDog->pedigree.damDam ${PE},
      sireDam.linkType == "internal" => sireDam.internalDog->pedigree.dam ${PE},
      sireDamDam ${PE}
    ),
    "damSireSire": select(
      dam.linkType    == "internal" => dam.internalDog->pedigree.sireSire ${PE},
      damSire.linkType == "internal" => damSire.internalDog->pedigree.sire ${PE},
      damSireSire ${PE}
    ),
    "damSireDam": select(
      dam.linkType    == "internal" => dam.internalDog->pedigree.sireDam ${PE},
      damSire.linkType == "internal" => damSire.internalDog->pedigree.dam ${PE},
      damSireDam ${PE}
    ),
    "damDamSire": select(
      dam.linkType   == "internal" => dam.internalDog->pedigree.damSire ${PE},
      damDam.linkType == "internal" => damDam.internalDog->pedigree.sire ${PE},
      damDamSire ${PE}
    ),
    "damDamDam": select(
      dam.linkType   == "internal" => dam.internalDog->pedigree.damDam ${PE},
      damDam.linkType == "internal" => damDam.internalDog->pedigree.dam ${PE},
      damDamDam ${PE}
    )
  }
`

// ── Site Settings ──────────────────────────────────────────────────────────────
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    logo,
    favicon,
    primaryColor,
    secondaryColor,
    accentColor,
    headingFont,
    bodyFont,
    navLinks[] {
      label,
      href,
      isExternal
    },
    footerText,
    address,
    phone,
    email,
    facebookUrl,
    instagramUrl,
    contactFormEmail
  }
`

// ── Pages ─────────────────────────────────────────────────────────────────────
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    heroImage,
    heroTitle,
    heroSubtitle,
    content[] {
      ...,
      _type == "featuredDogs" => {
        ...,
        dogs[]-> {
          _id, name, slug, mainPhoto, breed, sex, "summary": blurb[0]
        }
      },
      _type == "featuredLitters" => {
        ...,
        litters[]-> {
          _id, title, slug, status, expectedDate, actualDate, sireName, damName, sirePhoto, damPhoto, sire->{name, mainPhoto}, dam->{name, mainPhoto}
        }
      },
      _type == "latestNews" => {
        ...,
        "posts": *[_type == "newsPost"] | order(publishedAt desc) [0..2] {
          _id, title, slug, publishedAt, featuredImage, excerpt
        }
      }
    },
    seo
  }
`

export const homepageQuery = groq`
  *[_type == "page" && isHomepage == true][0] {
    _id,
    title,
    slug,
    heroImage,
    heroTitle,
    heroSubtitle,
    content[] {
      ...,
      _type == "featuredDogs" => {
        ...,
        dogs[]-> {
          _id, name, slug, mainPhoto, breed, sex, "summary": blurb[0]
        }
      },
      _type == "featuredLitters" => {
        ...,
        litters[]-> {
          _id, title, slug, status, expectedDate, actualDate, sireName, damName, sirePhoto, damPhoto, sire->{name, mainPhoto}, dam->{name, mainPhoto}
        }
      },
      _type == "latestNews" => {
        ...,
        "posts": *[_type == "newsPost"] | order(publishedAt desc) [0..2] {
          _id, title, slug, publishedAt, featuredImage, excerpt
        }
      }
    },
    seo
  }
`

export const allPageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current)] { "slug": slug.current }
`

// ── Dogs ──────────────────────────────────────────────────────────────────────
export const allDogsQuery = groq`
  *[_type == "dog"] | order(name asc) {
    _id, name, slug, breed, sex, mainPhoto, status,
    "summary": blurb[0]
  }
`

export const dogBySlugQuery = groq`
  *[_type == "dog" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    sex,
    breed,
    dateOfBirth,
    colour,
    registrationNumbers[]{ label, value },
    displayName,
    allowEnquiry,
    status,
    mainPhoto,
    blurb,
    healthTests[] {
      testName,
      result,
      date,
      certificateUrl
    },
    ${pedigreeBlock('pedigree')},
    gallery[] {
      _key,
      image,
      caption,
      altText
    },
    showResults[] {
      showName, date, result, judge
    }
  }
`

export const allDogSlugsQuery = groq`
  *[_type == "dog" && defined(slug.current)] { "slug": slug.current }
`

// ── Litters ───────────────────────────────────────────────────────────────────
export const allLittersQuery = groq`
  *[_type == "litter"] | order(coalesce(actualDate, expectedDate) desc) {
    _id, title, slug, status, expectedDate, actualDate,
    sire->{name, mainPhoto},
    dam->{name, mainPhoto},
    sireName, damName, sirePhoto, damPhoto,
    description[0]
  }
`

export const litterBySlugQuery = groq`
  *[_type == "litter" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    status,
    expectedDate,
    actualDate,
    numberOfPuppies,
    numberOfDogs,
    numberOfBitches,
    description,
    sire->{
      _id, name, displayName, slug, mainPhoto, breed, sex, colour, dateOfBirth, status,
      healthTests[] { testName, result, date, certificateUrl },
      registrationNumbers[]{ label, value }
    },
    dam->{
      _id, name, displayName, slug, mainPhoto, breed, sex, colour, dateOfBirth, status,
      healthTests[] { testName, result, date, certificateUrl },
      registrationNumbers[]{ label, value }
    },
    sireName, sireBreed, sireColour, sireDateOfBirth, sireRegistrationNumbers[]{ label, value }, sirePhoto, sireHealthTests[] { testName, result, date, certificateUrl },
    damName, damBreed, damColour, damDateOfBirth, damRegistrationNumbers[]{ label, value }, damPhoto, damHealthTests[] { testName, result, date, certificateUrl },
    ${pedigreeBlock('puppyPedigree')},
    puppies[] {
      _key, name, sex, colour, status, photo, notes,
      dogProfile->{ name, slug }
    },
    gallery[] { _key, image, caption, altText },
    timeline[] | order(date desc) {
      _key, date, title, content, photos[] { _key, image, caption, altText }
    }
  }
`

export const allLitterSlugsQuery = groq`
  *[_type == "litter" && defined(slug.current)] { "slug": slug.current }
`

// ── News ──────────────────────────────────────────────────────────────────────
export const allNewsPostsQuery = groq`
  *[_type == "newsPost"] | order(publishedAt desc) {
    _id, title, slug, publishedAt, featuredImage, excerpt, tags
  }
`

export const newsPostBySlugQuery = groq`
  *[_type == "newsPost" && slug.current == $slug][0] {
    _id, title, slug, publishedAt, featuredImage, excerpt, tags, body
  }
`

export const allNewsSlugQuery = groq`
  *[_type == "newsPost" && defined(slug.current)] { "slug": slug.current }
`
