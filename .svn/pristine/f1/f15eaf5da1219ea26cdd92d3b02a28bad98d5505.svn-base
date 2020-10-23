
/**
 * 预约
 * 
 * ***/

import commonSend from '@/api/api'
import { 
  BESPEAK_LIST,
  DEAL_BESPEAK,
  WECHAT_LIST,
  BESPEAK_LIST2,
  EDIT_BESPEAK_STATUS,
  GET_EMPLOY_PAIBAN,
  SET_EMPLOYPAIBAN,
  GET_XIANGMU_LIST
} from '@/store/mutation-types'
import { getUserInfo,getHomeData } from '@/api/index'
let selected={}

// init state
const state = {
  bespeakState:{},
  bespeakListState:{ paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  }},
  bespeakList:[],  
  bespeakList2:{},  
  bespeakItem:{},  
  dealBespeakState:{},
  wechatList:[],
  wechatListState:{ paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  }},
  wechatItem:{},
  editBespeakStatusState:{},
  employPaiBanData:{},
  okSetEmploypaiban:{},
  subjectList:[],
}

// getters
const getters = {
  bespeakState:state=>state.bespeakState,
  bespeakListState:state=>state.bespeakListState,
  editBespeakStatusState: state=> state.editBespeakStatusState,
  bespeakList:state=>state.bespeakList,
  bespeakList2:state=>state.bespeakList2,
  bespeakItem:state=>state.bespeakItem,
  dealBespeakState: state=>state.dealBespeakState,
  wechatList:state=>state.wechatList,
  wechatListState: state=>state.wechatListState,
  wechatItem: state=>state.wechatItem,
  employPaiBanData: state=> state.employPaiBanData,
  okSetEmploypaiban: state=> state.okSetEmploypaiban,
  subjectList: state=> state.subjectList,
}

