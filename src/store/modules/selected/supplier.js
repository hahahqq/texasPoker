import commonSend from '@/api/api'
import { getUserInfo,setHomeData, getHomeData } from '@/api/index'
import {
  SUPPLIER_LIST,
  SUPPLIER_ITEM,
  SUPPLIER_SAVE,
  SUPPLIER_CANCEL,
  SUPPLIERREPORT_LIST,
  SUPPLIER_REPORT_ITEM,
  SET_Supplier_FirstMoney,
  ADD_SUPPLIER,
  GET_GOODS_SUPPLIER,
  PAY_SUPPLIER,

} from '@/store/mutation-types'
import { stat } from 'fs';
let selected={}

// initial state
const state = {
  supplierFirstMoney:{},
  payMoneySupplierState:{},
  supplierListState: {},
  supplierReportList:[],
  supplierReportState:{},
  supplierReportItem:{},
  supplierList: [],
  supplierItem: {},
  supplierState:{},
  selsupplier:{},
  saveSupplierState:{},
  clearSupplierItem:{},
  cancelSupplierState:{},
  addSupplierState:{},
  goodssupplierList:[],
  goodssupplierState:{},
}

// getters
const getters = {
  supplierFirstMoney: state => state.supplierFirstMoney,
  payMoneySupplierState: state => state.payMoneySupplierState,
  supplierListState: state => state.supplierListState,
  supplierReportItem: state => state.supplierReportItem,
  supplierList: state => state.supplierList,
  supplierItem: state=>state.supplierItem,
  selsupplier : state=>state.selsupplier,
  supplierState : state=>state.supplierState,
  saveSupplierState:state=>state.saveSupplierState,
  cancelSupplierState: state=>state.cancelSupplierState,
  clearSupplierItem: state =>state.clearSupplierItem,
  supplierReportList:state=>state.supplierReportList,
  supplierReportState: state=> state.supplierReportState,
  addSupplierState: state=> state.addSupplierState,
  goodssupplierState: state=>state.goodssupplierState,
  goodssupplierList: state=>state.goodssupplierList,
}

