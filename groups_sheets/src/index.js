import setupGroupUi from './setup'
import myOnOpen from './ui/on_open'
import myOnEdit from './ui/on_edit'
import addGroupSheetTriggers from './triggers'
import showSubscriptionSidebar from './sidebar'
import setup from './startup'

/**
 * @OnlyCurrentDoc
 */

global.setupGroupUi = setupGroupUi
global.myOnOpen = myOnOpen
global.myOnEdit = myOnEdit

global.addGroupSheetTriggers = addGroupSheetTriggers
global.showSubscriptionSidebar = showSubscriptionSidebar

global.setup = setup
