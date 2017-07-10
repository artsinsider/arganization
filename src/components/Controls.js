import React, { Component } from 'react'
import { connect } from 'react-redux'
import OrgForm from './OrgForm'
import { changeOrgStatus, downloadOrgsReport, resetAllSelectedOrg, changeAllSelectedOrgStatuses } from '../AC/orgs'
import { toggleModal, loadingModal } from '../AC/modal'
import { Button, Menu, Dropdown, Icon } from 'antd'
import Modal from './Modal'
import GlobalFilter from './GlobalFilter'
import ButtonDelete from './ButtonDelete'
import ButtonFileExclude from './ButtonFileExclude'
import ButtonMove from './ButtonMove'
import ButtonBack from './ButtonBack'
import $ from 'jquery'

class Controls extends Component {
  state = {
    reportLoading: false
  }

  render() {
    const { statusId } = this.props
    return (
      <div className="service-controls">
        <Modal />
        <GlobalFilter />
        { statusId !== 4 ? this.renderCreateButton() : null}
        { statusId !== 4 ? this.renderDeleteButton() : null }
        { statusId === 1 ? this.renderMoveButton() : null }
        { statusId === 3 ? this.renderBackButton() : null }
        { statusId === 2 ? this.renderExcludeButton() : null }
        { statusId !== 4 ? this.renderFileButton() : null }
      </div>
    )
  }

  confirm = props => ev => Modal.confirm(props)

  renderCreateButton() {
    return <OrgForm btnText="Создать" btnType="primary" btnIcon="addfile" btnDisabled={this.props.editDisabled}  />
  }

  renderDeleteButton() {
    const { changeStatus } = this
    return (
        <ButtonDelete
          emptySelected={this.props.emptySelected}
          onDelete={this.handleDelete}
          toggleModal={this.props.toggleModal}
          resetAllSelectedOrg={this.props.resetAllSelectedOrg}
          changeAllSelectedOrgStatuses={this.props.resetAllSelectedOrg}
          orgs={this.props.orgs}
          selected={this.props.selected}
        />
    )
  }

  renderExcludeButton() {
    const { changeStatus } = this
    const confirm = {
      title: 'На исключение',
      content: 'Перенести выбранные организации в список на исключение?',
      okText: 'Да',
      cancelText: 'Отмена',
      onOk() { changeStatus(3) }
    }
    return <ButtonFileExclude
      emptySelected={this.props.emptySelected}
      resetAllSelectedOrg={this.props.resetAllSelectedOrg}
      changeAllSelectedOrgStatuses={this.props.changeAllSelectedOrgStatuses}
      selected={this.props.selected}
      orgs={this.props.orgs}
      />
  }

  renderBackButton() {
    const { changeStatus } = this
    const confirm = {
      title: 'Вернуть в справочник',
      content: 'Вернуть выбранные организации в рабочий раздел?',
      okText: 'Да',
      cancelText: 'Отмена',
      onOk() { changeStatus(2) }
    }
    return <ButtonBack
      emptySelected={this.props.emptySelected}
      resetAllSelectedOrg={this.props.resetAllSelectedOrg}
      changeAllSelectedOrgStatuses={this.props.changeAllSelectedOrgStatuses}
      selected={this.props.selected}
      orgs={this.props.orgs}
    />
  }

  renderMoveButton() {
    const { changeStatus } = this
    const confirm = {
      title: 'Перенести в справочник',
      content: 'Перенести выбранные организации в рабочий раздел?',
      okText: 'Да',
      cancelText: 'Отмена',
      onOk() { changeStatus(2) }
    }
    return <ButtonMove
      emptySelected={this.props.emptySelected}
      resetAllSelectedOrg={this.props.resetAllSelectedOrg}
      changeAllSelectedOrgStatuses={this.props.changeAllSelectedOrgStatuses}
      selected={this.props.selected}
      orgs={this.props.orgs}
      />
  }

  renderFileButton() {
    const { reportLoading } = this.props
    const menu = (
      <Menu onClick={this.downloadOrgsReport}>
        <Menu.Item key="word"><Icon type="file-word" /> Word</Menu.Item>
        <Menu.Item key="excel"><Icon type="file-excel" /> Excel</Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu}>
        <Button loading={reportLoading} className="service-btn"  type="dashed">
          Сформировать протокол {!reportLoading ? <Icon type="down" /> : ''}
        </Button>
      </Dropdown>
    )
  }

  handleCancel = e => this.setState({
    reportLoading: false,
    visible: false,
    message: 'Удалить выбранные организации?',
    confirmLoading: false
   })

  downloadOrgsReport = e => {

    this.setState({ reportLoading: true })
    const data = []
    const format = e.key.toLowerCase()
    let ext

    switch (format) {
      case 'word':
        ext = '.doc'
        break;
      case 'excel':
        ext = '.xls'
        break;
      default:
        ext = null
    }

    this.props.downloadOrgsReport(this.props.orgs, format, 'EXCEPT_MATERIALS')

  }
}

export default connect(state => {
  const { statusId, selected } = state.orgs
  const { visible } = state
  return {
    emptySelected: !selected.size,
    orgs: state.orgs.get('entities')
      .sortBy((item) => -item.get('kod')).toArray()
      .map(org => org.toObject())
      .filter(org => org.status.kod === state.orgs.statusId),
    selected: selected.toArray(),
    statusId: statusId,
    editDisabled: (statusId === 3),
    reportLoading: state.orgs.reportLoading
  }
}, {
  toggleModal,
  changeOrgStatus,
  downloadOrgsReport,
  loadingModal,
  resetAllSelectedOrg,
  changeAllSelectedOrgStatuses
})(Controls)
