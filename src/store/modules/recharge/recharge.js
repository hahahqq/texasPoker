import commonSend from '@/api/api'
import { getUserInfo,setHomeData,getHomeData } from '@/api/index'
import {
  GET_RECHARGE_LIST,
  GET_INTEGRALT_LIST,
  SAVE_VIP_RECHARGE
} from '@/store/mutation-types'
let selected={}

// initial state
const state = {
  isPrintsatus:false,
  rechargeListState: {},
  rechargeListList: [],
  integraltList:[],
  saveVipRechargeState: {}
}

// getters
const getters = {
  rechargeListList: state => state.rechargeListList,
  rechargeListState: state => state.rechargeListState,
  integraltList: state => state.integraltList,
  saveVipRechargeState: state => state.saveVipRechargeState
}
// actions
const actions = {
  getrechargeList ({commit},data) { // 支付方式列表
    let userInfo= getUserInfo();
    let sendData = {
      InterfaceCode: '21002060301A',
      CompanyId: userInfo.CompanyID,
      Fliter: data.Fliter?data.Fliter:'',
      IsHide:data.IsHide,
    };
    commonSend.commonSend('get',data => {
      commit(GET_RECHARGE_LIST, { data })
    }, sendData )
  },
   getintegralTList ({commit},data) {
    let  userInfo= getUserInfo();
    let sendData = {
      InterfaceCode: 60102010301,
      CompanyId: userInfo.CompanyID,
    };
    if(data){
      sendData = Object.assign({},sendData,data)
    }
    commonSend.commonSend('get',data => {
      commit(GET_INTEGRALT_LIST, { data })
    }, sendData )
  },
  saveVipRecharge({commit}, data){  // 会员充值
   let homeInfo = getHomeData(), userInfo = getUserInfo()
   let sendData = {
     'InterfaceCode': '210020111',
     shopid: homeInfo.shop.ID,
     ID: data.VipId,
     AddMoney: data.AddMoney,
     GiftMoney: data.GiftMoney,
     IsSmd:data.IsSmd,
     Remark: data.Remark ? data.Remark : '',
     PayTypeId: data.PayTypeId,
     SaleEmpList: ''
   }
   commonSend.commonSend('get', data =>{
     commit(SAVE_VIP_RECHARGE,{data})
   }, sendData)
 },


}

// mutations
const mutations = {
  [GET_RECHARGE_LIST] (state, { data }) {
    if(data.success){
        let arr = [...data.data.List];
        for (let i = 0; i < arr.length; i++) {
          let nameval = arr[i].NAME;
          if (nameval.indexOf("现金") != "-1") {
            arr[i].payerIMG = "static/images/picon5.png";
          } else if (nameval.indexOf("扫码支付") != "-1") {
            arr[i].payerIMG = "static/images/picon3.png";
          } else if (nameval.indexOf("微信") != "-1") {
            arr[i].payerIMG = "static/images/picon4.png";
          } else if (nameval.indexOf("支付宝") != "-1") {
            arr[i].payerIMG = "static/images/picon7.png";
          } else if (nameval.indexOf("欠款") != "-1") {
            arr[i].payerIMG = "static/images/picon2.png";
          } else if (nameval.indexOf("卡") != "-1") {
            arr[i].payerIMG = "static/images/picon6.png";
          } else if (nameval.indexOf("积分") != "-1") {
            arr[i].payerIMG = "static/images/picon1.png";
          } else if (nameval.indexOf("余额支付") != "-1") {
            arr[i].payerIMG = "static/images/picon8.png";
          } else {
            arr[i].payerIMG = "static/images/picon6.png";
          }
        }
        state.rechargeListList = [...arr]
    }
    state.rechargeListState = Object.assign({},data);
  },
  [GET_INTEGRALT_LIST] (state, { data }) {
    if(data.success){
        state.integraltList = [...data.data.List];
    }
  },
  [SAVE_VIP_RECHARGE](state, {data}){
      state.saveVipRechargeState = Object.assign({}, data)
   },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
