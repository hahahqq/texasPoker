/**
 * 报表导出
 * 
 * ***/

import commonSend from '@/api/api'

import {
    SALEREPORT_EXPORT_TABLE,
    GOODSREPORT_EXPORT_TABLE,
    MEMBERREPORT_EXPORT_TABLE,
    DEFRAYREPORT_EXPORT_TABLE,
    BALANCEADJUST_EXPORT_TABLE,
    INTEGRALADJUST_EXPORT_TABLE,
    NUMBERBALANCE_EXPORT_TABLE,
    ORDERREPORT_EXPORT_TABLE,
    MEMBER_EXPORT_TABLE,
    SALEINQUIRY_EXPORT_TABLE,
    SALEMONEY_EXPORT_TABLE
} from '@/store/mutation-types'

import { getUserInfo, getHomeData } from '@/api/index'

const state = {
    saleReportExportState: {},
    goodsReportExportState: {},
    memberReportExportState: {},
    defrayReportExportState: {},
    balanceAdjustReportExportState: {},
    integralAdjustReportExportState: {},
    numberBalanceReportExportState: {},
    orderReportExportState: {},
    memberListExportState: {},
    saleInquiryListExportState: {},
    saleMoneyExportState:{}
}

const getters = {
    saleReportExportState: state => state.saleReportExportState,
    goodsReportExportState: state => state.goodsReportExportState,
    memberReportExportState: state => state.memberReportExportState,
    defrayReportExportState: state => state.defrayReportExportState,
    balanceAdjustReportExportState: state => state.balanceAdjustReportExportState,
    integralAdjustReportExportState: state => state.integralAdjustReportExportState,
    numberBalanceReportExportState: state => state.numberBalanceReportExportState,
    orderReportExportState: state => state.orderReportExportState,
    memberListExportState: state => state.memberListExportState,
    saleInquiryListExportState: state => state.saleInquiryListExportState,
    saleMoneyExportState: state=>state.saleMoneyExportState,
}

