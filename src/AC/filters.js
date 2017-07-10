import { FILTER } from '../constants/actionTypes'

export function filter(term, field) {
    return {
        type: FILTER,
        payload: { term, field }
    }
}
