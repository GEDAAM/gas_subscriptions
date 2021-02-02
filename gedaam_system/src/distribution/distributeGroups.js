import { Modes } from './groups'
import { Statuses } from './users'

// Will mutate groups' inner objects
export default function distributeGroups(optionsList, groups, mode) {
  return optionsList.map(([uid, [opt1Id, opt2Id], status, finalGroup]) => {
    if (mode !== Modes.CLEAN && status && status !== Statuses.REMAINDER) {
      return [status, finalGroup]
    }

    if (!opt1Id) return [Statuses.EMPTY, null]
    if (opt1Id in groups) {
      const opt1 = groups[opt1Id]
      if (opt1.hasVacancy) {
        opt1.selected.push(uid)
        return [Statuses.OPT1, opt1Id]
      }
    }

    if (opt2Id && opt2Id in groups) {
      const opt2 = groups[opt2Id]
      if (opt2.hasVacancy) {
        opt2.selected.push(uid)
        return [Statuses.OPT2, opt2Id]
      }
    }

    groups['remainder'].selected.push(uid)
    return [Statuses.REMAINDER, opt1Id]
  })
}
