import { Config as MainConfig } from '../config'

export const Config = {
  TEST: MainConfig.TEST,
  SHOULD_SEND_EMAIL: false,
  MAX_RUNNING_TIME: 5 * 60 * 1000, // in milliseconds
  BACKUP_CERTIFICATES: true
}
