/**
 * 员工
 * 
 * ***/
import commonSend from '@/api/api'
import { getUserInfo,setHomeData } from '@/api/index'
import { 
  GET_EMPLOYEE_LIST,
  GET_EMPLOYEE_ITEM,
  GET_DELEMPLOYEE_STATE,
  GET_EMPLOYEE_POST,
  GET_JOB_LIST
} from '@/store/mutation-types'
let selected={}

// initial state
const state = {
  employeeListState: {},
  employeeList: [],
  selemployee:{},
  employeeitemState:{},
  delemployeestate:{},
  employeePost:[],
  jobList:[],
}

// getters
const getters = {
  employeeListState: state => state.employeeListState,
  employeeList: state => state.employeeList,
  selemployee : state=>state.selemployee,
  employeeitemState : state=>state.employeeitemState,
  delemployeestate : state=>state.delemployeestate,
  employeePost: state => state.employeePost,
  jobList: state => state.jobList,
}

// actions
const actions = {
  //生意通调销售员的接口
  getEmployeeList ({commit},data) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': 21002060701,
      'ShopId': data.ShopId?data.ShopId:'',
      Condition:data.Condition?data.Condition:'',
      Position: data.Position?data.Position:''
    };
    commonSend.commonSend('get',data => {
      commit(GET_EMPLOYEE_LIST, { data })
    }, sendData )
  },
  getJobList ({commit},data) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': 21002060705,
      'CompanyId': userInfo.CompanyID
    };
    commonSend.commonSend('get',data => {
      commit(GET_JOB_LIST, { data })
    }, sendData )
  },
  choosingEmployee({commit},item){
    setHomeData({'employee':item})
  },
  selectingEmployee({commit,state},data){
    state.selemployee = Object.assign({},data);
  },
  clearEmployeeAll({state}){
    state.employeeList= []
    state.selemployee={}
  },
  dealEmployeeItem({commit},data){ // edit
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '60102010403',
      'CompanyId': userInfo.CompanyID
    };
    if (data) {
      sendData = Object.assign({}, sendData, data)
    }
    commonSend.commonSend('get',data => {
      commit(GET_EMPLOYEE_ITEM, { data })
    }, sendData )
  },
  getdelemployeestate({commit,state},{index,data}){
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '60102010404',
      'CompanyId': userInfo.CompanyID,
      ID: data.ID
    };
    commonSend.commonSend('get',data => {
      commit(GET_DELEMPLOYEE_STATE, { data })
    }, sendData )
  },
  getEmployeePost({commit}, {}){  // 员工职务列表
    let userInfo = getUserInfo()
    let sendData = {
      InterfaceCode: '60102010406', 
      CompanyId: userInfo.CompanyID
    }
    commonSend.commonSend('get', data =>{
      commit(GET_EMPLOYEE_POST, {data})
    }, sendData)
  }
}

// mutations
const mutations = {
  [GET_EMPLOYEE_POST](state, {data}){
    if(data.success){
      console.log(data)
      state.employeePost = [...data.data.List]
    }
  },
  [GET_EMPLOYEE_LIST] (state, { data }) {
    if(data.success){
      state.employeeList = [...data.data.List];
    }
    state.employeeListState = Object.assign({},data);
  },
  [GET_JOB_LIST] (state, { data }) {
    console.log(data)
    if(data.success){
      state.jobList = [...data.data.List];
    }
  },
  [GET_EMPLOYEE_ITEM] (state, { data }) {
    if(data.success){
    }
    state.employeeitemState = Object.assign({},data);
  },
  [GET_DELEMPLOYEE_STATE] (state, { data }) {
    if(data.success){
    }
    state.delemployeestate = Object.assign({},data);
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
