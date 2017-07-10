import React, { Component } from 'react'
import { Modal as AntdModal } from 'antd'
import { loadingModal, toggleModal } from '../AC/modal'
import { connect } from 'react-redux'

class Modal extends Component {
    render() {
        const { changeStatus } = this.props
        const { title, visible, message, confirmLoading } = this.props
        const modalProps = {
            title: title,
            visible: visible,
            onOk: e => this.props.onDelete,
            confirmLoading: confirmLoading,
            onCancel: e => this.props.toggleModal(false)
        }
        return (
            <div>
                <AntdModal { ...modalProps }>
                <p>{ message }</p>
                </AntdModal>
            </div>
        )
    }
}

export default connect(state => {

    return {
        message: state.modal.message,
        confirmLoading: state.modal.confirmLoading,
        title: state.modal.title
    }
},
{ loadingModal, toggleModal })(Modal)
