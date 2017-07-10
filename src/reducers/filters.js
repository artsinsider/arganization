import { FILTER } from '../constants/actionTypes'

export default (filters = { term: '', field: 'inn' }, action) => {
    const { type, payload } = action

    switch (type) {

      case FILTER:
        return {
          ...filters,
          term: payload.term,
          field: payload.field
        }

      default:
        return filters
    }
}
