import { TOGGLE_MODAL, LOADING_MODAL } from '../constants/actionTypes';

const initialState = {
    visible: false,
    message: 'Удалить выбранные организации?',
    confirmLoading: false,
    title: 'Удаление'
}


export default (modal = initialState, action) => {
    const { type, payload } = action

    switch(type) {
        case TOGGLE_MODAL:
        case LOADING_MODAL: 
            return {
                ...modal,
                ...payload
            }
        default: 
            return modal
    }
}