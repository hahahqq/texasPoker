import commonSend from '@/api/api'
import {
    GET_TABLE_LIST,
    SAVE_TABLE,
    DEL_TABLE
} from '@/store/mutation-types'
import { getUserInfo } from '@/api/index'

// init state
const state = {
    getTableListState: {},
    saveTableState: {},
    delTableState: {}
}

// getters
const getters = {
    getTableListState: state => state.getTableListState,
    saveTableState: state => state.saveTableState,
    delTableState: state => state.delTableState
}

// actions
const actions = {
    // 比赛项目
    getTableList({commit}, data){  // 赛事列表
        let userInfo = getUserInfo();
        let sendData = {
            'InterfaceCode': '9201001',
            'CompanyId': userInfo.CompanyID,
            'ShopId': data.ShopId,
            Filter: ''
        }
        commonSend.commonSend('get', data => {
            commit(GET_TABLE_LIST, { data })
        }, sendData)
    },
    saveTable({commit}, data){
        let userInfo = getUserInfo();
        let sendData = {
            'InterfaceCode': '9201003',
            'CompanyId': userInfo.CompanyID,
            'ShopId': data.ShopId,
            PlayerQty: 10,
            Code: '',
            Remark: '',
            Status: 0,
        
            ID: data.ID,
            Name: data.Name,
            DescNo: data.DescNo
        }
        commonSend.commonSend('get', data => {
            commit(SAVE_TABLE, { data })
        }, sendData)
    },
    delTable({commit}, data){
        let userInfo = getUserInfo()
        commonSend.commonSend('get', data => {
            commit(DEL_TABLE, {data})
        }, {
            InterfaceCode: '9201004',
            'CompanyId': userInfo.CompanyID,
            ID: data.ID
        })
    }

}

// mutations
const mutations = {
    [GET_TABLE_LIST](state, { data }) {
        state.getTableListState = data
    },
    [SAVE_TABLE](state, {data}){
        state.saveTableState = data
    },
    [DEL_TABLE](state, {data}){
        state.delTableState = data
    },
}


export default {
    state,
    getters,
    actions,
    mutations
}