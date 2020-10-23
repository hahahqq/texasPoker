// 单据业绩核对
import commonSend from '@/api/api'
import { getUserInfo,getHomeData } from '@/api/index'
import { 
    GET_CROSSSTORE_DATA,
    GET_CROSSSTORE_SALES_ITEM,
    GET_CROSSSTORE_RECHARGE_ITEM
} from '@/store/mutation-types'

// initial state
const state = {
    CrossStoreObj: {},
    crossStoreSalesObj:{},
    crossStoreRechargeObj:{}
}

// getters
const getters = {
    CrossStoreObj: state=>state.CrossStoreObj,
    crossStoreSalesObj: state=>state.crossStoreSalesObj,
    crossStoreRechargeObj: state=>state.crossStoreRechargeObj
}

// actions
const actions = {
    getCrossStoreData({commit}, data){  //储值跨店账单
        let userInfo = getUserInfo()
        let sendData = {
            InterfaceCode: '6010321_0',
            CompanyId: userInfo.CompanyID,
            ShopId: data.ShopId,
            BeginDate: data.BeginDate,
            EndDate: data.EndDate
        }
        commonSend.commonSend('get', data=>{
            commit(GET_CROSSSTORE_DATA, {data})
        }, sendData)
    },
    getCrossStoreSalesItem({commit}, data){  //账单消费明细
        let userInfo = getUserInfo()
        let sendData = {
            InterfaceCode: '6010321_5',
            CompanyId: userInfo.CompanyID,
            ShopId: data.ShopId,
            BeginDate: data.BeginDate,
            EndDate: data.EndDate,
            PN: data.PN
        }
        commonSend.commonSend('get', data=>{
            commit(GET_CROSSSTORE_SALES_ITEM, {data})
        }, sendData)
    },
    getCrossStoreRechargeItem({commit}, data){  //账单充值明细
        let userInfo = getUserInfo()
        let sendData = {
            InterfaceCode: '6010321_6',
            CompanyId: userInfo.CompanyID,
            ShopId: data.ShopId,
            BeginDate: data.BeginDate,
            EndDate: data.EndDate,
            PN: data.PN
        }
        commonSend.commonSend('get', data=>{
            commit(GET_CROSSSTORE_RECHARGE_ITEM, {data})
        }, sendData)
    },
}

// mutations
const mutations = {
    [GET_CROSSSTORE_DATA](state, data){
        console.log(data)
        if(data.data.success){
            state.CrossStoreObj = data.data
        }
    },
    [GET_CROSSSTORE_SALES_ITEM](state, data){
        if(data.data.success){
            state.crossStoreSalesObj = data.data
        }
    },
    [GET_CROSSSTORE_RECHARGE_ITEM](state, data){
        if(data.data.success){
            state.crossStoreRechargeObj = data.data
        }
    }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
