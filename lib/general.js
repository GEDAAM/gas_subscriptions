import { reduce } from 'lodash'

export function fieldReplacer(dataObj, text) {
  return reduce(
    dataObj,
    (replacedText, value, key) => replacedText.replace(new RegExp(`{{${key}}}`, 'g'), value),
    text
  )
}

export function isNullish(x) {
  return x === null || x === undefined
}

export function getIdFromUrl(url) {
  return url.match(/[-\w]{25,}/)[0]
}
