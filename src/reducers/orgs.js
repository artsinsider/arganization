import {
  LOAD_ALL_ORGS,
  GET_ORGS_BY_STATUS,
  SELECT_ORG,
  SELECT_ALL_ORGS_ON_PAGE,
  CREATE_ORG,
  UPDATE_ORG,
  CHANGE_ORG_STATUS,
  SEARCH_ORG_BY_NAME,
  LOAD_ORG_CARD,
  CLOSE_ORG_CARD,
  FILTER,
  DOWNLOAD_ORGS_REPORT,
  START, SUCCESS, FAIL,
  RESET_ALL_ORGS_ON_PAGE,
  CHANGE_ALL_SELECTED_ORG_STATUSES,
    DELETE_DOCUMENT
 } from '../constants/actionTypes'
import { Record, List } from 'immutable'
import fileDownload from 'react-file-download'
import { arrayToMap } from '../utils'
import { notification } from 'antd'

notification.config({ duration: 7 })

const OrgModel = Record({
  kod: null,
  nazvanie: null,
  inn: null,
  adres_pochtoviy: null,
  telefon: null,
  email: null,
  web_sait: null,
  primechanie: null,
  opf: null,
  documenti: null,
  status: null,
  ogrn: null
})

const initialState = Record({
  entities: arrayToMap('kod', [], OrgModel),
  loading: false,
  selected: new List(),
  statusId: 2,
  loadedCardId: null,
  selectDisabled: false,
  editDisabled: false,
  pageSize: 100,
  term: null,
  reportLoading: false,
  delete: null
})

export default (orgs = new initialState(), action) => {
    const { type, payload, response } = action
    switch (type) {

      case LOAD_ALL_ORGS + START:
        return orgs.set('loading', true)

      case LOAD_ALL_ORGS + SUCCESS:
        return orgs
              .set('entities', arrayToMap('kod', response, OrgModel))
              .set('loading', false)

      case LOAD_ALL_ORGS + FAIL:
        return orgs.set('loading', false)

      case GET_ORGS_BY_STATUS:
        return orgs
                .set('statusId', payload.statusId)
                .set('selectDisabled', (payload.statusId === 4))
                .set('editDisabled', (payload.statusId === 4))
                .set('loadedCardId', null)
                .updateIn(['selected'], arr => arr.clear())

      case SELECT_ORG:
        return orgs.updateIn(['selected'], arr => {
          const index = arr.indexOf(payload.id)
          return (index < 0) ? arr.concat(payload.id) : arr.delete(index)
        })

      case SELECT_ALL_ORGS_ON_PAGE:
        const { selected, entities } = payload
        return orgs.updateIn(['selected'], arr => selected ? arr.concat(entities) : arr.filter(item => entities.indexOf(item) === -1))

      case CHANGE_ORG_STATUS:
        return orgs.setIn(['entities', payload.id, 'status'], { kod: payload.statusId, nazvanie: null })
                   .updateIn(['selected'], selected => selected.delete(selected.indexOf(payload.id)))

      case CREATE_ORG + SUCCESS:
      case UPDATE_ORG + SUCCESS:
        return orgs.setIn(['entities', response.kod], new OrgModel(response))

      case LOAD_ORG_CARD:
        return orgs.set('loadedCardId', payload.id)

      case CLOSE_ORG_CARD:
        return orgs.set('loadedCardId', null)

      case SEARCH_ORG_BY_NAME:
        return orgs.set('term', payload.term)

      case FILTER:
        return orgs.set('loadedCardId', null)

      case RESET_ALL_ORGS_ON_PAGE:
        return orgs.updateIn(['selected'], arr => arr.clear())

      case CHANGE_ALL_SELECTED_ORG_STATUSES:
        let temp = orgs
        for (let i = 0; i < payload.idArr.length; i++) {
          temp = temp.updateIn(['entities', payload.idArr[i], 'status'], obj => {
            return { kod: payload.statusId, nazvanie: null }
          })
        }
        return temp

      case DOWNLOAD_ORGS_REPORT + START:
        return orgs.set('reportLoading', true)

      case DOWNLOAD_ORGS_REPORT + SUCCESS:
        const { format, docType } = payload
        const ext = format === 'word' ? '.doc' : '.xls'
        fileDownload(response, docType + Date.now() + ext)
        return orgs.set('reportLoading', false)

      case DOWNLOAD_ORGS_REPORT + FAIL:
        notification.error({
          message: `Ошибка формирования отчета!`,
          description: `Action: ${type}`
        })
        return orgs.set('reportLoading', false)

        case DELETE_DOCUMENT + SUCCESS:
            notification.info({
                message: `Документ ${payload.data.nazvanie} удален`,
                description: `Операция удаления прошла успешно`
            })
            return orgs.updateIn(['entities', payload.orgId, 'documenti'], item => {
                return item.filter(i => i.kod !==  payload.data.kod);
            })

      default:
        return orgs
    }
}
