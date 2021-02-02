import updaterSetup from './update_group_opt/_startup'

export default function setup() {
  PropertiesService.getDocumentProperties().deleteAllProperties()
  updaterSetup()
}
