import updaterSetup from './updater/_startup'

export default function setup() {
  PropertiesService.getDocumentProperties().deleteAllProperties()
  updaterSetup()
}
