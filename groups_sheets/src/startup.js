function updaterSetup() {
  const docProperties = PropertiesService.getDocumentProperties()
  docProperties.setProperties(
    {
      DB_URL: '' // here goes the private URL
    },
    false
  )
}

export default function setup() {
  PropertiesService.getDocumentProperties().deleteAllProperties()
  updaterSetup()
}
