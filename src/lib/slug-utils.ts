/** @format */

import { transliterate as tr, slugify, transliterate } from 'transliteration'

export const slugifyName = (name: string) => {
  const tr = transliterate(name)
  return slugify(tr, {
    trim: true,
  })?.replace(/--+/g, '-')
}
