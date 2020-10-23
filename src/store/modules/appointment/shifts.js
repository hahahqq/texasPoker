
/**
 * 预约
 * 班次
 * ***/

import commonSend from '@/api/api'
import {
    SHIFTS_LIST,
    SHIFTS_DEAL,
    SHIFTS_ITEM,
} from '@/store/mutation-types'
import { getUserInfo, getHomeData } from '@/api/index'
let selected = {}

// init state
const state = {
    shiftsState: {},
    shiftsListState: {},
    shiftsList: [],
    shiftsItem: {},
}

// getters
const getters = {
    shiftsState: state => state.shiftsState,
    shiftsListState: state => state.shiftsListState,
    shiftsList: state => state.shiftsList,
    shiftsItem: state => state.shiftsItem
}

// actions
const actions = {
    getShiftsList({ commit }) { // 班次列表
        let homeInfo = getHomeData();
        let sendData = {
            'InterfaceCode': '60102011502',
            'CompanyId': homeInfo.shop.COMPANYID,
        }
        commonSend.commonSend('get', data => {
            commit(SHIFTS_LIST, { data })
        }, sendData)
    },
    getShiftsItem({ commit }, data) { // 班次详情
        let homeInfo = getHomeData();
        let sendData = {
            'InterfaceCode': '60102011503',
            'CompanyId': homeInfo.shop.COMPANYID,
            Id: data.ID
        }
        commonSend.commonSend('get', data => {
            commit(SHIFTS_ITEM, { data })
        }, sendData)
    },
    dealShiftsItem({ commit }, { type, data }) {
        let homeInfo = getHomeData();
        let sendData = Object.assign({}, data, {
            'InterfaceCode': '60102011501',
            'CompanyId': homeInfo.shop.COMPANYID,
        })
        if (type == 'del') {
            sendData.InterfaceCode = '60102011504';
        }
        selected.type = type
        selected.data = Object.assign({}, sendData)
        commonSend.commonSend('get', data => {
            commit(SHIFTS_DEAL, { data })
        }, sendData)
    },
    clearShiftsAll({ state }) {
        state.shiftsState = {}
        state.shiftsItem = {}
        state.shiftsList = []
    }
}


// mutations
const mutations = {
    [SHIFTS_LIST](state, { data }) {
        if (data.success) {
            state.shiftsList = [...data.data.List];
        }
        state.shiftsListState = Object.assign({}, data);
    },
    [SHIFTS_ITEM](state, { data }) {
        if (data.success) {
            state.shiftsItem = Object.assign({}, data.data);
        }
        state.shiftsState = Object.assign({}, data,{type:'get'});
    },
    [SHIFTS_DEAL](state, { data }) {
        state.shiftsState = Object.assign({}, data,{type:selected.type});
        selected = {}
    },
}


export default {
    state,
    getters,
    actions,
    mutations
}