// actions
const actions = {
  setEmployPaiBan({commit}, data){  //员工排班
    let homeInfo = getHomeData()
    let sendData = {
      InterfaceCode: '601020921A',
      CompanyId: homeInfo.shop.COMPANYID,
      ShopId: data.ShopId,
      ShiftsList: data.ShiftsList
    }
    commonSend.commonSend('get', data =>{
      commit(SET_EMPLOYPAIBAN, {data})
    }, sendData)
  },
  getBespeakList2({commit}) { // 预约中
    let homeInfo = getHomeData();
    let sendData={
      'InterfaceCode':'601020902_1',
      'CompanyId': homeInfo.shop.COMPANYID,
      'ShopID':homeInfo.shop.ID,
      'PN': 1,
      Status: 0, 
      Filter: '',
      BeginDate: '1',
      EndDate: '9999999999999'
    }
    commonSend.commonSend('get',data=>{
      commit(BESPEAK_LIST2,{data})
    },sendData)
  },
  getBespeakList({commit,state}, data) { // 预约明细列表
    let userInfo = getUserInfo();
    let homeInfo = getHomeData()
    let pn = parseInt(state.bespeakListState.paying.PN) +1;
    if(data.Filter && 
      state.bespeakListState.paying.PageSize >= state.bespeakListState.paying.TotalNumber){ pn=1;}
      let sendData={
        'InterfaceCode':'210020401_1',
        'PN': data.PN?data.PN:pn,
        'ShopID':homeInfo.shop.ID,
        Status: data.Status, // -1=全部  0=预约中  1=已到店  2=已取消
        Filter: data.Filter,
        'CompanyId': userInfo.CompanyID,
        EndDate: data.EndDate,
        BeginDate: data.BeginDate,
        Goodsid:data.Goodsid?data.Goodsid:'',
    }
    commonSend.commonSend('get',data=>{
      commit(BESPEAK_LIST,{data})
    },sendData)
  },
  editBespeakStatus({commit}, data ){  //预约状态变更
    let homeInfo = getHomeData()
    let sendData = {
      InterfaceCode: 210020402,
      ID: data.ID,
      Status: data.Status
    }
    commonSend.commonSend('get', data => {
      commit(EDIT_BESPEAK_STATUS, {data})
    }, sendData)
  },
  dealBespeakItem({commit}, {type,data}) { // 手工添加预约，只有新增
    let homeInfo = getHomeData()
    let sendData = Object.assign({},data,{
      'InterfaceCode':'210020408',
      'CompanyId': homeInfo.shop.COMPANYID,
      'ShopId':homeInfo.shop.ID,
      'Qty': ''
    })
    if(data.ID){
      sendData.Id = data.ID
    }
    selected.type = type
    selected.data = Object.assign({},sendData)
    commonSend.commonSend('get',data=>{
      commit(DEAL_BESPEAK,{data})
    },sendData)
  },
  getEmployPaiBan({commit}, data){  //排班列表
    let homeInfo = getHomeData()
    let sendData = {
      InterfaceCode : '601020922',
      CompanyId: homeInfo.shop.COMPANYID,
      BeginTime: data.BeginTime,
      ShopId: data.ShopId,
      TimeDate: data.TimeDate
    }
    commonSend.commonSend('get', data =>{
      commit(GET_EMPLOY_PAIBAN, {data})
    }, sendData)
  },

  getWehatList({commit,state}, data) {
    console.log("999999999999999999")
    console.log(data)
    let homeInfo = getHomeData()
    console.log()
    let pn = parseInt(state.wechatListState.paying.PN) +1;
    if( state.wechatListState.paying.PageSize >= state.wechatListState.paying.TotalNumber){ pn=1;}
    let sendData={
      'InterfaceCode':'210020405',
      'ShopId':homeInfo.shop.ID,
      'PN': data.PN?data.PN:pn,
      'Status':data.Status?data.Status:'',
      'GoodsId':data.GoodsId?data.GoodsId:''
    };
    commonSend.commonSend('get',data=>{
      commit(WECHAT_LIST,{data})
    },sendData)
  },
  getSubjectList({commit,state}, data) {
    let userInfo = getUserInfo();
    let homeInfo = getHomeData()
    let sendData={
      'InterfaceCode':'210020410',
      'ShopId':homeInfo.shop.ID,
      'CompanyId': userInfo.CompanyID,
    };
    commonSend.commonSend('get',data=>{
      commit(GET_XIANGMU_LIST,{data})
    },sendData)
  },
  getWechatItem({state}, data) {
    state.wechatItem = Object.assign({},data)
  },
  dealWechatItem({commit}, {type,data}){ //微信预约发布
    let homeInfo = getHomeData();
    let sendData = Object.assign({},data,{
      'InterfaceCode':'210020400',  // 新增
      'CompanyId': homeInfo.shop.COMPANYID,
      'ShopId':homeInfo.shop.ID
    })
    if(type=='edit'){
      sendData.BillID = data.BillID;
      sendData.InterfaceCode = '210020403'  //修改
    }
    if(type=='del'){
      sendData.InterfaceCode = '210020404'  //删除
    }
    selected.type = type
    selected.data = Object.assign({},sendData)
    commonSend.commonSend('get',data=>{
      commit(DEAL_BESPEAK,{data})
    },sendData)
  },
  clearBespeakAll({state}){
    state.bespeakListState.paying.PN = 0
    state.bespeakList = []
    state.bespeakList2 = {}
    state.bespeakItem = {}
    state.wechatList=[]
    state.wechatListState.paying.PN = 0
    state.wechatItem = {}
  }
}
// mutations
const mutations = {
  [SET_EMPLOYPAIBAN](state,{data}){
    state.okSetEmploypaiban = data
  },
  [GET_EMPLOY_PAIBAN](state, {data}){
    if(data.success){
      state.employPaiBanData = data
    }
  },
  [EDIT_BESPEAK_STATUS](state, {data}){
    if(data.success){
      state.editBespeakStatusState = data
    }
  },
  [BESPEAK_LIST] (state, { data }) {
    let pageData = Object.assign({},state.bespeakListState.paying);
    if(data.success){
      state.bespeakList = [...data.data.PageData.DataArr];
      pageData = Object.assign(pageData, data.data.PageData)
    }
    state.bespeakListState = Object.assign({},data,{'paying':pageData});
  },
  [DEAL_BESPEAK](state, { data }) { console.log(data)
    if(data.success){
      state.bespeakListState.paying.PN = 0
    }
    state.bespeakState = Object.assign({},data);
    selected={}
  },
  [WECHAT_LIST] (state, { data }) {
    let pageData = Object.assign({},state.wechatListState.paying);
    if(data.success){
      state.wechatList = [...data.data.PageData.DataArr];
      pageData = Object.assign(pageData, data.data.PageData)
    }
    state.wechatListState = Object.assign({},data,{'paying':pageData});
  },
  [GET_XIANGMU_LIST] (state, { data }) {
    if(data.success){
      state.subjectList = [...data.data.List];
    }
  },
  [BESPEAK_LIST2](state,{data}){
    state.bespeakList2 = Object.assign({},data);
  },
}


export default{
  state,
  getters,
  actions,
  mutations
}

