import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'

import { selectOrg, selectAllOrgsOnPage, loadOrgCard, searchOrgByName } from '../AC/orgs'

class DataGrid extends Component {

  render() {
    const { orgs, selectOrg, sections, selectAllOrgsOnPage, selected, selectDisabled } = this.props
    const rowSelection = {
      selectedRowKeys: selected,
      width: 10,
      onSelect: record => selectOrg(record.kod),
      onSelectAll: (selected, selectedRows, changeRows) => selectAllOrgsOnPage(changeRows.map(record => record.kod), selected)
    }
    const columns = [
      {
        title: 'ИНН',
        dataIndex: 'inn',
        key: 'inn',
        width: 90,
        sorter: (a, b) => {
          switch (true) {
            case a.inn < b.inn: return -1
            case a.inn > b.inn: return 1
            default: return 0;
          }
        }
      },
      {
        title: 'ОГРН',
        dataIndex: 'ogrn',
        key: 'ogrn',
        width: 90,
        sorter: (a, b) => {
          switch (true) {
            case a.ogrn < b.ogrn: return -1
            case a.ogrn > b.ogrn: return 1
            default: return 0;
          }
        }
      },
      {
        title: 'Название организации',
        dataIndex: 'nazvanie',
        key: 'nazvanie',
        width: 300,
        sorter: (a, b) => {
          switch (true) {
            case a.nazvanie < b.nazvanie: return -1
            case a.nazvanie > b.nazvanie: return 1
            default: return 0;
          }
        }
      }
    ]

    const pagination = {
      total: orgs.length,
      showTotal: total => `Всего: ${total}`,
      showSizeChanger: true,
      pageSizeOptions: ['100', '200', '400', `${this.props.orgs.length}`],
      showQuickJumper: true,
      defaultPageSize: 100
    }

    return (
      <Table
        columns={ columns }
        dataSource={ orgs }
        rowKey="kod"
        bordered
        onRowClick={ this.handleRowClick }
        rowClassName={ this.changerowClassName }
        pagination={ pagination }
        scroll={{ y: window.innerHeight - 234 }}
        rowSelection={ (!selectDisabled) ? rowSelection : undefined }
        />
    )
  }

  onInputChange = e => this.setState({ searchText: e.target.value })

  handleRowClick = (record, index) => this.props.loadOrgCard(record.kod)

  changerowClassName = record => this.props.loadedCardId === record.kod ? 'highlight' : ''

  onSearch = () => this.props.searchOrgByName(this.state.searchText)

}

export default connect(state => ({
  orgs: state.orgs.get('entities')
    .sortBy((item) => -item.get('kod'))
    .map(org => org.toObject())
    .filter(org => {
      const { statusId } = state.orgs
      return org.status.kod === statusId &&
        org[state.filters.field].toLowerCase().includes(state.filters.term.toLowerCase())
    }).toArray(),
  selected: state.orgs.get('selected').toArray(),
  selectDisabled: state.orgs.selectDisabled,
  loadedCardId: state.orgs.loadedCardId,
}), { selectOrg, selectAllOrgsOnPage, loadOrgCard, searchOrgByName })(DataGrid)
