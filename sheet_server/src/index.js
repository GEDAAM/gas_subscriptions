import handleRequest from './requests'
import postWithFormSheet from './requests/post'
import getWithGroupsSheet from './requests/get'
import mockRequest from './requests/mock'

/**
 * @OnlyCurrentDoc
 */

function doGet(e) {
  return handleRequest(e, 'Turmas', getWithGroupsSheet)
}

function doPost(e) {
  return handleRequest(e, 'Form', postWithFormSheet)
}

global.doPost = doPost
global.doGet = doGet

global.mockPost = mockRequest
