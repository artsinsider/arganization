import { combineReducers } from 'redux'
import orgs from './orgs'
import opf from './opf'
import filters from './filters'
import modal from './modal'
import orgStates from './orgStates'

export default combineReducers({ orgs, opf, filters, modal, orgStates })
