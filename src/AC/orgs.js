import {
  LOAD_ALL_ORGS,
  GET_ORGS_BY_STATUS,
  SELECT_ORG,
  SELECT_ALL_ORGS_ON_PAGE,
  CHANGE_ORG_STATUS,
  SEARCH_ORG_BY_NAME,
  CREATE_ORG,
  UPDATE_ORG,
  LOAD_ORG_CARD,
  CLOSE_ORG_CARD,
  DOWNLOAD_ORGS_REPORT,
  RESET_ALL_ORGS_ON_PAGE,
  CHANGE_ALL_SELECTED_ORG_STATUSES,
  LOAD_ALL_ORG_STATES,
  DELETE_DOCUMENT
} from '../constants/actionTypes'
import { ORG_API_URL } from '../constants/api'

export function loadAllOrgs() {
    return {
        type: LOAD_ALL_ORGS,
        $api: {
          url: `${ORG_API_URL}/organizacii/zapros`
        }
    }
}

export function getOrgsByStatus(statusId) {
    return {
        type: GET_ORGS_BY_STATUS,
        payload: { statusId }
    }
}

export function selectOrg(id) {
    return {
        type: SELECT_ORG,
        payload: { id }
    }
}

export function selectAllOrgsOnPage(entities, selected) {
    return {
        type: SELECT_ALL_ORGS_ON_PAGE,
        payload: { entities, selected }
    }
}

export function changeOrgStatus(id, statusId) {
    return {
        type: CHANGE_ORG_STATUS,
        payload: { id, statusId }
    }
}

export function createOrg(formdata) {
    return {
        type: CREATE_ORG,
        $api: {
          url: `${ORG_API_URL}/organizacii/novoe`,
          type: 'POST',
          data: formdata,
          processData: false,
          contentType: false
        }
    }
}

export function updateOrg(formdata) {
    return {
        type: UPDATE_ORG,
        $api: {
          url: `${ORG_API_URL}/organizacii/redaktor`,
          type: 'POST',
          data: formdata,
          processData: false,
          contentType: false
        }
    }
}

export function loadOrgCard(id) {
  return {
      type: LOAD_ORG_CARD,
      payload: { id }
  }
}

export function closeOrgCard() {
  return {
      type: CLOSE_ORG_CARD
  }
}

export function searchOrgByName(term) {
  return {
      type: SEARCH_ORG_BY_NAME,
      payload: { term }
  }
}

export function resetAllSelectedOrg() {
    return {
        type: RESET_ALL_ORGS_ON_PAGE
    }
}

export function changeAllSelectedOrgStatuses(idArr, statusId) {
  return {
    type: CHANGE_ALL_SELECTED_ORG_STATUSES,
    payload: { idArr, statusId }
  }
}

export function loadAllOrgStates() {
  return {
    type: LOAD_ALL_ORG_STATES,
    $api: {
      url: `${ORG_API_URL}/status/zapros`
    }
  }
}


/*
docType:
Отчет по списку всем организациям - ORGANIZATION_LIST
Список материалов на исключение - EXCEPT_MATERIALS
Список материалов на добавление - INCLUSION_MATERIALS
Список оборудования на включение - INCLUSION_EQUIPMENT
Список оборудования на исключение - EXCEPT_EQUIPMENT
*/
export const downloadOrgsReport = (data, format, docType) => ({
  type: DOWNLOAD_ORGS_REPORT,
  payload: { format, docType },
  $api: {
    url: ORG_API_URL + `/organizacii/otchet?format=${format}&doc_type=${docType}`,
    xhrFields: {
      responseType : 'blob'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    type: 'POST',
    data: JSON.stringify(data)
  }
})

export const deleteDocument = (data, orgId) => ({
    type: DELETE_DOCUMENT,
    $api: {
        url: `${ORG_API_URL}/dokumenty/udalenie`,
        type: 'POST',
        data: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    },
    payload: {data, orgId}
})
