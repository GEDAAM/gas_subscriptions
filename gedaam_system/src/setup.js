import updaterSetup from './update_group_opt/startup'

export default function setup() {
  PropertiesService.getDocumentProperties().deleteAllProperties()
  updaterSetup()
}
