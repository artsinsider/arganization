import { LOAD_ALL_ORG_STATES } from '../constants/actionTypes'
import { Record } from 'immutable'
import { arrayToMap } from '../utils'

const OrgStateModel = Record({
  kod: null,
  nazvanie: null
})

const initialState = Record({
  entities: arrayToMap('kod', [], OrgStateModel)
})

export default (orgStates = new initialState(), action) => {
    const { type, response } = action

    switch (type) {

      case LOAD_ALL_ORG_STATES + '_SUCCESS':
        return orgStates.set('entities', arrayToMap('kod', response, OrgStateModel))

      default:
        return orgStates
    }
}
