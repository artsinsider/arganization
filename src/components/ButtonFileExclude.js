import React, { Component } from 'react'
import { Button, Modal, notification } from 'antd'
import $ from 'jquery'

import { ORG_API_URL } from '../constants/api'

export default class ButtonFileExclude extends Component {

    state = {
        visible: false,
        confirmLoding: false,
        message: ''
    }

    render() {
        const modalProps = {
            title: 'На исключение',
            visible: this.state.visible,
            onOk: this.onOk,
            confirmLoading: this.state.confirmLoading,
            onCancel: e => this.closeModal(),
            //okText: this.state.okText
        }
        return (
            <span className="service-btn">
                <Button icon="arrow-right" disabled={this.props.emptySelected} onClick={this.toggleModal} type="primary">На исключение</Button>
                <Modal { ...modalProps }>
                    <p>{this.state.message}</p>
                </Modal>
            </span>
        )
    }

    closeModal = e => this.setState({ visible: false })

    toggleModal = e => this.setState({ visible: true, message: 'Добавить выбранное в исключение?' })

    onOk = e => this.setState({ confirmLoading: true }, e => {
        if (!this.props.selected.length) this.setState({ visible: false, confirmLoading: false })
        else this.changeStatus(3)
    })

    changeStatus = (statusId) => {
        const idSelectedArr = this.props.selected
        let objectsSelected = []
        let lengthOfIdArr = idSelectedArr.length
        let counterDoneAjax = 0
    // цикл немного непроизводительный, т.к. если найдет объект с нужны кодом, то будет продолжать искать с этим кодом следующие объекты.
    // нужно заменить внутренний цикл на while или написать continue в нем, т.к. в цикле for нельзя менять значение length динамически
        for (let i = 0; i < this.props.orgs.length; i++) {
            for (let j = 0; j < lengthOfIdArr; j++) {
                if (idSelectedArr[j] === this.props.orgs[i].kod) {
                    objectsSelected.push(this.props.orgs[i]) 
                    objectsSelected[i].status.kod = statusId
                    objectsSelected[i].status.nazvanie = 'На удаление'

                    const form = document.createElement('form')
                    form.enctype = 'multipart/form-data'
                    form.action = ''
                    const formdata = new FormData(form)
                    formdata.append('data', JSON.stringify(objectsSelected[i]))

                    $.ajax({
                        url: `${ORG_API_URL}/organizacii/redaktor`,
                        type: 'POST',
                        data: formdata,
                        processData: false,
                        contentType: false
                    })
                    .done(response => {
                        counterDoneAjax++
                        // проверяем последний ли ajax
                        if (counterDoneAjax === lengthOfIdArr) {
                            this.setState({
                                visible: false,
                                confirmLoading: false
                            })
                            this.props.changeAllSelectedOrgStatuses(idSelectedArr, statusId)
                            this.props.resetAllSelectedOrg()
                        }
                    })
                    .fail(error => {
                        this.setState({
                            confirmLoading: false,
                            visible: false,
                            message: ''
                        })
                        this.props.resetAllSelectedOrg()
                        notification.error({message: `Ошибка!`, description: `Error: ${error.status} ${error.statusText}`})
                    })
                }
            }
        }
    }
}
