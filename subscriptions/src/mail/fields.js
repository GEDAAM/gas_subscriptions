import { fieldReplacer } from '../utils/general'

export function getMailFieldsReplacer(mailFields) {
  return replacer =>
    Object.entries(mailFields).reduce((newObj, [key, value]) => {
      newObj[key] = fieldReplacer(replacer, value)
      return newObj
    }, {})
}

export default class MailField {
  constructor(subject, title, body, intro, teaser, description) {
    if (!subject || !title || !body) {
      throw new TypeError('All emails must have a subject, a title and a body')
    }
    this.subject = subject
    this.title = title
    this.body = body
    this.intro = intro || 'Olá {{name}}, tudo bem? Tomara!'
    this.teaser = teaser || ''
    this.description = description || ''
  }

  get preview() {
    return `${this.intro} ${this.teaser}`
  }

  get year() {
    return new Date().getFullYear().toString()
  }
}
