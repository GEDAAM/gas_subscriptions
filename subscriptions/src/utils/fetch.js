// HTTP requests
export function fetch(reqUrl, params) {
  return new Promise((resolve, reject) => {
    const res = UrlFetchApp.fetch(reqUrl, { ...params, muteHttpExceptions: true })
    if (res.getResponseCode() >= 200 && res.getResponseCode() < 300) {
      resolve(JSON.parse(res))
    } else {
      reject(JSON.parse(res))
    }
  })
}
