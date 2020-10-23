import commonSend from '@/api/api'
import {
  SERVER_TIME,
  LOGIN,
  REGISTER,
  CHANGE_PASSWORD,
  VERIFYCODE,
  EXPERIENCE,
  GET_PERMISSION_INFO,
  GET_TRADE_SERVER_LIST,
  GET_TRADE_RETAIL_LIST
} from '@/store/mutation-types'
import { getUserInfo, setUserInfo, setOthersData,clearStorage } from '@/api/index'
import {SYSTEM_INFO} from "@/util/define"
let selected = {}

// init state
const state = {
  loginState: {},
  registerState: {},
  STimeState: {},
  AgentInfo: {},
  changePwdState: {},
  verCodeState: {},
  experienceState: {},
  AgentPermission: {},
  getTradeServerListState: {},
  getTradeRetailListState: {}
}

// getters
const getters = {
  loginState: state => state.loginState,
  registerState: state => state.registerState,
  STimeState: state => state.STimeState,
  AgentInfo: state => state.AgentInfo,
  changePwdState: state => state.changePwdState,
  verCodeState: state => state.verCodeState,
  experienceState: state => state.experienceState,
  AgentPermission: state => state.AgentPermission,
  getTradeServerListState: state => state.getTradeServerListState,
  getTradeRetailListState: state => state.getTradeRetailListState,
}

// actions
const actions = {
  getServerTime({ commit }) {
    commonSend.methodGet(data => {
      commit(SERVER_TIME, { data })
    }, { 'InterfaceCode': 2100100 })
  },
  toLogin({ commit }, data = {}) {
    let sendData = Object.assign({}, data, {
      InterfaceCode: '2100102',
      AppType: 0, // 0=PC
      VersionText: SYSTEM_INFO.VERSION,
      IMEI: "",
      platform: 0
    });
    selected.data = {
      CODE2: data.UserCode.toLowerCase(),
      PPWW: Math.random().toFixed(4) + (data.Password ? data.Password : '0000')
    }
    commonSend.commonSend('get', data => {
      commit(LOGIN, { data })
    }, sendData)
  },
  toLogOut({ commit }, data = {}) {
    clearStorage(5);
  },
  toRegister({ commit }, data = {}) {
    let sendData = Object.assign({}, data, {
      'InterfaceCode': '2100101_1',
      shareauthcode: '',
      regversion: 3,
      platform: '',
      ordermode: 0,
    })
    selected.data = { 'AuthCode': data.mobileno, 'UserCode': 'boss', 'Password': data.password }

    commonSend.commonSend('get', data => {
      commit(REGISTER, { data })
    }, sendData)
  },
  getTradeServerList({commit}, data){  // 行业列表 -服务
    let sendData = {
      InterfaceCode: '2100122',
      Type: 1
    }
    commonSend.commonSend('get', data => {
      commit(GET_TRADE_SERVER_LIST, { data })
    }, sendData)
  },
  getTradeRetailList({commit}, data){  // 行业列表 -零售
    let sendData = {
      InterfaceCode: '2100122',
      Type: 2
    }
    commonSend.commonSend('get', data => {
      commit(GET_TRADE_RETAIL_LIST, { data })
    }, sendData)
  },
  getVerCode({ commit }, tel) { // 获取验证码
    let sendData = {
      'InterfaceCode': '2100103',
      'MobileNo': tel,
      'verifycode': ''
    }
    commonSend.commonSend('get', data => {
      commit(VERIFYCODE, { data })
    }, sendData)
  },
  changePwd({ commit }, data = {}) {
    let sendData = Object.assign({}, data, {
      'InterfaceCode': '20660201'
    })
    commonSend.commonSend('get', data => {
      commit(CHANGE_PASSWORD, { data })
    }, sendData)
  },
  toExperience({ commit }, data) {
    let sendData = {
      'InterfaceCode': '2100113',
      'versionText': 1,
      'isvipsoft':false,
      'isold':false,
      'tradeMode':data
    }
    commonSend.commonSend('get', data => {
      commit(EXPERIENCE, { data })
    }, sendData)
  },
  getPermissionInfo({ commit }) { // 获取当前用户权限列表
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '2100104',
      'UserID': userInfo.UserID
    }
    commonSend.commonSend('get', data => {
      commit(GET_PERMISSION_INFO, { data })
    }, sendData)
  },
}

const mutations = {
  [GET_TRADE_SERVER_LIST](state, { data }){
    state.getTradeServerListState = data.data
  },
  [GET_TRADE_RETAIL_LIST](state, { data }){
    console.log(data)
    state.getTradeRetailListState = data.data
  },
  [LOGIN](state, { data }) {
    state.loginState = Object.assign({}, data);
    if (data.success) {
      state.AgentInfo = Object.assign({}, data.data, selected.data);
      setUserInfo(state.AgentInfo);
    }
    state.loginState = Object.assign({}, data);
    selected = {}
  },
  [REGISTER](state, { data }) {
    state.registerState = Object.assign({}, data, { regdata: selected.data });
    selected = {}
  },
  [SERVER_TIME](state, { data }) {
    let SERVER_TIME = {};
    state.STimeState = Object.assign({}, data.data);
    if (data.data.success) {
      SERVER_TIME.time = data.data.data.ServerTime - new Date().getTime();
      SERVER_TIME.JSESSIONID = data.headers['Set-Cookie'] ? data.headers['Set-Cookie'] : '';
    }
    sessionStorage.setItem("SERVER_TIME", JSON.stringify(SERVER_TIME));
  },
  [CHANGE_PASSWORD](state, { data }) {
    state.changePwdState = Object.assign({}, data);
  },
  [VERIFYCODE](state, { data }) {
    state.verCodeState = Object.assign({}, data);
  },
  [EXPERIENCE](state, { data }) {
    console.log("data")
    console.log(data)
    state.experienceState = Object.assign({}, data);
  },
  [GET_PERMISSION_INFO](state, { data }) {
    if (data.success) {
      setUserInfo(data.data)
      // List 权限

      let userInfo = getUserInfo();
      let CompanyConfig = userInfo.CompanyConfig;
      if (CompanyConfig && (CompanyConfig.AUTOSENDADDSMS || CompanyConfig.AUTOSENDCHANAGESMS || CompanyConfig.AUTOSENDPAYSMS)) {
        setOthersData({ issms: true })
      } else {
        setOthersData({ issms: false })
      }
    }
    state.AgentPermission = Object.assign({}, data)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
