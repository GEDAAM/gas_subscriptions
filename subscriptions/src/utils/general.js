export function fieldReplacer(dataObj, text) {
  return Object.entries(dataObj).reduce(
    (replacedText, [key, value]) => replacedText.replace(new RegExp(`{{${key}}}`, 'g'), value),
    text
  )
}
