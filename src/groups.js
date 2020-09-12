import { mapMatrixWithHeader, parseRowWithHeaderProps } from './utils'

export class Group {
  constructor({ vacancies, selected, openVacancies, ...rest }) {
    this.vacancies = +vacancies
    this._openVacancies = +openVacancies || +vacancies
    this._length = selected.length
    delete rest['length']

    this.selected = new Proxy(selected, {
      set: function (_target, property, value) {
        if (+property >= this.vacancies) {
          throw new TypeError('You cannot set more students than there are vacancies')
        }

        if (property === 'length') {
          this._length = value
          this._openVacancies = this.vacancies - value
        }

        return Reflect.set(...arguments)
      }.bind(this)
    })

    Object.assign(this, rest)
  }

  get openVacancies() {
    return this._openVacancies
  }

  get hasVacancy() {
    return this.openVacancies > 0
  }

  get length() {
    return this._length
  }
}

export const Modes = {
  CLEAN: 'CLEAN',
  RETAINING: 'RETAINING'
}

export function getGroups(groupsMatrix, mode = Modes.CLEAN) {
  const groups = {}

  mapMatrixWithHeader(groupsMatrix, (row, header) => {
    const group = parseRowWithHeaderProps(row, header)
    if (mode === Modes.CLEAN) {
      group.selected = []
      delete group.openVacancies
    }

    group.id = String(group.id)
    groups[group.id] = new Group(group)
  })

  if (mode === Modes.CLEAN) {
    groups['remainder'] = new Group({
      selected: [],
      vacancies: Infinity
    })
  }

  return groups
}
