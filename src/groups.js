export class Group {
  constructor({ vacancies, selected, openVacancies, ...rest }) {
    this.vacancies = +vacancies
    this._openVacancies = openVacancies === 0 ? 0 : +openVacancies || +vacancies
    this._length = selected.length
    delete rest['length']

    this.selected = new Proxy(selected, {
      set: function (_target, property, value) {
        if (+property >= this.vacancies) return false

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

export function getGroups(groupsMatrix) {
  const [header, ...data] = groupsMatrix
  const groups = {}

  data.forEach(row => {
    const group = row.reduce((rowObj, col, i) => {
      const h = header[i].trim().replace('\n', '')
      if (h && col) rowObj[h] = col.trim ? col.trim() : col
      return rowObj
    }, {})

    if (group.id === 'remainder') return
    groups[group.id] = new Group(group)
  })

  groups['remainder'] = {
    selected: [],
    vacancies: Infinity,
    openVacancies: 0
  }
  return groups
}
