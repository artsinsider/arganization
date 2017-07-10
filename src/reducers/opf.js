import {
  LOAD_ALL_OPF,
  CREATE_OPF,
  START, SUCCESS, FAIL } from '../constants/actionTypes'
import { Record } from 'immutable'
import { arrayToMap } from '../utils'

const OpfModel = Record({
  kod: null,
  nazvanie: null
})

const initialState = Record({
  entities: arrayToMap('kod', [], OpfModel)
})

export default (opf = new initialState(), action) => {
    const { type, payload, response } = action

    switch (type) {

      case LOAD_ALL_OPF + SUCCESS:
        return opf.set('entities', arrayToMap('kod', response, OpfModel))

      case CREATE_OPF + SUCCESS:
        return opf.setIn(['entities', response.kod], new OpfModel(response))

      default:
        return opf
    }
}
