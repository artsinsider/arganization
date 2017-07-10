import { START, SUCCESS, FAIL } from '../constants/actionTypes'
import $ from 'jquery'

export default store => next => action => {
    const { $api, payload, type, ...rest } = action

    if (!$api) return next(action)

    next({...rest, type: type + START})

    $.ajax($api)
    .done(response => next({...rest, response, payload, type: type + SUCCESS}))
    .fail(error => next({...rest,  error, payload, type: type + FAIL}))
}
