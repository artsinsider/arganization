import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { LocaleProvider } from 'antd'
import ruRU from 'antd/lib/locale-provider/ru_RU'
import App from './App'
import 'antd/dist/antd.min.css'
import '../index.css'

export default class Root extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <LocaleProvider locale={ruRU}>
          <App />
        </LocaleProvider>
      </Provider>
    )
  }
}
