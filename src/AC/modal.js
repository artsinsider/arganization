import { TOGGLE_MODAL, LOADING_MODAL } from '../constants/actionTypes'

export function toggleModal(visible, message, confirmLoading, title) {

    return {
        type: TOGGLE_MODAL,
        payload: { visible, message, title }
    }
}

export function loadingModal(confirmLoading) {
    return {
        type: LOADING_MODAL,
        payload: { confirmLoading }
    }
}