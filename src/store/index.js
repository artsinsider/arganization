import { createStore, applyMiddleware, compose } from 'redux'
import reducers from '../reducers'
import api from '../middlewares/api'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // TODO: убрать в продакшене

const enhancer = applyMiddleware(api)
const store = createStore(reducers, {}, composeEnhancers(enhancer))

export default store
