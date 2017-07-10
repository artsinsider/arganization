import { Map, fromJS } from 'immutable'

/*
Преобразование массива в иммутабельную мапу
*/
export const arrayToMap = (primaryKey, arr, Model) =>
  arr.reduce((acc, el) =>
    acc.set(el[primaryKey], Model ? new Model(el) : fromJS(el)), new Map({}))
