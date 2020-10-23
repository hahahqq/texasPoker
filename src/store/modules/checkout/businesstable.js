import commonSend from '@/api/api'
import { getUserInfo,setHomeData,getHomeData } from '@/api/index'
import { 
    GET_BUSINESS_TABLE,
    GET_BUSINESS_TABLE_DETAILED,
    EXPORT_BUSINESS_DERIVE
} from '@/store/mutation-types'
let selected={}


// initial state
const state = {
  businesstable: [],
  businesstabledetailed:{},
  exportBusinessDerive:{},
  businesstableState:{
    paying:{
        "TotalNumber": 0,
        "PageNumber": 0,
        "PageSize": 20,
        "PN": 0,
      }
  }
}

// getters
const getters = {
    businesstable: state => state.businesstable,
    businesstableState: state => state.businesstableState,
    businesstabledetailed: state => state.businesstabledetailed,
    exportBusinessDerive: state => state.exportBusinessDerive,
}


// actions
const actions = {
  getExportBusinessTableData({ commit }, data) {  // 导出
    console.log("营业查询导出11111111111111",data)
    let homeInfo = getHomeData();
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '210021433',
      CompanyId: userInfo.CompanyID,
      ShopId:homeInfo.shop.ID,
      BeginDate:data.BeginDate,
      EndDate:data.EndDate,
      Filter: data.Filter,
      Status: data.Status ? data.Status:'-1', 
      BillType: data.BillType ? data.BillType:'-1',
    }
    commonSend.commonSend('post', data => {
      commit(EXPORT_BUSINESS_DERIVE, {data})
    }, sendData)
  },
  getBusinesstable ({commit},data) {
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let sendData = {
      InterfaceCode: 21002070906,
      CompanyId: userInfo.CompanyID,
      ShopId:homeInfo.shop.ID,
      PN:data.pagination.PN ? data.pagination.PN : 1,
      BeginDate:data.date[0],
      EndDate:data.date[1],
      Filter:data.Filter ? data.Filter:"",
      Status:data.Status ? data.Status:-1,
      BillType:data.BillType ? data.BillType:-1,
    };
    commonSend.commonSend('get',data => {
      commit(GET_BUSINESS_TABLE, { data })
    }, sendData )
  },
  getBusinesstableDetailed ({commit},data) {
    console.log(data)
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let sendData
    if(data.i==1){
      sendData = {
        InterfaceCode: 210020531,
        BillId:data.BILLID,
        CompanyId: userInfo.CompanyID,
        ShopId:homeInfo.shop.ID,
      };
    }else if(data.i==2){
      sendData = {
        InterfaceCode: 210020530,
        BillId:data.BILLID,
        ShopId:homeInfo.shop.ID,
      };
    }else if(data.i==3){
      sendData = {
        InterfaceCode: '210020532_1',
        BillId:data.BILLID,
        ShopId:homeInfo.shop.ID,
        CompanyId: userInfo.CompanyID
      };
    }else if(data.i==4){
      sendData = {
        InterfaceCode: '210020150',
        BillId:data.BILLID,
        ShopId:homeInfo.shop.ID,
        CompanyId: userInfo.CompanyID
      };
    }else if(data.i==5){
      sendData = {
        InterfaceCode: '210020150_1',
        BillId:data.BILLID,
        ShopId:homeInfo.shop.ID,
        CompanyId: userInfo.CompanyID
      };
    }
    commonSend.commonSend('get',data => {
      commit(GET_BUSINESS_TABLE_DETAILED, { data })
    }, sendData )
  },
  
}

// mutations
const mutations = {
  [GET_BUSINESS_TABLE] (state, { data }) {
    state.businesstable = Object.assign({},data.data.PageData.DataArr);
    state.businesstableState = Object.assign({},data.data.PageData);
  },
  
  [GET_BUSINESS_TABLE_DETAILED] (state, { data }) {
    state.businesstabledetailed = Object.assign({}, data.data)
  },

  [EXPORT_BUSINESS_DERIVE] (state, { data }) {
    state.exportBusinessDerive = Object.assign({}, data.data.List)
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
