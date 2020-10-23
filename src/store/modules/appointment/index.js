
/**
 * 预约设置
 * 
 * ***/

import commonSend from '@/api/api'
import {
    SET_APPOINTMENTS,
    GET_APPOINTMENTS,
} from '@/store/mutation-types'
import { getUserInfo, getHomeData } from '@/api/index'
let selected = {}

// init state
const state = {
    appointmentsState: {},
    Get_appointmentsState:{},
    appointments: {},
}

// getters
const getters = {
    appointmentsState: state => state.appointmentsState,
    Get_appointmentsState: state=> state.Get_appointmentsState,
    appointments: state => state.appointments,
}

// actions
const actions = {
    setAppointments({ commit },data) { // 预约设置
        let homeInfo = getHomeData();
        let sendData ={
            'InterfaceCode': '60101045',
            'CompanyId': homeInfo.shop.COMPANYID,
            SaleWeek: data.SaleWeek,
            SaleTime: JSON.stringify(data.SaleTime),
            ServiceType: data.ServiceType,
            ServiceTime: data.ServiceTime,
            ServiceQty: data.ServiceQty,
            ServiceBeginHour: data.ServiceBeginHour,
            ServiceEndMonth: data.ServiceEndMonth,
            IsTips: data.IsTips,
            CancelHour: data.CancelHour
        }
        commonSend.commonSend('post', data => {
            commit(SET_APPOINTMENTS, { data })
        }, sendData)
    },
    getAppointments({ commit }) { // 获取预约设置
        let homeInfo = getHomeData();
        let sendData = {
            'InterfaceCode': '60101046',
            'CompanyId': homeInfo.shop.COMPANYID,
        }
        commonSend.commonSend('get', data => {
            commit(GET_APPOINTMENTS, { data })
        }, sendData)
    },
    clearAppointmentsAll({ state }) {
        state.appointmentsState = {}
        state.appointments= {}
    }
}


// mutations
const mutations = {
    [SET_APPOINTMENTS](state, { data }) {
        state.appointmentsState = Object.assign({}, data);
    },
    [GET_APPOINTMENTS](state, { data }) {
        if (data.success) {
            state.appointments = Object.assign({}, data.Obj);
        }
        state.Get_appointmentsState = Object.assign({}, data);
    },
}


export default {
    state,
    getters,
    actions,
    mutations
}

