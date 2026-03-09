/**
 * Seed script — populates the Sanity CMS with example data.
 *
 * Prerequisites:
 *   1. Add SANITY_WRITE_TOKEN to .env.local (Editor role token from sanity.io/manage)
 *   2. Run: node scripts/seed.mjs
 *
 * Safe to run multiple times — uses createOrReplace so existing docs are overwritten.
 * NOTE: Images cannot be uploaded via this script. After seeding, add photos to
 *       each dog, litter, and news post through the Studio at /studio.
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Load .env.local ────────────────────────────────────────────────────────────
function loadEnv() {
  try {
    const envFile = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8')
    for (const line of envFile.split('\n')) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIndex = trimmed.indexOf('=')
        if (eqIndex !== -1) {
          const key = trimmed.slice(0, eqIndex).trim()
          const val = trimmed.slice(eqIndex + 1).trim()
          if (!process.env[key]) process.env[key] = val
        }
      }
    }
  } catch {
    // .env.local not found — rely on environment variables already set
  }
}

loadEnv()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId) {
  console.error('❌  NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local')
  process.exit(1)
}
if (!token) {
  console.error('❌  SANITY_WRITE_TOKEN is not set in .env.local')
  console.error('    Create an Editor token at sanity.io/manage → API → Tokens')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function block(text) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
  }
}

function heading(text, style = 'h2') {
  return { ...block(text), style }
}

function pedigreeEntry(name, kcTitle = '') {
  return { name, kcTitle, linkType: 'none' }
}

async function upsert(doc) {
  await client.createOrReplace(doc)
  console.log(`  ✓ ${doc._type}: ${doc.title || doc.name || doc.siteName || doc._id}`)
}

// ── Seed data ─────────────────────────────────────────────────────────────────

console.log('\n🌱  Seeding Sanity dataset:', dataset)
console.log('    Project:', projectId)
console.log()

// ── 1. Site Settings ──────────────────────────────────────────────────────────
console.log('📋  Site Settings')
await upsert({
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: 'Stonebrook Labradors',
  tagline: 'Breeding quality Labradors with health, temperament and type at the heart of everything we do.',
  primaryColor: '#2d5282',
  secondaryColor: '#1a3558',
  accentColor: '#c8a96e',
  headingFont: 'Playfair Display',
  bodyFont: 'Lato',
  navLinks: [
    { _key: 'nav-1', label: 'Home',      href: '/',        isExternal: false },
    { _key: 'nav-2', label: 'Our Dogs',  href: '/dogs',    isExternal: false },
    { _key: 'nav-3', label: 'Litters',   href: '/litters', isExternal: false },
    { _key: 'nav-4', label: 'News',      href: '/news',    isExternal: false },
    { _key: 'nav-5', label: 'Contact',   href: '/contact', isExternal: false },
  ],
  footerText: 'Stonebrook Labradors has been breeding quality Labradors for over 20 years. All our dogs are fully health tested and raised in our family home.',
  address: 'Stonebrook Farm\nLittle Oakham\nLeicestershire\nLE12 4AB',
  phone: '07700 900 123',
  email: 'hello@stonebrooklabradors.co.uk',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  contactFormEmail: 'hello@stonebrooklabradors.co.uk',
})

// ── 2. Dogs ───────────────────────────────────────────────────────────────────
console.log('\n🐕  Dogs')

await upsert({
  _id: 'dog-bella',
  _type: 'dog',
  name: 'Bella',
  slug: { _type: 'slug', current: 'bella' },
  sex: 'bitch',
  breed: 'Labrador Retriever',
  dateOfBirth: '2020-03-15',
  colour: 'Yellow',
  kcRegistrationNumber: 'AV01234501',
  kcTitle: 'Sh Ch Stonebrook',
  status: 'active',
  blurb: [
    heading('About Bella', 'h2'),
    block('Bella is our foundation bitch and the cornerstone of the Stonebrook breeding programme. She is a stunning yellow Labrador with an outstanding temperament, equally at home in the show ring or the family sitting room.'),
    block('She has passed all health tests with flying colours and consistently produces typey, healthy puppies with wonderful natures. Bella is a naturally gentle, biddable dog who loves nothing more than a game of fetch followed by a cuddle on the sofa.'),
  ],
  healthTests: [
    { _key: 'ht-1', testName: 'Hip Score', result: 'Clear', grade: '4:3 (7 total)', date: '2021-06-10', certificateUrl: 'https://www.thekennelclub.org.uk' },
    { _key: 'ht-2', testName: 'Elbow Score', result: 'Clear', grade: '0:0', date: '2021-06-10' },
    { _key: 'ht-3', testName: 'Eye Test', result: 'Clear', date: '2023-04-22' },
    { _key: 'ht-4', testName: 'PRA DNA Test', result: 'Clear', date: '2020-08-01' },
    { _key: 'ht-5', testName: 'Exercise Induced Collapse (EIC)', result: 'Clear', date: '2020-08-01' },
    { _key: 'ht-6', testName: 'Centronuclear Myopathy (CNM)', result: 'Clear', date: '2020-08-01' },
  ],
  pedigree: {
    sire: pedigreeEntry('Stonebrook Golden Lad', 'Sh Ch'),
    sireSire: pedigreeEntry('Oakwood Firecracker', 'Ch'),
    sireSireSire: pedigreeEntry('Rivermead Thunder', 'Sh Ch'),
    sireSireDam: pedigreeEntry('Oakwood Golden Girl'),
    sireDam: pedigreeEntry('Stonebrook Morning Star'),
    sireDamSire: pedigreeEntry('Sandybrook Magnus'),
    sireDamDam: pedigreeEntry('Stonebrook Lady of the Lake'),
    dam: pedigreeEntry('Fernlea Daydream'),
    damSire: pedigreeEntry('Fernlea Brigadier', 'Ch'),
    damSireSire: pedigreeEntry('Cambremer Goldtop', 'Sh Ch'),
    damSireDam: pedigreeEntry('Fernlea Sundowner'),
    damDam: pedigreeEntry('Fernlea Sweet Briar'),
    damDamSire: pedigreeEntry('Poolstead Promise'),
    damDamDam: pedigreeEntry('Fernlea Morning Mist'),
  },
  showResults: [
    { _key: 'sr-1', showName: 'Crufts', date: '2022-03-12', result: 'Best Bitch', judge: 'Mrs J. Hamilton' },
    { _key: 'sr-2', showName: 'East of England Show', date: '2022-06-18', result: 'Best of Breed', judge: 'Mr D. Patterson' },
    { _key: 'sr-3', showName: 'Labrador Retriever Club Championship Show', date: '2023-09-09', result: 'Reserve CC', judge: 'Mrs C. Wilkes' },
  ],
})

await upsert({
  _id: 'dog-max',
  _type: 'dog',
  name: 'Max',
  slug: { _type: 'slug', current: 'max' },
  sex: 'dog',
  breed: 'Labrador Retriever',
  dateOfBirth: '2019-07-22',
  colour: 'Black',
  kcRegistrationNumber: 'AV00987601',
  kcTitle: 'Ch Rivermead',
  status: 'active',
  blurb: [
    heading('About Max', 'h2'),
    block('Max is an exceptional black Labrador dog who has had a distinguished show career, holding the title of Champion. He is owned by Mr & Mrs P. Fletcher of Rivermead Labradors, and we are thrilled to have had the opportunity to use him at stud.'),
    block('Max is a dog of classic Labrador type — broad skull, strong neck, powerful hindquarters and a beautifully thick otter tail. His temperament is exemplary and he passes on his outstanding qualities to his offspring.'),
  ],
  healthTests: [
    { _key: 'ht-1', testName: 'Hip Score', result: 'Clear', grade: '3:4 (7 total)', date: '2020-09-14' },
    { _key: 'ht-2', testName: 'Elbow Score', result: 'Clear', grade: '0:0', date: '2020-09-14' },
    { _key: 'ht-3', testName: 'Eye Test', result: 'Clear', date: '2023-11-05' },
    { _key: 'ht-4', testName: 'PRA DNA Test', result: 'Clear', date: '2019-10-10' },
    { _key: 'ht-5', testName: 'Exercise Induced Collapse (EIC)', result: 'Clear', date: '2019-10-10' },
    { _key: 'ht-6', testName: 'Centronuclear Myopathy (CNM)', result: 'Clear', date: '2019-10-10' },
  ],
  pedigree: {
    sire: pedigreeEntry('Rivermead Thunder', 'Sh Ch'),
    sireSire: pedigreeEntry('Cambremer Black Ace', 'Ch'),
    sireSireSire: pedigreeEntry('Sandybrook Magnus'),
    sireSireDam: pedigreeEntry('Cambremer Midnight Lady'),
    sireDam: pedigreeEntry('Rivermead Dark Star'),
    sireDamSire: pedigreeEntry('Poolstead Promise'),
    sireDamDam: pedigreeEntry('Rivermead Starlight'),
    dam: pedigreeEntry('Oakwood Ebony Queen'),
    damSire: pedigreeEntry('Ballyduff Storm', 'Int Ch'),
    damSireSire: pedigreeEntry('Kupros Master Mariner'),
    damSireDam: pedigreeEntry('Ballyduff Marketeer'),
    damDam: pedigreeEntry('Oakwood Summer Dream'),
    damDamSire: pedigreeEntry('Oakwood Lancer'),
    damDamDam: pedigreeEntry('Oakwood Golden Mist'),
  },
  showResults: [
    { _key: 'sr-1', showName: 'Crufts', date: '2021-03-13', result: 'CC & Best of Breed', judge: 'Mrs S. Brown' },
    { _key: 'sr-2', showName: 'Crufts', date: '2022-03-12', result: 'Reserve CC', judge: 'Mr A. Thompson' },
    { _key: 'sr-3', showName: 'Birmingham National', date: '2021-10-02', result: 'Best Dog', judge: 'Mrs F. Clarke' },
  ],
})

await upsert({
  _id: 'dog-luna',
  _type: 'dog',
  name: 'Luna',
  slug: { _type: 'slug', current: 'luna' },
  sex: 'bitch',
  breed: 'Labrador Retriever',
  dateOfBirth: '2016-05-08',
  colour: 'Chocolate',
  kcRegistrationNumber: 'AV00456701',
  kcTitle: 'Stonebrook',
  status: 'retired',
  blurb: [
    heading('About Luna', 'h2'),
    block('Luna is our beloved retired brood bitch who produced three outstanding litters for us. She is a beautiful chocolate Labrador with a wonderful, gentle temperament that she consistently passed on to her puppies.'),
    block('Now comfortably retired, Luna spends her days ruling the household and accompanying us on leisurely walks. She is the grande dame of Stonebrook Labradors and holds a very special place in our hearts.'),
  ],
  healthTests: [
    { _key: 'ht-1', testName: 'Hip Score', result: 'Clear', grade: '5:4 (9 total)', date: '2017-08-20' },
    { _key: 'ht-2', testName: 'Elbow Score', result: 'Clear', grade: '0:0', date: '2017-08-20' },
    { _key: 'ht-3', testName: 'Eye Test', result: 'Clear', date: '2019-05-14' },
    { _key: 'ht-4', testName: 'PRA DNA Test', result: 'Clear', date: '2016-09-01' },
  ],
})

// ── 3. Litters ────────────────────────────────────────────────────────────────
console.log('\n🐾  Litters')

await upsert({
  _id: 'litter-spring-2024',
  _type: 'litter',
  title: 'Bella × Max — Spring 2024',
  slug: { _type: 'slug', current: 'bella-x-max-spring-2024' },
  status: 'all placed',
  expectedDate: '2024-03-10',
  actualDate: '2024-03-08',
  numberOfPuppies: 9,
  numberOfDogs: 5,
  numberOfBitches: 4,
  description: [
    block('We were absolutely delighted with this litter — nine beautiful, healthy puppies born on 8th March 2024. The litter comprised five dogs and four bitches, with a mix of yellow and black colouring. All puppies have gone to wonderful, carefully vetted homes and we stay in regular contact with their new families.'),
    block('As with all our litters, the puppies were raised in our home, fully socialised with children, cats and other dogs, and received their first vaccination before leaving us.'),
  ],
  sire: { _type: 'reference', _ref: 'dog-max' },
  dam: { _type: 'reference', _ref: 'dog-bella' },
  puppyPedigree: {
    sire: { name: 'Max', kcTitle: 'Ch Rivermead', linkType: 'internal', internalDog: { _type: 'reference', _ref: 'dog-max' } },
    sireSire: pedigreeEntry('Rivermead Thunder', 'Sh Ch'),
    sireSireSire: pedigreeEntry('Cambremer Black Ace', 'Ch'),
    sireSireDam: pedigreeEntry('Cambremer Midnight Lady'),
    sireDam: pedigreeEntry('Rivermead Dark Star'),
    sireDamSire: pedigreeEntry('Poolstead Promise'),
    sireDamDam: pedigreeEntry('Rivermead Starlight'),
    dam: { name: 'Bella', kcTitle: 'Sh Ch Stonebrook', linkType: 'internal', internalDog: { _type: 'reference', _ref: 'dog-bella' } },
    damSire: pedigreeEntry('Stonebrook Golden Lad', 'Sh Ch'),
    damSireSire: pedigreeEntry('Oakwood Firecracker', 'Ch'),
    damSireDam: pedigreeEntry('Oakwood Golden Girl'),
    damDam: pedigreeEntry('Fernlea Daydream'),
    damDamSire: pedigreeEntry('Fernlea Brigadier', 'Ch'),
    damDamDam: pedigreeEntry('Fernlea Sweet Briar'),
  },
  timeline: [
    {
      _key: 'tl-1',
      date: '2024-03-08',
      title: 'The puppies have arrived! 🎉',
      content: [
        block('At 2:47am this morning, Bella began her labour and by 7:30am we had nine beautiful puppies — five boys and four girls. Bella was an absolute star and all puppies are feeding well. We are utterly exhausted but completely over the moon!'),
      ],
    },
    {
      _key: 'tl-2',
      date: '2024-03-15',
      title: 'One week old — all doing brilliantly',
      content: [
        block('What a week! All nine puppies have doubled their birth weight and are thriving. Their eyes are just beginning to open and they are already starting to explore their whelping box. Bella is an excellent mum and is coping brilliantly despite having such a large litter.'),
      ],
    },
    {
      _key: 'tl-3',
      date: '2024-04-05',
      title: 'Four weeks — chaos and cuteness!',
      content: [
        block('The puppies are now four weeks old and utterly adorable — and utterly exhausting! They are weaning well onto puppy mash and are beginning to play with each other. The house has officially been taken over. We are starting to introduce different sounds and experiences to help with their socialisation.'),
      ],
    },
    {
      _key: 'tl-4',
      date: '2024-05-03',
      title: 'All puppies have gone to their new homes',
      content: [
        block('The last of our nine puppies left for his new home today, and the house feels very quiet! We are thrilled with every single one of the homes we have chosen — they all went to experienced, loving families who fully understand the breed. We look forward to watching them grow up!'),
      ],
    },
  ],
})

await upsert({
  _id: 'litter-autumn-2025',
  _type: 'litter',
  title: 'Bella × Max — Autumn 2025',
  slug: { _type: 'slug', current: 'bella-x-max-autumn-2025' },
  status: 'available',
  expectedDate: '2025-09-20',
  actualDate: '2025-09-18',
  numberOfPuppies: 7,
  numberOfDogs: 3,
  numberOfBitches: 4,
  description: [
    block('We are thrilled to announce the arrival of Bella and Max\'s second litter — seven healthy puppies born on 18th September 2025. This litter has three dogs and four bitches, all yellows with one black dog.'),
    block('We have one dog puppy and two bitch puppies still available to exceptional homes. We are looking for families who understand the Labrador breed, ideally with prior experience of the breed, who can offer a wonderful, active family home.'),
    block('All puppies will leave with: full KC registration, first vaccination, microchip, puppy pack, insurance cover, lifetime breeder support and a contract of sale.'),
  ],
  sire: { _type: 'reference', _ref: 'dog-max' },
  dam: { _type: 'reference', _ref: 'dog-bella' },
  puppyPedigree: {
    sire: { name: 'Max', kcTitle: 'Ch Rivermead', linkType: 'internal', internalDog: { _type: 'reference', _ref: 'dog-max' } },
    sireSire: pedigreeEntry('Rivermead Thunder', 'Sh Ch'),
    sireSireSire: pedigreeEntry('Cambremer Black Ace', 'Ch'),
    sireSireDam: pedigreeEntry('Cambremer Midnight Lady'),
    sireDam: pedigreeEntry('Rivermead Dark Star'),
    sireDamSire: pedigreeEntry('Poolstead Promise'),
    sireDamDam: pedigreeEntry('Rivermead Starlight'),
    dam: { name: 'Bella', kcTitle: 'Sh Ch Stonebrook', linkType: 'internal', internalDog: { _type: 'reference', _ref: 'dog-bella' } },
    damSire: pedigreeEntry('Stonebrook Golden Lad', 'Sh Ch'),
    damSireSire: pedigreeEntry('Oakwood Firecracker', 'Ch'),
    damSireDam: pedigreeEntry('Oakwood Golden Girl'),
    damDam: pedigreeEntry('Fernlea Daydream'),
    damDamSire: pedigreeEntry('Fernlea Brigadier', 'Ch'),
    damDamDam: pedigreeEntry('Fernlea Sweet Briar'),
  },
  timeline: [
    {
      _key: 'tl-1',
      date: '2025-09-18',
      title: 'Seven perfect puppies! 🐾',
      content: [
        block('Bella has done it again — seven beautiful, healthy puppies arrived last night. Three boys and four girls, all nursing strongly. Bella is an old hand at this now and is remarkably calm and attentive. We could not be more pleased!'),
      ],
    },
    {
      _key: 'tl-2',
      date: '2025-09-25',
      title: 'One week old and growing fast',
      content: [
        block('All seven puppies have surpassed their birth weights and are feeding well. Eyes are still firmly shut but they are wriggling around enthusiastically and already competing for the best spots! Bella is doing a superb job.'),
      ],
    },
    {
      _key: 'tl-3',
      date: '2025-10-16',
      title: 'Four weeks old — eyes open, mayhem begins!',
      content: [
        block('The puppies are now four weeks old, fully mobile and absolutely full of mischief. They are eating puppy mash four times a day alongside nursing and are showing wonderful, bold, outgoing temperaments — classic Labrador. We are introducing them to a wide variety of sounds, textures and experiences every day.'),
      ],
    },
    {
      _key: 'tl-4',
      date: '2025-11-01',
      title: 'Six weeks — puppies available!',
      content: [
        block('We still have one dog puppy and two bitch puppies available. All are fully health checked by our vet, and are developing beautifully. If you are interested in one of our remaining puppies please get in touch — we would love to hear from you!'),
      ],
    },
  ],
})

await upsert({
  _id: 'litter-spring-2026',
  _type: 'litter',
  title: 'Bella × Duke — Spring 2026',
  slug: { _type: 'slug', current: 'bella-x-duke-spring-2026' },
  status: 'expecting',
  expectedDate: '2026-04-15',
  description: [
    block('We are very excited to announce that Bella has been mated to the outstanding Ch Sandybrook Duke of Earl, owned by Mr & Mrs A. Collins. Duke is a dog of exceptional type and temperament with a brilliant health testing record, and we believe this will be a very exciting combination.'),
    block('We are currently compiling a waiting list for this litter. If you would like to be considered, please get in touch and tell us a little about yourself, your home and your experience with Labradors.'),
  ],
  sire: { _type: 'reference', _ref: 'dog-bella' },
  dam: { _type: 'reference', _ref: 'dog-bella' },
  sireName: 'Duke of Earl',
  sireKcTitle: 'Ch Sandybrook',
  sireKcReg: 'AV02468001',
  sireHealthTests: [
    { _key: 'ht-1', testName: 'Hip Score', result: 'Clear', grade: '3:3 (6 total)', date: '2022-05-15' },
    { _key: 'ht-2', testName: 'Elbow Score', result: 'Clear', grade: '0:0', date: '2022-05-15' },
    { _key: 'ht-3', testName: 'Eye Test', result: 'Clear', date: '2024-02-20' },
    { _key: 'ht-4', testName: 'PRA DNA Test', result: 'Clear', date: '2021-11-01' },
    { _key: 'ht-5', testName: 'Exercise Induced Collapse (EIC)', result: 'Clear', date: '2021-11-01' },
  ],
})

// ── 4. News Posts ─────────────────────────────────────────────────────────────
console.log('\n📰  News posts')

await upsert({
  _id: 'news-welcome',
  _type: 'newsPost',
  title: 'Welcome to Stonebrook Labradors',
  slug: { _type: 'slug', current: 'welcome-to-stonebrook-labradors' },
  publishedAt: '2024-01-15T09:00:00.000Z',
  excerpt: 'We are delighted to launch our new website. Find out more about who we are, what we do, and the dogs at the heart of our breeding programme.',
  tags: ['About Us'],
  body: [
    heading('Welcome to Stonebrook Labradors', 'h2'),
    block('We are thrilled to launch our new website and to have a place where we can share our passion for the Labrador Retriever with the world. Stonebrook Labradors has been a family affair for over two decades, and every dog we breed carries a piece of our hearts.'),
    heading('Our Philosophy', 'h2'),
    block('At Stonebrook, we breed for health, temperament and type — in that order. Before any mating takes place, both parents are fully health tested to the Kennel Club Assured Breeder Scheme requirements and beyond. We believe that responsible breeding begins long before the puppies arrive.'),
    block('Our dogs live as part of our family and our puppies are born and raised in our home, fully integrated into the sights, sounds and rhythms of family life from their very first day. We believe this early socialisation gives them the very best start and contributes to the wonderful, adaptable temperaments for which Labradors are so rightly famous.'),
    heading('Kennel Club Assured Breeder', 'h2'),
    block('We are proud to be Kennel Club Assured Breeders, a scheme that holds us to the highest standards of care and ethical breeding. All our puppies are KC registered and we are always happy to show prospective buyers our dogs\' health certificates and pedigrees in full.'),
    block('We hope you enjoy exploring the site. Do get in touch if you have any questions — we love talking about our dogs!'),
  ],
})

await upsert({
  _id: 'news-health-tests',
  _type: 'newsPost',
  title: "Bella's Annual Health Tests — All Clear!",
  slug: { _type: 'slug', current: 'bella-annual-health-tests-all-clear' },
  publishedAt: '2024-04-22T10:30:00.000Z',
  excerpt: "We are absolutely delighted to report that Bella's annual eye test has come back completely clear once again. Here's a summary of her full health testing record.",
  tags: ['Health', 'Bella'],
  body: [
    block('We had Bella\'s annual eye test carried out last week by BVA panellist Mr R. Jones, and we are absolutely delighted to report that she is completely clear once again. Bella has now had five consecutive clear eye tests and we couldn\'t be more pleased.'),
    heading('Full Health Test Summary', 'h2'),
    block('For those interested in the detail, here is a summary of Bella\'s complete health testing record:'),
    block('Hip Score: 4:3 (7 total) — tested June 2021 at 15 months of age. This is well below the breed mean score of 12.'),
    block('Elbow Score: 0:0 — tested June 2021. Grade 0 on both elbows is the best possible result.'),
    block('Eye Test: Clear — most recent test April 2023.'),
    block('PRA DNA Test: Clear — this is a DNA test so only needs to be done once. Confirmed clear (non-carrier) in August 2020.'),
    block('Exercise Induced Collapse (EIC): Clear — DNA test carried out August 2020.'),
    block('Centronuclear Myopathy (CNM): Clear — DNA test carried out August 2020.'),
    heading('Why Health Testing Matters', 'h2'),
    block('We feel strongly that health testing is not optional for responsible breeders. These conditions can cause real suffering and by testing before breeding we can significantly reduce the risk of producing affected puppies. If you are buying a Labrador from any breeder, always ask to see the health certificates for both parents.'),
  ],
})

await upsert({
  _id: 'news-autumn-litter',
  _type: 'newsPost',
  title: "Our Autumn 2025 Litter Has Arrived!",
  slug: { _type: 'slug', current: 'autumn-2025-litter-has-arrived' },
  publishedAt: '2025-09-20T08:00:00.000Z',
  excerpt: "Seven beautiful, healthy puppies arrived on 18th September. Three dogs and four bitches, and we have a limited number of puppies available to the right homes.",
  tags: ['Litters', 'Puppies', 'Available'],
  body: [
    block('We are over the moon to announce the safe arrival of Bella and Max\'s second litter. Seven perfect puppies were born in the early hours of Thursday 18th September — three boys and four girls. Bella was, as ever, an absolute superstar.'),
    block('All puppies are feeding well, thriving and are as wriggly and vocal as you would expect from a Labrador litter! We are absolutely thrilled with them.'),
    heading('Availability', 'h2'),
    block('We do still have a small number of puppies available to the right homes. We are looking for experienced Labrador owners who can provide an active, loving family environment. We are not able to let puppies go to homes where they will be left for long periods.'),
    block('If you are interested, please use the contact form to get in touch. Tell us a little about yourself, your home and your experience with dogs. We will be in touch to arrange a visit.'),
    heading('What\'s Included', 'h2'),
    block('All puppies leave with: full KC registration, first vaccination, microchip, 5 weeks\' free insurance, written health guarantee, puppy pack (food, blanket, collar and lead), and our full lifetime support.'),
  ],
})

await upsert({
  _id: 'news-crufts-2025',
  _type: 'newsPost',
  title: 'What a Week at Crufts 2025!',
  slug: { _type: 'slug', current: 'crufts-2025' },
  publishedAt: '2025-03-14T16:00:00.000Z',
  excerpt: "Bella had a superb day at Crufts 2025, picking up the Challenge Certificate under breed specialist Mrs P. Davies. We are absolutely over the moon!",
  tags: ['Shows', 'Bella', 'Crufts'],
  body: [
    block('What a day. What a week. We are still pinching ourselves after Bella\'s incredible performance at Crufts 2025 yesterday. Under the expert eye of breed specialist Mrs P. Davies, our lovely girl picked up the Bitch Challenge Certificate to add to her Junior Warrant and her existing RCC.'),
    block('Bella was in the most wonderful condition and clearly loved every minute of her time in the ring. She moved like a dream and the judge\'s comments — "an outstanding example of a working-type bitch with excellent construction and a temperament to match" — made all the early mornings and late nights feel very worthwhile.'),
    heading('A Team Effort', 'h2'),
    block('Days like this are only possible with the support of an incredible team. Huge thanks to our handler Jenny for showing Bella to perfection, to all the friends who came along to cheer us on, and most of all to the wonderful families of all Bella\'s previous puppies who have cheered from afar. This one is for all of you.'),
    block('We will be celebrating for quite some time. Champagne, anyone? 🥂'),
  ],
})

// ── 5. Pages ──────────────────────────────────────────────────────────────────
console.log('\n📄  Pages')

await upsert({
  _id: 'page-home',
  _type: 'page',
  title: 'Home',
  slug: { _type: 'slug', current: 'home' },
  isHomepage: true,
  heroTitle: 'Welcome to Stonebrook Labradors',
  heroSubtitle: 'Quality Labradors bred for health, temperament and type — raised in our family home in the heart of Leicestershire.',
  content: [
    {
      _type: 'richText',
      _key: 'block-intro',
      alignment: 'center',
      heading: 'About Stonebrook Labradors',
      body: [
        block('We are a small, dedicated kennel with a passion for breeding Labradors of outstanding quality. All our dogs are fully health tested, KC registered and Assured Breeder Scheme members. Our puppies are raised in our family home and socialised from birth.'),
      ],
    },
    {
      _type: 'featuredDogs',
      _key: 'block-dogs',
      heading: 'Meet Our Dogs',
      dogs: [
        { _type: 'reference', _ref: 'dog-bella', _key: 'ref-bella' },
        { _type: 'reference', _ref: 'dog-max', _key: 'ref-max' },
        { _type: 'reference', _ref: 'dog-luna', _key: 'ref-luna' },
      ],
    },
    {
      _type: 'featuredLitters',
      _key: 'block-litters',
      heading: 'Current & Recent Litters',
      litters: [
        { _type: 'reference', _ref: 'litter-autumn-2025', _key: 'ref-autumn-2025' },
        { _type: 'reference', _ref: 'litter-spring-2026', _key: 'ref-spring-2026' },
        { _type: 'reference', _ref: 'litter-spring-2024', _key: 'ref-spring-2024' },
      ],
    },
    {
      _type: 'latestNews',
      _key: 'block-news',
      heading: 'Latest News',
      count: 3,
    },
    {
      _type: 'callToAction',
      _key: 'block-cta',
      heading: 'Interested in a Puppy?',
      text: 'We take great care in placing our puppies. Get in touch to find out more about our current and planned litters, or to register your interest for the future.',
      buttonLabel: 'Get in Touch',
      buttonUrl: '/contact',
    },
  ],
  seo: {
    seoTitle: 'Stonebrook Labradors — Quality Labrador Breeders in Leicestershire',
    seoDescription: 'Stonebrook Labradors breeds quality, health-tested Labradors in Leicestershire. KC Assured Breeder. Puppies occasionally available.',
  },
})

await upsert({
  _id: 'page-about',
  _type: 'page',
  title: 'About Us',
  slug: { _type: 'slug', current: 'about' },
  heroTitle: 'About Stonebrook Labradors',
  heroSubtitle: 'Two decades of dedicated Labrador breeding in the heart of Leicestershire.',
  content: [
    {
      _type: 'richText',
      _key: 'block-about',
      heading: 'Our Story',
      body: [
        block('Stonebrook Labradors was founded by Sarah and James Hartley in 2003 with the acquisition of our first bitch, a yellow Labrador called Honey. Over twenty years later, the kennel has grown — slowly and deliberately — to become one of the most respected small working/show dual-purpose Labrador kennels in the East Midlands.'),
        block('We have never bred for quantity. Our aim has always been to produce a small number of exceptional puppies each year, placing each one with the utmost care into a home that is right for that individual dog. We remain in contact with all our puppy families and offer lifetime support to every home.'),
        heading('Health First, Always', 'h3'),
        block('We are firm believers that responsible breeding starts with comprehensive health testing. All our breeding stock is tested to and beyond Kennel Club Assured Breeder Scheme requirements before any mating takes place. We test for: Hip Dysplasia (BVA Hip Scoring), Elbow Dysplasia (BVA Elbow Scoring), Hereditary Cataract (annual BVA Eye Testing), PRA DNA Test, Exercise Induced Collapse (EIC) and Centronuclear Myopathy (CNM).'),
        block('We are fully transparent about our health results and are always happy to share original certificates with prospective puppy buyers.'),
        heading('Kennel Club Assured Breeder', 'h3'),
        block('We have been Kennel Club Assured Breeders since 2008. The KC ABS holds us to the highest standards of care, health testing and responsible breeding. All our puppies are registered with the Kennel Club.'),
      ],
    },
    {
      _type: 'callToAction',
      _key: 'block-cta',
      heading: 'Come and Meet the Dogs',
      text: 'We are always delighted to welcome visitors to meet our dogs. Please get in touch to arrange a visit.',
      buttonLabel: 'Contact Us',
      buttonUrl: '/contact',
    },
  ],
  seo: {
    seoTitle: 'About Us — Stonebrook Labradors',
    seoDescription: 'Learn about Stonebrook Labradors — our history, our breeding philosophy, and our commitment to health testing and responsible breeding.',
  },
})

await upsert({
  _id: 'page-contact',
  _type: 'page',
  title: 'Contact Us',
  slug: { _type: 'slug', current: 'contact' },
  heroTitle: 'Get in Touch',
  heroSubtitle: 'We love hearing from fellow Labrador enthusiasts. Whether you have a question about our dogs or want to register interest in a puppy, we would love to hear from you.',
  content: [
    {
      _type: 'twoColumnText',
      _key: 'block-contact-info',
      leftContent: [
        { ...heading('Contact Details', 'h3'), _key: Math.random().toString(36).slice(2) },
        block('📍  Stonebrook Farm, Little Oakham, Leicestershire, LE12 4AB'),
        block('📞  07700 900 123'),
        block('✉️   hello@stonebrooklabradors.co.uk'),
        { ...heading('Visiting Us', 'h3'), _key: Math.random().toString(36).slice(2) },
        block('We welcome visitors who would like to meet our dogs. Please contact us in advance to arrange a suitable time. We ask that visitors have not recently been in contact with dogs from other breeders, to help protect the health of our dogs and puppies.'),
      ],
      rightContent: [
        { ...heading('Puppy Enquiries', 'h3'), _key: Math.random().toString(36).slice(2) },
        block('We do not take deposits until puppies are born and allocated. If you are interested in a puppy, please use the contact form to introduce yourself and tell us about your home and experience with dogs.'),
        block('We prioritise experienced Labrador owners, families with outdoor lifestyles, and those who can commit to the exercise and mental stimulation this wonderful breed requires.'),
        { ...heading('Follow Us', 'h3'), _key: Math.random().toString(36).slice(2) },
        block('You can follow our dogs and puppies on Facebook and Instagram — links in the footer. We share regular updates, show news and puppy photos.'),
      ],
    },
    {
      _type: 'contactForm',
      _key: 'block-form',
      heading: 'Send Us a Message',
      introText: 'Fill in the form below and we will get back to you as soon as we can — usually within 48 hours.',
    },
  ],
  seo: {
    seoTitle: 'Contact Us — Stonebrook Labradors',
    seoDescription: 'Get in touch with Stonebrook Labradors. Register your interest in a puppy, or ask us anything about our dogs and breeding programme.',
  },
})

// ── Done ──────────────────────────────────────────────────────────────────────
console.log('\n✅  Seeding complete!\n')
console.log('    Open the Studio at http://localhost:3000/studio to review the content.')
console.log('    Remember to add photos to each dog, litter and news post.\n')
