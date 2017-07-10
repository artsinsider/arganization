import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Icon, Button } from 'antd'
import { closeOrgCard } from '../AC/orgs'
import OrgForm from './OrgForm'
import {ORG_API_URL}  from '../constants/api'

class OrgCard extends Component {

  render() {
    return this.props.org ? this.renderCard() : null
  }

  renderCard() {
    const { org, disableEdit, sections } = this.props
      console.log(org.toJS())
    return(
      <Card className="org-card" title={ this.renderCardHeader() } loading={ false }  bordered={ true }>
        { this.renderField('ИНН:', org.inn) }
        { this.renderField('ОГРН:', org.ogrn) }
        { this.renderField('ОПФ:', org.opf.nazvanie) }
        { this.renderField('Телефон:', org.telefon) }
        { this.renderLink('Эл. почта:', org.email, `mailto:${org.email}`) }
        { this.renderField('Почтовый адрес:', org.adres_pochtoviy) }
        { this.renderLink('Эл. почта:', org.email, `mailto:${org.email}`) }
        { this.renderLink('Веб-сайт:', org.web_sait) }
        { this.renderField('Примечание:', org.primechanie) }
        { org.documenti.length > 0 ? <p><strong>Файлы:</strong> <br/> <ul>{ org.documenti.map(doc => <li key={doc.kod}><a href={`${ORG_API_URL}/dokumenty/${doc.kod}/zapros`}>{doc.nazvanie}</a></li>)}</ul></p> : null}
        {!disableEdit ? <div style={{marginTop: '15px'}}><OrgForm okText="Сохранить"  btnText="Редактировать" data={org.toJS()} title={org.nazvanie} btnType="primary" btnIcon="edit"  /> </div> : null}
        <br/>
        <Button icon="export" type="primary" onClick={() => this.redirect(org.kod)} >Посмотреть ресурсы</Button>
      </Card>
    )
  }

  redirect = (orgId) => {
      localStorage.setItem('ogrId', orgId)
      window.location.href = location.hostname === 'localhost' ? 'http://vm-ais-normativ.ursip.ru/monitoring/' :  location.protocol + '//' + location.host + '/monitoring/'
  }

  renderCardHeader() {
    const { org, closeOrgCard } = this.props
    return(
      <div style={{position: 'relative'}}>
        <strong>{ org.nazvanie }</strong>
        <Icon style={{cursor: 'pointer', color: '#108ee9', position: 'absolute', top: '50%', right: '0', marginTop: '-7px'}} onClick={ closeOrgCard } type="close" />
      </div>
    )
  }

  renderField = (label, field) => field ? <p><strong>{ label }</strong> <br/> { field }</p> : null
  renderLink = (label, field, href) => field ? <p><strong>{ label }</strong> <br/> <a href={ href ? href : field }>{ field }</a></p> : null

}

export default connect(state => ({
  org: state.orgs.getIn(['entities', state.orgs.loadedCardId]),
  disableEdit: (state.orgs.statusId === 4),
}), { closeOrgCard })(OrgCard)
