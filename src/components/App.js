import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import { loadAllOrgs, loadAllOrgStates } from '../AC/orgs'
import { loadAllOpf } from '../AC/opf'
import { filter } from '../AC/filters'
import DataGrid from './DataGrid'
import LeftMenu from './LeftMenu'
import Controls from './Controls'
import OrgCard from './OrgCard'
import BottomMenu from './BottomMenu'

class App extends Component {

  componentDidMount = () => {
    this.props.loadAllOrgs()
    this.props.loadAllOrgStates()
    this.props.loadAllOpf()
  }

  render() {
    const { loadedCardId } = this.props
    const img = 'url("static/img/book.svg")'
    const MON = location.hostname === 'localhost' ? 'http://vm-ais-normativ.ursip.ru/monitoring/' :  location.protocol + '//' + location.host + '/monitoring/' // Микросервис "Мониторинг"
    const AUTH = location.hostname === 'localhost' ? 'http://vm-auth.ursip.ru/auth/' :  location.protocol + '//' + location.host + '/auth/' // Микросервис "Авторизации"
    const MACH = location.hostname === 'localhost' ? 'http://vm-ais-normativ.ursip.ru/machine/' :  location.protocol + '//' + location.host + '/machine/' // Микросервис "Машины и механизмы"

    return (
      <Spin spinning={this.props.loading} tip="Загрузка данных справочника...">
        <div className="service">
          <div className="service-left">
              <h3 className="service-name" style={{ backgroundImage:img, paddingTop: '5px'}} >АИС &laquo;Норматив&raquo; <small>Справочник организаций</small></h3>
              <LeftMenu />
              <div className="service-bottom"  style={{ top: window.innerHeight - 50 }}>
              </div>
          </div>
          <div className="service-right">
            <div className="service-buttons">
                <Controls />
            </div>
            <div className="service-body">
              <div style={{width: loadedCardId ? '70%' : '100%'}}>
                <DataGrid />
              </div>
              <div style={{width: loadedCardId ? '30%' : '0', paddingLeft: '5px'}}>
                <OrgCard />
              </div>
            </div>
          </div>
        </div>
          <div className="navigation-services" >
              <a className="img-auth"  href={AUTH} rel="noopener noreferrer" title="Авторизации" > </a>
              <a className="img-machine"  href={MACH} target="_blank" rel="noopener noreferrer" title="Машины и механизмы" > </a>
              <a className="img-mon"  href={MON} target="_blank" rel="noopener noreferrer" title="Мониторинг"> </a>
              <a  href="http://ursip.ru/" target="_blank" > <img className="img-ursip" src="static/img/ursip-logo.svg" alt="Ursip" title="Ursip"/> </a>
          </div>
      </Spin>
    )
  }
}

export default connect(state => ({
  loading: state.orgs.loading,
  loadedCardId: state.orgs.loadedCardId
}), { loadAllOrgs, loadAllOrgStates, loadAllOpf })(App)
