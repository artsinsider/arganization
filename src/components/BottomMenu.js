import React, { Component } from 'react'
import { Menu, Icon } from 'antd'

export default class BottomMenu extends Component {

  state = {
    current: 'mail'
  }

    render() {

        return (
          <Menu
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="mail">
              <Icon type="home" />
            </Menu.Item>
            <Menu.Item key="app">
              <a href="http://vm-ais-normativ.ursip.ru/monitoring/" target="_blank" rel="noopener noreferrer"><Icon type="line-chart" /> Мониторинг</a>
            </Menu.Item>
          </Menu>
        )
    }

}
