import React, { Component } from 'react'
import {
  Form,
  Input,
  message,
  Button,
  Modal,
  Select,
  TreeSelect,
  notification,
  Icon
} from 'antd'
import { connect } from 'react-redux'
import { createOrg, updateOrg, deleteDocument } from '../AC/orgs'
import { loadAllOpf, createOpf } from '../AC/opf'
import {ORG_API_URL}  from '../constants/api'
import $ from 'jquery'

notification.config({duration: 7})
message.config({ duration: 3 })

const Item = Form.Item
const Option = Select.Option

class OrgFrom extends Component {

  state = {
    visible: false,
    files: [],
    existsFiles: null,
    documentsOrg: []
  }

  render() {
    const { getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form
    const { opf, orgs, loadAllOpf, data } = this.props

    const modalProps = {
      title: this.props.title,
      visible: this.state.visible,
      onOk: this.handleSubmit,
      onCancel: this.closeModal,
      okText: this.props.okText,
      confirmLoading: false,
      maskClosable: false,
      cancelText: 'Отмена'
    }

    const buttonProps = {
      type: this.props.btnType,
      icon: this.props.btnIcon,
      onClick: this.showModal,
      disabled: this.props.btnDisabled
    }
    console.log('data', data)
    return (
      <span className="service-btn">
        <Button { ...buttonProps }>{this.props.btnText}</Button>
        <Modal { ...modalProps }>
          <Form horizontal>
            {getFieldDecorator('kod')(<Input type="hidden"/>)}
            <Item key='inn' label="ИНН организации" hasFeedback>
            {getFieldDecorator('inn', {
              rules: [{
                required: true,
                message: 'Введите ИНН организации'
              },
              {validator(rule, value, callback, source, options) {
                let errors = []

                if(value && !/^\d+$/.test(value)) {
                  errors.push('ИНН должен содержать только цифры')
                }else if(value && (value.length < 10 || value.length > 12)) {
                  errors.push('Количество цифр в ИНН должно быть не меньше 10 и не более 12')
                }
                callback(errors)
              }}]
            })(
              <Input />
            )}
            </Item>
            <Item key='ogrn' label="ОГРН организации" hasFeedback>
            {getFieldDecorator('ogrn', {
              rules: [{
                required: true,
                message: 'Введите ОГРН организации'
              },
              {validator(rule, value, callback, source, options) {
                let errors = []
                if(value && !/^\d+$/.test(value)) {
                  errors.push('ОГРН должен содержать только цифры')
                }
                callback(errors)
              }}]
            })(
              <Input />
            )}
            </Item>
            <Item key='nazvanie' label="Наименование организации" hasFeedback>
              {getFieldDecorator('nazvanie', {
                  rules: [{
                    required: true,
                    message: 'Пожалуйста, укажите название организации'
                  }]
              })(
                <Input />
              )}
            </Item>
            <Item key='opf.nazvanie' label="Организационно правовая форма" hasFeedback>
              {getFieldDecorator('opf.nazvanie', {
                rules: [{
                  required: true,
                  message: 'Пожалуйста, укажите ОПФ организации'
                }]
              })(
                <Select combobox onSearch={loadAllOpf}>
                  { opf.map(item => <Option key={item.kod} value={item.nazvanie}>{item.nazvanie}</Option>) }
                </Select>
              )}
            </Item>
            <Item key='adres_pochtoviy' label="Адрес организации">
                {getFieldDecorator('adres_pochtoviy')(<Input />)}
            </Item>
            <Item key='telefon' label="Телефон">
              {getFieldDecorator('telefon')(<Input />)}
            </Item>
            <Item key='email' label="E-mail" hasFeedback>
              {getFieldDecorator('email', {
                rules: [{
                  required: true,
                  message: 'Пожалуйста, заполните email'
                },{validator(rule, value, callback, source, options) {
                  let errors = []
                  const pattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
                  if(value && !pattern.test(value)) {
                    errors.push('Некорректный формат email')
                  }
                  callback(errors)
                }}]
              })(<Input />)}
            </Item>
            <Item key='web_sait' label="Веб сайт организации">
              {getFieldDecorator('web_sait')(<Input />)}
            </Item>
            <Item key='primechanie' label="Примечание">
              {getFieldDecorator('primechanie', {
                rules: [{
                  required: false
                }]
              })(
                <Input type="textarea" autosize={{ minRows: 1, maxRows: 6 }}/>
              )}
            </Item>
            <Item key='file-add' label="Документы">
              {this.renderDocuments()}
              <Button icon="file-add" onClick={() => {this.refs.file.value = ''; this.refs.file.click();}} type="dashed">Загрузить</Button>

              <input ref="file" type="file" multiple="true" style={{display: 'none'}} onChange={this.handleAddFileOnList}/>
               <ul style={{marginTop: '5px'}}>
                  {this.state.files.map((file, index) =>
                    <li  style={{lineHeight: '15px'}} key={index}>{file.name}
                      <span style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                            onClick={this.handleDeleteFileFromList(index)}>&times;
                      </span>
                    </li>
                  )}
               </ul>
            </Item>
          </Form>
        </Modal>
      </span>
    )
  }

  handleSubmit = () => {
    const { validateFields, setFields } = this.props.form
    const { updateOrg, createOrg, statusId, opf, orgs, createOpf, data } = this.props

    validateFields((err, values) => {
      if (err) return

      if (orgs.filter(org => org.ogrn === values.ogrn).length && !values.kod) {
        setFields({
          ogrn: {
            value: values.ogrn,
            errors: [new Error(`Организация с таким ОГРН уже существует`)]
          }
        })
        // notification.error({message: `Ошибка!`, description: `Организация с ОГРН ${values.ogrn} уже существует`})
        return
      }

      const checkedOpf = opf.filter(item => item.nazvanie === values.opf.nazvanie)[0]

      /** закоментирован , переделана логика на беке*/
      // !opf.find(item => item.get('nazvanie') === values.opf.nazvanie) ? createOpf(values.opf.nazvanie) : null

      const record = {
        kod: values.kod,
        nazvanie: values.nazvanie,
        inn: values.inn,
        ogrn: values.ogrn,
        adres_pochtoviy: values.adres_pochtoviy,
        telefon: values.telefon,
        email: values.email,
        web_sait: values.web_sait,
        primechanie: values.primechanie,
        opf: {
          kod: checkedOpf ? checkedOpf.kod : null,
          nazvanie: values.opf.nazvanie
        },
        status: {
          kod: !values.kod ? 1 : statusId,
          nazvanie: !values.kod ? 'На добавление' : null
        }
      }

      if (data) {
        record.documenti = data.documenti
      }

      const form = document.createElement('form')
      form.enctype = 'multipart/form-data'
      form.action = ''
      const formdata = new FormData(form)
      formdata.append('data', JSON.stringify(record))
      this.state.files.forEach(file => formdata.append('files', file))

      values.kod ? updateOrg(formdata) : createOrg(formdata)

      this.closeModal()
    })
  }

  handleAddFileOnList = e => {
    const files = Object.keys(e.target.files)
      .map(i => e.target.files[i])
      .filter(file => this.state.files.findIndex(x => x.name === file.name) !== -1
        ? !!notification.error({ message: `${file.name}`, description: 'Вы уже выбрали файл/ы с таким именем' })
        : true)

    this.setState({ files: [...this.state.files, ...files] })
  }

  handleDeleteFileFromList = id => () =>{
      const { data, deleteDocument } = this.props
      const document = data.documenti.filter( doc => doc.kod == id)[0]
      deleteDocument(document, data.kod)
      this.setState({ files: this.state.files.filter((file, i) => i !== id) })
  }

  renderDocuments() {
    const { data } = this.props
    if (!data) return null
    return (
      <ul style={{marginBottom: '10px'}}>
      {data.documenti.map( (doc, index) => (
        <li style={{lineHeight: '15px'}} key={doc.kod}>
            <a href={`${ORG_API_URL}/dokumenty/${doc.kod}/zapros`}>{doc.nazvanie}</a>
          <Icon type="delete" style={{  color: 'red', cursor: 'pointer', paddingLeft: 10 }} onClick={this.handleDeleteFileFromList(doc.kod)}/>
        </li>
      ))}
      </ul>
    )
  }

  showModal = e => {
    const { data } = this.props

    if (data) {
      const { setFieldsValue } = this.props.form
      setFieldsValue(data)
    }

    this.setState({ visible: true })
  }

  closeModal = e => {
    this.props.form.resetFields()
    for (let i = 0; i < this.refs.file.length; i++) delete this.refs.file[i]
    this.setState({
      visible: false,
      files: [],
      existsFiles: null
    })
  }

}

const initForm = Form.create()

export default connect(state => ({
  statusId: state.orgs.statusId,
  opf: state.opf.get('entities').toArray(),
  orgs: state.orgs.get('entities').toArray()
}), { createOrg, updateOrg, createOpf, loadAllOpf, deleteDocument })(initForm(OrgFrom))