const actions = {
    getsaleReportData_Export({ commit }, data) {   // 销售分析导出
        let userInfo = getUserInfo();
        let homeInfo = getHomeData();
        let sendData = {
            'InterfaceCode': '210021415',
            'CompanyId': userInfo.CompanyID,
            ShopId: data.ShopId ? data.ShopId : '',
            BeginDate: data.BeginDate ? data.BeginDate : 1,
            EndDate: data.EndDate ? data.EndDate : 9999999999999,
        };
        commonSend.commonSend('get', data => {
            commit(SALEREPORT_EXPORT_TABLE, { data })
        }, sendData)
    },
    getgoodsReportData_Export({ commit }, data) {   // 商品分析导出
        let userInfo = getUserInfo();
        let homeInfo = getHomeData();
        let sendData = {
            'InterfaceCode': '210021406',
            Shops: data.ShopId ? data.ShopId : '',
            AppType:'',
            GoodCode:'',
            Orderby:'',
            BeginDate: data.BeginDate ? data.BeginDate : 1,
            EndDate: data.EndDate ? data.EndDate : 9999999999999,
        };
        commonSend.commonSend('get', data => {
            commit(GOODSREPORT_EXPORT_TABLE, { data })
        }, sendData)
    },
    getmemberReportData_Export({ commit }, data) {  // 会员分析导出
        let userInfo = getUserInfo();
        let homeInfo = getHomeData();
        let sendData = {
            'InterfaceCode': '210021416',
            'CompanyId': userInfo.CompanyID,
            ShopId: data.ShopId ? data.ShopId : '',
            BeginDate: data.BeginDate ? data.BeginDate : 1,
            EndDate: data.EndDate ? data.EndDate : 9999999999999,
        };
        commonSend.commonSend('get', data => {
            commit(MEMBERREPORT_EXPORT_TABLE, { data })
        }, sendData)
    },
    getdefrayReportData_Export({ commit }, data) {  // 支出分析导出
        let userInfo = getUserInfo();
        let homeInfo = getHomeData();
        let sendData = {
            'InterfaceCode': '210021419',
            'CompanyId': userInfo.CompanyID,
            ShipIDList: homeInfo.shop.ID,
            BeginDate: data.BeginDate ? data.BeginDate : 1,
            EndDate: data.EndDate ? data.EndDate : 9999999999999,
        };
        commonSend.commonSend('get', data => {
            commit(DEFRAYREPORT_EXPORT_TABLE, { data })
        }, sendData)
    },
    getbalanceAdjustList_Export({ commit }, data) { // 余额调整统计导出
        let userInfo = getUserInfo();
        let homeInfo = getHomeData();
        let sendData = {
            'InterfaceCode': '6010318_5',
            'CompanyId': userInfo.CompanyID,
            ShopId: data.ShopId,
            BeginDate: data.BeginDate ? data.BeginDate : 1,
            EndDate: data.EndDate ? data.EndDate : 9999999999999,
            Filter: ''
        };
        commonSend.commonSend('get', data => {
            commit(BALANCEADJUST_EXPORT_TABLE, { data })
        }, sendData)
    },
    getintegralAdjustList_Export({ commit }, data) { //积分调整统计导出
        let userInfo = getUserInfo();
        let homeInfo = getHomeData();
        let sendData = {
            'InterfaceCode': '6010318_6',
            'CompanyId': userInfo.CompanyID,
            ShopId: data.ShopId,
            BeginDate: data.BeginDate ? data.BeginDate : 1,
            EndDate: data.EndDate ? data.EndDate : 9999999999999,
            Filter: ''
        };
        commonSend.commonSend('get', data => {
            commit(INTEGRALADJUST_EXPORT_TABLE, { data })
        }, sendData)
    },
    getnumberBalanceList_Export({ commit }, data) { // 调整余次统计导出
        let userInfo = getUserInfo();
        let homeInfo = getHomeData();
        let sendData = {
            'InterfaceCode': '6010318_7',
            'CompanyId': userInfo.CompanyID,
            ShopId: data.ShopId ? data.ShopId : '',
            BeginDate: data.BeginDate ? data.BeginDate : 1,
            EndDate: data.EndDate ? data.EndDate : 9999999999999,
            Filter: ''
        };
        commonSend.commonSend('get', data => {
            commit(NUMBERBALANCE_EXPORT_TABLE, { data })
        }, sendData)
    },
    getorderReportData_Export({ commit }, data) {    //单据业绩核对导出
        let userInfo = getUserInfo();
        let homeInfo = getHomeData();
        let sendData = {
            'InterfaceCode': '6010318_8',
            'CompanyId': userInfo.CompanyID,
            ShopId: data.ShopId ? data.ShopId : '',
            BeginDate: data.BeginDate ? data.BeginDate : 1,
            EndDate: data.EndDate ? data.EndDate : 9999999999999,
            IsEmpMoney: data.IsEmpMoney ? 1 : 0 // 0=未设置，1=已设置
        };
        commonSend.commonSend('get', data => {
            commit(ORDERREPORT_EXPORT_TABLE, { data })
        }, sendData)
    },
    getsaleInquiryReportData_Export({ commit }, data) {    // 销售查询导出
        let userInfo = getUserInfo();
        let homeInfo = getHomeData();
        let sendData = {
            'InterfaceCode': '6010318_9',
            'CompanyId': userInfo.CompanyID,
            ShopId: data.ShopId ? data.ShopId : '',
            BeginDate: data.BeginDate ? data.BeginDate : 1,
            EndDate: data.EndDate ? data.EndDate : 9999999999999,
            Status: 0,
            PaytypeId: '',
            Filter: '',
        };

        commonSend.commonSend('get', data => {
            commit(SALEINQUIRY_EXPORT_TABLE, { data })
        }, sendData)
    },
    memberList_Export({ commit }, data) {  // 会员列表导出
        let userInfo = getUserInfo();
        let homeInfo = getHomeData();
        let sendData = Object.assign({}, data, {
            'InterfaceCode': '601020201_2',
            'Filter': data.Filter ? data.Filter : '',
            'ShopId': data.ShopId ? data.ShopId : homeInfo.shop.ID,
            'VipFlag': data.VipFlag ? data.VipFlag : '',
            'LevelName': data.LevelName ? data.LevelName : '',
            'birthday': -1,
            'PayCount': -1,
            'LossVip': -1,
            'Status': data.Status ? data.Status : -1, // -1=全部,0=正常，2=挂失
            'CompanyId': userInfo.CompanyID,
            'ShowMoney': 0, // 0=全部,1=余额大于0
            'OweMoney': 0 // 0=全部,1=余额大于0
        })
        commonSend.commonSend('get', data => {
            commit(MEMBER_EXPORT_TABLE, { data })
        }, sendData)
    },
    getsaleMoneyReportData_Export({ commit }, data) {  // 数据导出-营业额明细
        let userInfo = getUserInfo();
        let homeInfo = getHomeData();
        let sendData = {
            'InterfaceCode': '6010318_10',
            'ShopId': data.ShopId ? data.ShopId : homeInfo.shop.ID,
            'CompanyId': userInfo.CompanyID,
            BeginDate: data.BeginDate ? data.BeginDate : 1,
            EndDate: data.EndDate ? data.EndDate : 9999999999999,
        }
        commonSend.commonSend('get', data => {
            commit(SALEMONEY_EXPORT_TABLE, { data })
        }, sendData)
    },
}

const mutations = {
    [SALEREPORT_EXPORT_TABLE](state, { data }) {
        state.saleReportExportState = Object.assign({}, data)
    },
    [GOODSREPORT_EXPORT_TABLE](state, { data }) {
        state.goodsReportExportState = Object.assign({}, data)
    },
    [MEMBERREPORT_EXPORT_TABLE](state, { data }) {
        state.memberReportExportState = Object.assign({}, data)
    },
    [DEFRAYREPORT_EXPORT_TABLE](state, { data }) {
        state.defrayReportExportState = Object.assign({}, data)
    },
    [BALANCEADJUST_EXPORT_TABLE](state, { data }) {
        state.balanceAdjustReportExportState = Object.assign({}, data)
    },
    [INTEGRALADJUST_EXPORT_TABLE](state, { data }) {
        state.integralAdjustReportExportState = Object.assign({}, data)
    },
    [NUMBERBALANCE_EXPORT_TABLE](state, { data }) {
        state.numberBalanceReportExportState = Object.assign({}, data)
    },
    [ORDERREPORT_EXPORT_TABLE](state, { data }) {
        state.orderReportExportState = Object.assign({}, data)
    },
    [MEMBER_EXPORT_TABLE](state, { data }) {
        state.memberListExportState = Object.assign({}, data)
    },
    [SALEINQUIRY_EXPORT_TABLE](state, { data }) {
        state.saleInquiryListExportState = Object.assign({}, data)
    },
    [SALEMONEY_EXPORT_TABLE](state, { data }) {
        state.saleMoneyExportState = Object.assign({}, data)
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
