export const Statuses = {
  OPT1: 'OPT1', // was selected to option 1
  OPT2: 'OPT2', // was selected to option 2
  REMAINDER: 'REMAINDER', // is on the queue
  MOVED: 'MOVED', // was manually added to a group
  REMOVED: 'REMOVED', // was manually removed from a group
  EMPTY: 'EMPTY' // did not select a group
}

export const ValidStatuses = {
  OPT1: 'OPT1', // was selected to option 1
  OPT2: 'OPT2', // was selected to option 2
  MOVED: 'MOVED' // was manually added to a group
}
export function prepareUsersList(usersMap) {
  const usersList = [...usersMap]
  const preparedUsersList = usersList
    .sort(([, { timestamp: a }], [, { timestamp: b }]) => new Date(a) - new Date(b))
    .map(([, user], index) => {
      if (!user.register) return

      user.order = index * (1 / user.multiplier)
      user.selectedGroup = user.selectedGroup.map(g => String(g))

      return user
    })
    .filter(user => user)

  return preparedUsersList
}
export function getSortedUsersList(sortableUsersList) {
  sortableUsersList.sort((userA, userB) => userA.order - userB.order)

  // [uid, [opt1Id, opt2Id?], status?, finalGroup?]
  const sortedUsers = sortableUsersList.map(({ register, selectedGroup, status, finalGroup }) => [
    register,
    selectedGroup,
    status,
    finalGroup
  ])

  return sortedUsers
}

export function updateUsers(usersList, newData, newHeaders) {
  return usersList.map((user, i) => {
    newData[i].forEach((datum, j) => {
      user[newHeaders[j]] = datum
    })

    return user
  })
}
