// HTTP requests
/**
 *
 * @param {string} reqUrl Url of the request
 * @param {object} params GAS UrlFetchApp parameters
 */
export function fetch(reqUrl, params) {
  return new Promise((resolve, reject) => {
    const res = UrlFetchApp.fetch(reqUrl, Object.assign({ muteHttpExceptions: true }, params))
    if (res.getResponseCode() >= 200 && res.getResponseCode() < 300) {
      resolve(JSON.parse(res))
    } else {
      reject(JSON.parse(res))
    }
  })
}
