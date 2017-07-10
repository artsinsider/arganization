import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getOrgsByStatus } from '../AC/orgs'
import { Menu, Icon, Tree } from 'antd'

class LeftMenu extends Component {

  render() {
    return (
      <Menu style={{height: window.innerHeight - 122 }} mode="inline" selectedKeys={ [`${this.props.currentStateId}`] } onClick={this.handleClick}>
        {this.renderMenuItems()}
      </Menu>
    )
  }

  renderMenuItems = () => this.props.orgStates.map(state =>
    <Menu.Item key={state.kod}>
      <Icon type={this.getStateIcon(state.kod)} />
      {state.nazvanie} <sup>{this.getStateCount(state.kod)}</sup>
    </Menu.Item>
  )


  getStateIcon(stateId) {
    switch (stateId) {
      case 1: return 'arrow-right'
      case 2: return 'solution'
      case 3: return 'arrow-left'
      case 4: return 'delete'
      default: return false
    }
  }

  getStateCount = stateId => this.props.orgs.filter(org => org.status.kod === stateId).size

  handleClick = e => this.props.getOrgsByStatus(+e.key)
}

export default connect(state => ({
  orgs: state.orgs.get('entities'),
  currentStateId: state.orgs.statusId,
  orgStates: state.orgStates.get('entities')
}), { getOrgsByStatus })(LeftMenu)
