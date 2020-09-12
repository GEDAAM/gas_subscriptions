export function prepareUsersList(usersMap) {
  const usersList = [...usersMap]
  const preparedUsersList = usersList
    .map(([, user], index) => {
      if (!user.register) return

      const order = index * (1 / user.multiplier)
      user.order = order
      user.selectedGroup = user.selectedGroup.map(g => String(g))

      return user
    })
    .filter(user => user)

  return preparedUsersList
}
export function getSortedUsersList(sortableUsersList) {
  sortableUsersList.sort((userA, userB) => userA.order - userB.order)

  // [uid, [opt1Id, opt2Id?]]
  const sortedUsers = sortableUsersList.map(({ register, selectedGroup }) => [
    register,
    selectedGroup.map(g => String(g))
  ])

  return sortedUsers
}

export function updateUsers(usersList, newData, newHeaders) {
  return usersList.map((user, i) => {
    newData[i].forEach((datum, j) => {
      user[newHeaders[j]] = datum
    })
  })
}
