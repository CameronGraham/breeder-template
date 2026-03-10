import { groq } from 'next-sanity'

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
    status,
    mainPhoto,
    blurb,
    healthTests[] {
      testName,
      result,
      grade,
      date,
      certificateUrl
    },
    pedigree {
      sire { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      sireSire { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      sireSireSire { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      sireSireDam { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      sireDam { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      sireDamSire { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      sireDamDam { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      dam { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      damSire { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      damSireSire { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      damSireDam { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      damDam { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      damDamSire { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      damDamDam { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} }
    },
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
  *[_type == "litter"] | order(expectedDate desc) {
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
      _id, name, displayName, slug, mainPhoto, breed, sex,
      healthTests[] { testName, result, grade, date, certificateUrl },
      registrationNumbers
    },
    dam->{
      _id, name, displayName, slug, mainPhoto, breed, sex,
      healthTests[] { testName, result, grade, date, certificateUrl },
      registrationNumbers
    },
    sireName, sireRegistrationNumbers[]{ label, value }, sirePhoto, sireHealthTests[] { testName, result, grade, date, certificateUrl },
    damName, damRegistrationNumbers[]{ label, value }, damPhoto, damHealthTests[] { testName, result, grade, date, certificateUrl },
    puppyPedigree {
      sire { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      sireSire { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      sireSireSire { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      sireSireDam { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      sireDam { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      sireDamSire { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      sireDamDam { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      dam { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      damSire { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      damSireSire { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      damSireDam { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      damDam { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      damDamSire { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} },
      damDamDam { name, colour, breeder, owner, linkType, externalUrl, internalDog->{name, slug} }
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
