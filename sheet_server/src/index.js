import handleRequest, { getWithSpreadsheet, postWithSpreadsheet } from './requests'
import mockRequest from './requests/mock'

function doGet(e) {
  return handleRequest(e, getWithSpreadsheet)
}

function doPost(e) {
  return handleRequest(e, postWithSpreadsheet)
}

global.doPost = doPost
global.doGet = doGet

global.mockPost = mockRequest
