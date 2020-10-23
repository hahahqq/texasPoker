
/**
 * 库存
 * 库存盘点
 * ***/

import commonSend from '@/api/api'
import { 
  INVENTORY_LIST,
  INVENTORY_ADD,
  INVENTORY_ITEM,
  INVENTORY_CANCEL,
  INVENTORY_EXPORT_TABLE
} from '@/store/mutation-types'
import { getUserInfo,getHomeData } from '@/api/index'

// init state
const state = {
  inventoryListState:{ paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  }},
  inventoryList:[],  
  inventoryState:{},
  inventoryAddState:{},
  inventoryItem:{},
  inventoryObj:{},
  inventoryCancel:{},
  inventoryExportState:{}
}

// getters
const getters = {
  inventoryState:state=>state.inventoryState,
  inventoryAddState: state=>state.inventoryAddState,
  inventoryListState:state=>state.inventoryListState,
  inventoryExportState:state=>state.inventoryExportState,
  inventoryList:state=>state.inventoryList,
  inventoryCancel:state=>state.inventoryCancel,
  inventoryItem:state=>state.inventoryItem,
  inventoryObj:state=>state.inventoryObj
}

// actions
const actions = {
  addInventory({commit},data) { // 库存盘点保存
    let homeInfo = getHomeData();
    let userInfo = getUserInfo()
    let sendData={
      'InterfaceCode':'210021226',
      'CompanyId': userInfo.CompanyID,
      ShopId: data.ShopId,
      BillId: data.BillId,
      BillDate: data.BillDate,
      ManualNo: data.ManualNo, //手工单号
      IsAll : 0,
      GoodsList: data.GoodsList, // 货号Id,颜色Id,尺码Id,数量,单价,备注
      Remark: data.Remark,
      IsCheck: data.IsCheck
    }

    commonSend.commonSend('post',data=>{
      commit(INVENTORY_ADD,{data})
    },sendData)
  },
  getInventoryList({commit,state}, data) {    // 库存盘点列表
    let userInfo = getUserInfo()
    let homeInfo = getHomeData();
    let pn = parseInt(state.inventoryListState.paying.PN) +1;
    if(data.Filter) pn=1;
    let sendData={
      'InterfaceCode':'210021228',
      'CompanyId': userInfo.CompanyID,
      'ShopId': data.ShopId == '' ? homeInfo.shop.SHOPID : data.ShopId,
      Filter: data.Filter ? data.Filter : '',
      BeginDate: data.BeginDate,
      EndDate: data.EndDate,
      BillNo: data.BillNo,
      IsCheck: data.IsCheck,   // 是否确认, -1=all,0=草稿,1=确认单
      IsCancel: data.IsCancel, // 是否作废,-1=all,0=正常,1=已作废
      PN: data.PN?data.PN:pn
    }
    commonSend.commonSend('get',data=>{
      commit(INVENTORY_LIST,{ data }) 
    },sendData)
  },
  getinventoryList_Export({commit,state}, data) {    // 采购盘点列表—— 导出
    let userInfo = getUserInfo()
    let homeInfo = getHomeData();
    let sendData={
      'InterfaceCode':'210021414',
      'CompanyId': userInfo.CompanyID,
      'ShopId': data.ShopId,
      Filter: data.Filter ? data.Filter : '',
      BeginDate: data.BeginDate,
      EndDate: data.EndDate,
      BillNo: data.BillNo,
      IsCheck: data.IsCheck,  // 是否确认, -1=all,0=草稿,1=确认单
      IsCancel: data.IsCancel // 是否作废,-1=all,0=正常,1=已作废
    }
    commonSend.commonSend('get',data=>{
      commit(INVENTORY_EXPORT_TABLE,{ data })
    },sendData)
  },
  getInventoryItem({commit}, data) {  //店铺盘点详情
    let userInfo = getUserInfo()
    let homeInfo = getHomeData();
    let sendData={
      'InterfaceCode':'210021227',
      'CompanyId': userInfo.CompanyID,
      BillId: data.BillId
    }
    commonSend.commonSend('get',data=>{
      commit(INVENTORY_ITEM,{data})
    },sendData)
  },
  cancelInventory({commit},data){  //店铺盘点作废
    let userInfo = getUserInfo()
    let homeInfo = getHomeData();
    let sendData={
      'InterfaceCode':'210021229',
      'CompanyId': userInfo.CompanyID,
      BillId: data.BillId
    }
    commonSend.commonSend('get',data=>{
      commit(INVENTORY_CANCEL,{data})
    },sendData)
  },
  clearinventoryAll({state}){
    state.inventoryListState.paying.PN = 0
    state.inventoryList=[] 
    state.inventoryState={}
    state.inventoryItem={}
    state.inventoryObj={}
    state.inventoryCancel={}
  },
  cgdInventoryDataList({commit}, data){
    sessionStorage.setItem('theGoodsList_I', JSON.stringify(data.arr))
    sessionStorage.setItem('theGoodsObj_I', JSON.stringify(data.obj))
  }
}

// mutations
const mutations = {
  [INVENTORY_ADD](state, { data }) {
    state.inventoryAddState = Object.assign({},data);
  },
  [INVENTORY_EXPORT_TABLE](state, {data}){
    state.inventoryExportState = Object.assign({}, data)
  },
  [INVENTORY_LIST] (state, { data }) {
    let pageData = Object.assign({},state.inventoryListState.paying);
    if(data.success){
      state.inventoryList = [...data.data.PageData.DataArr]
      pageData = Object.assign(pageData, data.data.PageData)
    }
    state.inventoryListState = Object.assign({},data,{'paying':pageData});
  },
  [INVENTORY_ITEM] (state, { data }) {
    if(data.success){
      let param = []
      for(let i in data.data.GoodsObj){
        data.data.GoodsObj[i].isEdit = false
        param.push(data.data.GoodsObj[i])
      }
      state.inventoryItem = param
      state.inventoryObj = data.data.Obj
    }
    state.inventoryState = Object.assign({},data)
  },
  [INVENTORY_CANCEL](state,{data}){
    state.inventoryCancel = Object.assign({},data)
  },
}


export default{
  state,
  getters,
  actions,
  mutations
}

