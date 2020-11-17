import commonSend from '@/api/api'
import {
    GET_EVENTS_LIST,
    GET_EVENTS_LIST_ALL,
    GET_EVENTS_DETAILS,
    SAVE_EVENTS,
    DEL_EVENTS,
    SAVE_REWARDWAY,
} from '@/store/mutation-types'
import { getUserInfo, getHomeData } from '@/api/index'

// init state
const state = {
    getEventsListState: {},
    getEventsListAllState: {},
    getEventsDetailsState: {},
    saveEventsState: {},
    delEventsState: {},
    saveRewardWayState: {},
}

// getters
const getters = {
    getEventsListState: state => state.getEventsListState,
    getEventsListAllState: state => state.getEventsListAllState,
    getEventsDetailsState: state => state.getEventsDetailsState,
    saveEventsState: state => state.saveEventsState,
    delEventsState: state => state.delEventsState,
    saveRewardWayState: state => state.saveRewardWayState,
}

// actions
const actions = {
    // 比赛项目
    getEventsList({commit}, data){  // 比赛项目列表
        let userInfo = getUserInfo();
        let sendData = {
            'InterfaceCode': '920202001',
            'CompanyId': userInfo.CompanyID,
            'ShopId': getHomeData().shop.ID,
            UserId: '',
            Filter: '',
            Type: data.Type ? data.Type : -1,
            PN: data.PN ? data.PN : 1,
            IsIntegralMatch: data.IsIntegralMatch
        }
        commonSend.commonSend('get', data => {
            commit(GET_EVENTS_LIST, { data })
        }, sendData)
    },
    getEventsListAll({commit}, data){  // 比赛项目列表-- 不分页
        let userInfo = getUserInfo();
        let sendData = {
            'InterfaceCode': '920202001A',
            'CompanyId': userInfo.CompanyID,
            'ShopId': getHomeData().shop.ID,
            UserId: '',
            Filter: '',
            Type: data.Type
        }
        commonSend.commonSend('get', data => {
            commit(GET_EVENTS_LIST_ALL, { data })
        }, sendData)
    },
    getEventsDetails({commit}, data){
        let userInfo = getUserInfo()
        let sendData = {
            'InterfaceCode': '920202002',
            'CompanyId': userInfo.CompanyID,
            'ShopId': getHomeData().shop.ID,
            Id: data.Id
        }
        commonSend.commonSend('get', data => {
            commit(GET_EVENTS_DETAILS, { data })
        }, sendData)
    },
    saveEvents({commit}, data){
        let userInfo = getUserInfo()
        let sendData = {
            InterfaceCode: '920202003',
            'CompanyId': userInfo.CompanyID,
            'ShopId': getHomeData().shop.ID,
            Id: data.Id,
            UserId: '',
            Type: data.Type,
            Code: data.Code ? data.Code : '',
            Name: data.Name,
            Status: data.Status ? data.Status : 0,  //  0: 启用， 1 停用
            Category: data.Category,
            Remark: data.Remark,
            BuyinMoney: data.BuyinMoney,
            RebuyMoney: data.RebuyMoney ? data.RebuyMoney : 0,
            AddonMoney: data.AddonMoney ? data.AddonMoney : 0,
            ReturnMoney: data.ReturnMoney ? data.ReturnMoney : 0,
            ChipsQty: data.ChipsQty,    // Buyin记分牌
            ChipsQty2: data.ChipsQty2 ? data.ChipsQty2 : 0, // Rebuy记分牌
            ChipsQty3: data.ChipsQty3 ? data.ChipsQty3 : 0,  // Addon记分牌
            GradeQty: data.GradeQty ? data.GradeQty : 0,
            ChargesType: data.ChargesType,
            ChargesMoney: data.ChargesMoney,
            ChargesRate: data.ChargesRate,
            RewardType: data.RewardType,   // 0=按比例,1=按固定积分
            BuyinCanQty: -1,
            RebuyCanQty: -1,
            AddonCanQty: -1
        }
        commonSend.commonSend('post', data => {
            commit(SAVE_EVENTS, { data })
        }, sendData)
    },
    delEvents({commit}, data){
        let userInfo = getUserInfo()
        let sendData = {
            InterfaceCode: '920202004',
            'CompanyId': userInfo.CompanyID,
            'ShopId': getHomeData().shop.ID,
            Id: data.Id,
            UserId: ''
        }
        commonSend.commonSend('get', data => {
            commit(DEL_EVENTS, { data })
        }, sendData)
    },

    // 奖励方案
    saveRewardWay({commit}, data){
        let arr = data.RewardList, newArr = []
        if(arr.length != 0){
            for(var i in arr){
               let name = arr[i].Name.substr(1)
               arr[i].Name = name.substr(0, name.length - 1);  // 去掉名次中的 “第”、“名”
               arr[i].Integral = data.RewardType == 0 ? 0 : arr[i].RewardRate
               arr[i].Rate = data.RewardType == 0 ? arr[i].RewardRate / 100 : 0
               newArr.push(arr[i])
            }
        }

        let sendData = {
            'InterfaceCode': '920202007A',
            EventId: data.EventId,
            UserId: '',
            RewardList: JSON.stringify(newArr)
        }
        commonSend.commonSend('post', data => {
            commit(SAVE_REWARDWAY, { data })
        }, sendData)
    },

}

// mutations
const mutations = {
    [GET_EVENTS_LIST](state, { data }) {
        state.getEventsListState = data
    },
    [GET_EVENTS_LIST_ALL](state, { data }) {
        state.getEventsListAllState = data
    },
    [GET_EVENTS_DETAILS](state, {data}){
        state.getEventsDetailsState = data
    },
    [SAVE_EVENTS](state, {data}){
        state.saveEventsState = data
    },
    [DEL_EVENTS](state, {data}){
        state.delEventsState = data
    },
    [SAVE_REWARDWAY](state, {data}){
        state.saveRewardWayState = data
    },
}


export default {
    state,
    getters,
    actions,
    mutations
}