// actions
const actions = {
  getSupplierList ({commit},data) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '21002061101',
      'CompanyId': userInfo.CompanyID,
      Filter: data.Filter?data.Filter:'',
      IsCurr: data.IsCurr?data.IsCurr:0, // 欠款筛选,0=全部，1=欠款
      IsStop: data.IsStop // -1=全部，1=停用，0=启用
    };
    commonSend.commonSend('get',data => {
      commit(SUPPLIER_LIST, { data })
    }, sendData )
  },
  getSupplilerReport({commit}, data){  //供应商对账
    let userInfo = getUserInfo()
    let sendData = {
      InterfaceCode: '601021261',
      CompanyId: userInfo.CompanyID,
      Filter: data.Filter,
      IsCurr: 0
    }
    commonSend.commonSend('get', data =>{
      commit(SUPPLIERREPORT_LIST, {data})
    }, sendData)
  },
  getGoodssupplierList({commit}, item) {
    let userInfo = getUserInfo()
    let sendData={
      'InterfaceCode':21002061101,
      'Filter':item.Filter||'',
      'IsCurr':item.IsCurr||0,
      'IsStop':item.IsStop|| 0,
      'CompanyId': userInfo.CompanyID,
    }
    commonSend.commonSend('get',data=>{
      commit(GET_GOODS_SUPPLIER,{data})
    },sendData)
  },
  setSupplierFirstMoney({commit}, data){
    let userInfo = getUserInfo()
    let sendData = {
      InterfaceCode: '60102011705',
      CompanyId: userInfo.CompanyID,
      Id: data.ID,
      FirstMoney: data.Money
    }
    commonSend.commonSend('get',data => {
      commit(SET_Supplier_FirstMoney, { data })
    }, sendData )
  },
  getSupplierReportItem({commit}, data){
    let userInfo = getUserInfo()
    let sendData = {
      InterfaceCode: '210021232',
      CompanyId: userInfo.CompanyID,
      BeginDate: data.BeginDate,
      EndDate: data.EndDate,
      PN: data.PN,
      SupplierId: data.SupplierId
    }
    commonSend.commonSend('get',data => {
      commit(SUPPLIER_REPORT_ITEM, { data })
    }, sendData )
  },
  getSupplierItem({commit},data){
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '21002061103',
      'CompanyId': userInfo.CompanyID,
      Id: data.id
    };
    commonSend.commonSend('get',data => {
      commit(SUPPLIER_ITEM, { data })
    }, sendData )
  },
  saveSupplierItem({commit},data){
    let userInfo = getUserInfo();
    let sendData = Object.assign({},data,{
      'InterfaceCode': '21002061102',
      'CompanyId': userInfo.CompanyID
    });
    commonSend.commonSend('get',data => {
      commit(SUPPLIER_SAVE, { data })
    }, sendData )
  },
  addSupplier({commit}, item){     //新增供应商
    let userInfo = getUserInfo()
    let sendData = {
      'InterfaceCode': 21002061102,
      'CompanyId': userInfo.CompanyID,
      Name: item.Name,
      Id: item.ID,
      Code:'',
      Linker: item.Linker,
      PhoneNo: item.PhoneNo,
      Fax: item.Fax,
      Tel: item.Tel,
      Address: item.Address,
      Email: item.Email,
      IsStop: 0,
      Remark: item.Remark,
      FirstMoney: item.FirstMoney,
      BankCardName: item.BankCardName,
      BankCardNo: item.BankCardNo,
      CardHolder: item.CardHolder,
      PROVINCEID:item.PROVINCEID,
      CITYID: item.CITYID,
      DISTRICTID: item.DISTRICTID
    }
    commonSend.commonSend('get', data =>{
      commit(ADD_SUPPLIER, { data })
    }, sendData)
  },
  payMoneySupplier({commit}, data){  //供应商还款
    let userInfo = getUserInfo()
    let homeInfo = getHomeData();
    let sendData = {
      InterfaceCode: '210021233',
      'CompanyId': userInfo.CompanyID,
      ShopId: homeInfo.shop.ID,
      SupplierId: data.data.SupplierId,
      BillDate: data.data.BillDate,
      PayTypeId: data.data.PayTypeId,
      PayMoney: data.data.PayMoney,
      Remark: data.data.Remark,
      FromBillId: ''
    }
    commonSend.commonSend('get', data=>{
      commit(PAY_SUPPLIER, {data})
    }, sendData)
  },
  cancelSupplier({commit},data){ // 作废
    let userInfo = getUserInfo();
    let sendData={
      'InterfaceCode':'21002061104',
      'CompanyId': userInfo.CompanyID,
      Id: data.id
    }
    commonSend.commonSend('get',data=>{
      commit(SUPPLIER_CANCEL,{data})
    },sendData)
  },
  selectingSupplier({state},data){
    state.selsupplier = Object.assign({},data);
  },
  clearSupplierAll({state}){
    state.supplierList= []
    state.supplierItem= {}
    state.selsupplier={}
  },
  clearSupplierItem({state}){
    state.supplierItem = {}
  }
}

// mutations
const mutations = {
  [SET_Supplier_FirstMoney](state, {data}){
    state.supplierFirstMoney = data
  },
  [PAY_SUPPLIER](state, {data}){
    state.payMoneySupplierState = data
  },
  [SUPPLIER_LIST] (state, { data }) {
    if(data.success){
      state.supplierList = [...data.data.List];
    }
    state.supplierListState = Object.assign({},data)
  },
  [SUPPLIERREPORT_LIST](state, {data}){ //供应商对账
    if(data.success){
      state.supplierReportList = [...data.data.List]
    }
    state.supplierReportState = Object.assign({}, data)
  },
  [SUPPLIER_REPORT_ITEM](state, {data}){  //供应商对账详情
    if(data.success){
      state.supplierReportItem = data
    }
  },
  [SUPPLIER_ITEM](state,{data}){
    if(data.success){
      state.supplierItem = Object.assign({},data.data.Obj);
    }
    state.supplierState = Object.assign({},data);
  },
  [SUPPLIER_SAVE](state,{data}){
    state.saveSupplierState = Object.assign({},data);
  },
  [SUPPLIER_CANCEL](state,{data}){
    state.cancelSupplierState = Object.assign({},data);
  },
  [ADD_SUPPLIER](state, {data}){ //新增供应商
    state.addSupplierState = Object.assign({}, data)
  },
  [GET_GOODS_SUPPLIER](state, { data }) {
    state.goodssupplierState = Object.assign({},data);
    if(data.success){
      state.goodssupplierList=[...data.data.List];
    }
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
