import { getSheetAsMatrix, parseMatrixAsObject } from '../../../lib/parseSsData'
import { getMembersNameReg } from './memberCRUD'

function getGroups(ss) {
  const [groupsMatrix] = getSheetAsMatrix('Turmas', ss)
  const [groups] = parseMatrixAsObject(groupsMatrix)
  return groups
}

export const GetOperations = {
  groups: getGroups,
  nameregs: getMembersNameReg
}
