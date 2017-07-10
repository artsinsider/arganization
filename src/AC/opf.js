import { LOAD_ALL_OPF, CREATE_OPF } from '../constants/actionTypes'
import { ORG_API_URL } from '../constants/api'

export function loadAllOpf() {
    return {
        type: LOAD_ALL_OPF,
        $api: {
          url: `${ORG_API_URL}/opf/zapros`
        }
    }
}

export function createOpf(name) {
  return {
    type: CREATE_OPF,
    $api: {
      url: `${ORG_API_URL}/opf/novoe`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        nazvanie: name,
        kod: null
      })
    }
  }
}
