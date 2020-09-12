// Will mutate groups' inner objects
export default function distributeGroups(optionsList, groups) {
  const { remainder } = groups
  return optionsList.map(([uid, [opt1Id, opt2Id]]) => {
    if (!opt1Id) return ['EMPTY', null]

    const opt1 = groups[opt1Id]
    if (opt1.hasVacancy) {
      opt1.selected.push(uid)
      return ['OPT1', opt1Id]
    }

    if (opt2Id) {
      const opt2 = groups[opt2Id]
      if (opt2.hasVacancy) {
        opt2.selected.push(uid)
        return ['OPT2', opt2Id]
      }
    }

    remainder.selected.push(uid)
    return ['REMAINDER', opt1Id]
  })
}
