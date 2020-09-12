export default function getSortedUsersList(usersMap) {
  const usersList = [...usersMap]
  const sortableUsersList = usersList.map(([, user], index) => {
    const order = index * (1 / user.multiplier)
    user.order = order
    return user
  })

  sortableUsersList.sort((userA, userB) => userA.order - userB.order)
  // [uid, [opt1Id, opt2Id?]]
  const sortedUsers = sortableUsersList.map(({ register, selectedGroup }) => [
    register,
    selectedGroup.map(g => String(g))
  ])

  return sortedUsers
}
