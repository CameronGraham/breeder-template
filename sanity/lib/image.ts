import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({ projectId, dataset })

export function urlForImage(source: SanityImageSource) {
  return imageBuilder.image(source).auto('format').fit('max')
}

export function urlForImageWithDimensions(
  source: SanityImageSource,
  width: number,
  height: number
) {
  return imageBuilder.image(source).width(width).height(height).auto('format').fit('crop').url()
}
