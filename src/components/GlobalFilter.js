import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Select } from 'antd'
import { filter } from '../AC/filters'

const Option = Select.Option
const Search = Input.Search

class GlobalFilter extends Component {

  state = {
    field: this.props.field
  }

  render() {
    const { filter } = this.props
    const selectBefore = (
      <Select onChange={value => this.setState({ field: value })} defaultValue="inn" style={{ width: 100 }}>
        <Option value="inn">ИНН</Option>
        <Option value="nazvanie">Название</Option>
        <Option value="adres_pochtoviy">Адрес</Option>
        <Option value="telefon">Телефон</Option>
        <Option value="email">E-mail</Option>
        <Option value="web_sait">Веб-сайт</Option>
        <Option value="primechanie">Примечание</Option>
      </Select>
    )
    return (
      <span style={{ position: 'absolute', left: 0 }}>
        <Input addonBefore={selectBefore} placeholder="Поиск" style={{ width: 300 }} onPressEnter={e => filter(e.target.value, this.state.field)} />
      </span>
    )
  }
}

export default connect(state => ({
  field: state.filters.field,
  term: state.filters.term
}), { filter })(GlobalFilter)
