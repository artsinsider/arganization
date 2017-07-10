export const ORG_API_URL = location.hostname === 'localhost' ? 'http://vm-ais-normativ.ursip.ru/ws-org/v1' :  location.protocol + '//' + location.host + '/ws-org/v1' // Микросервис "Организации"
export const MONITORING_API_URL = window.location.protocol + '//' + window.location.host + '/ws-mon/v1'  // Микросервис "Мониторинг"
