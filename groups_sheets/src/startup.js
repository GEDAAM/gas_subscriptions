function updaterSetup() {
  const docProperties = PropertiesService.getDocumentProperties()
  docProperties.setProperties(
    {
      // here goes the private URL
      DB_URL: 'https://script.google.com/macros/s/AKfycbzZ2QUTFksLhdx1p7s4DkoxbeL8o6qNHFh7G6EY/exec'
    },
    false
  )
}

export default function setup() {
  PropertiesService.getDocumentProperties().deleteAllProperties()
  updaterSetup()
}
