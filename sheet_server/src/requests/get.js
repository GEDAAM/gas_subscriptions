import { parseMatrixAsObject } from '../../../lib/parseSsData'

export default function getWithGroupsSheet(_event, sheet) {
  const data = sheet.getDataRange().getValues()
  const [groups] = parseMatrixAsObject(data)

  return { groups }
}
