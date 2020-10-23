
/**
 * 库存
 * 采购调拨
 * ***/

import commonSend from '@/api/api'
import { 
  ALLOCATION_LIST,
  ALLOCATION_ADD,
  ALLOCATION_ITEM,
  ALLOCATION_CANCEL,
  SAVE_ALLOCATION_BILL,
  ALLOCATION_EXPORT_TABLE
} from '@/store/mutation-types'
import { getUserInfo,getHomeData } from '@/api/index'

// init state
const state = {
  allocationListState:{ paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  }},
  allocationList:[],  
  allocationState:{},
  allocationAddState:{},
  allocationItem:{},
  allocationObj:{},
  allocationCancel:{},
  saveAllocationState:{},
  allocationExportState:{}
}

// getters
const getters = {
  allocationState:state=>state.allocationState,
  allocationAddState: state=>state.allocationAddState,
  allocationListState:state=>state.allocationListState,
  allocationList:state=>state.allocationList,
  allocationCancel:state=>state.allocationCancel,
  allocationItem:state=>state.allocationItem,
  allocationObj:state=>state.allocationObj,
  saveAllocationState:state=>state.saveAllocationState,
  allocationExportState:state=>state.allocationExportState
}

// actions
const actions = {
  addAllocation({commit},data) { // 采购调拨保存
    let userInfo = getUserInfo()
    let sendData={
      'InterfaceCode':'210021216',
      'CompanyId': userInfo.CompanyID,
      ShopId: data.ShopId,  // 调出店铺ID
      InShopId: data.InShopId,  // 调入店铺ID 
      BillId: data.BillId,
      BillDate: data.BillDate,
      ManualNo: data.ManualNo, //手工单号
      Remark: data.Remark,
      GoodsList: data.GoodsList, // 货号Id,颜色Id,尺码Id,数量,单价,备注
      IsCheck: data.IsCheck,
    }

    commonSend.commonSend('post',data=>{
      commit(ALLOCATION_ADD,{data})
    },sendData)
  },
  getAllocationList({commit,state}, data) {    // 采购调拨列表
    let homeInfo = getHomeData()
    let userInfo = getUserInfo()
    let sendData={
      'InterfaceCode': data.Status == 1 ? '210021222' : '210021218',
      'CompanyId': userInfo.CompanyID,
      'ShopId': data.Status == 2 ? '' : homeInfo.shop.SHOPID,
      'InShopId': data.Status == 2 ? homeInfo.shop.SHOPID : '',
      BeginDate: data.BeginDate,
      EndDate: data.EndDate,
      Filter: data.Filter,
      BillNo: data.BillNo,
      IsCheck: data.IsCheck,   // 是否确认, -1=all,0=草稿,1=确认单
      IsCancel: data.IsCancel, // 是否作废,-1=all,0=正常,1=已作废
      IsFlag : data.IsFlag,    // 是否调入  -1=all,0=未调入,1=已调入 
      PN: data.PN?data.PN:1
    }
    commonSend.commonSend('get',data=>{
      commit(ALLOCATION_LIST,{ data })
    },sendData)
  },
  getAllocationList_Export({commit}, data){   //采购调拨列表  -- 导出
    let homeInfo = getHomeData();
    let userInfo = getUserInfo()
    let sendData={
      'InterfaceCode':'210021413',
      'CompanyId': userInfo.CompanyID,
      'ShopId': homeInfo.shop.SHOPID,
      BeginDate: data.BeginDate,
      EndDate: data.EndDate,
      Filter: data.Filter,
      BillNo: data.BillNo,
      IsCheck: data.IsCheck,   // 是否确认  -1=all, 0=草稿, 1=确认单
      IsCancel: data.IsCancel, // 是否作废  -1=all, 0=正常, 1=已作废
      IsFlag : data.IsFlag,    // 是否调入  -1=all, 0=未调入,1=已调入
    }
    commonSend.commonSend('get',data=>{
      commit(ALLOCATION_EXPORT_TABLE,{ data })
    },sendData)
  },
  getAllocationItem({commit}, data) {
    let userInfo = getUserInfo()
    let sendData={
      'InterfaceCode':'210021217',
      'CompanyId': userInfo.CompanyID,
      BillId: data.BillId
    }
    commonSend.commonSend('get',data=>{
      commit(ALLOCATION_ITEM,{data})
    },sendData)
  },
  saveAllocationBill({commit}, data){  // 待调入单 --> 调入
    let userInfo = getUserInfo()
    let sendData ={
      'InterfaceCode' : '210021220',
      'CompanyId': userInfo.CompanyID,
      GoodsList:data.GoodsList,
      BillId: data.BillId,
      IsCheck: 1
    }
    commonSend.commonSend('post', data=>{
      commit(SAVE_ALLOCATION_BILL, {data})
    },sendData)
  },
  cancelAllocation({commit},data){
    let userInfo = getUserInfo()
    let sendData={
      'InterfaceCode':'210021219',
      'CompanyId': userInfo.CompanyID,
      BillId: data.BillId
    }
    commonSend.commonSend('get',data=>{
      commit(ALLOCATION_CANCEL,{data})
    },sendData)
  },
  clearallocationAll({state}){
    state.allocationListState.paying.PN = 0
    state.allocationList=[] 
    state.allocationState={}
    state.allocationItem={}
    state.allocationObj={}
    state.allocationCancel={}
  },
  cgdAllocationDataList({commit}, data){
    sessionStorage.setItem('theGoodsList_A', JSON.stringify(data.arr))
    sessionStorage.setItem('theGoodsObj_A', JSON.stringify(data.obj))
  }
}

// mutations
const mutations = {
  [SAVE_ALLOCATION_BILL](state, {data}){
    state.saveAllocationState = Object.assign({},data)
  },
  [ALLOCATION_ADD](state, { data }) {
    state.allocationAddState = Object.assign({},data);
  },
  [ALLOCATION_LIST] (state, { data }) {
    let pageData = Object.assign({},state.allocationListState.paying);
    if(data.success){
      state.allocationList = [...data.data.PageData.DataArr];
      pageData = Object.assign(pageData, data.data.PageData)
    }
    state.allocationListState = Object.assign({},data,{'paying':pageData});
  },
  [ALLOCATION_EXPORT_TABLE](state, {data}){
    state.allocationExportState = Object.assign({}, data)
  },
  [ALLOCATION_ITEM] (state, { data }) {
    if(data.success){
      let param = []
      for(let i in data.data.GoodsObj){
        data.data.GoodsObj[i].isEdit = false
        param.push(data.data.GoodsObj[i])
      }
      state.allocationItem = param
      state.allocationObj = data.data.Obj
    }
    state.allocationState = Object.assign({},data)
  },
  [ALLOCATION_CANCEL](state,{data}){
    state.allocationCancel = Object.assign({},data)
  },
}


export default{
  state,
  getters,
  actions,
  mutations
}

