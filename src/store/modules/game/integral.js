import commonSend from '@/api/api'
import {
    SAVE_INTEGRAL_GAME,
    INTEGRAL_CANCEL_GAME,
    INTEGRAL_EXIT_GAME,
    EDIT_INTEGRAL_GAME,
    INTEGRAL_START_SIGNUP,
    INTEGRAL_CANCEL_VIP_REWARD,
    INTEGRAL_SUBMIT_REWARD,
    INTEGRAL_BUYOBJ,
    NO_PRIZE_LIST
} from '@/store/mutation-types'
import { getUserInfo, getHomeData } from '@/api/index'


// init state
const state = {
  saveIntegralGameState: {},
  integralCancelGameState: {},
  integralExitGameState: {},
  integralEditGameState: {},
  integralStartSignUpState: {},
  integralCancelVipRewardState: {},
  integralSubmitRewardState: {},
  integralBuyObjState: {},
  getNoPrizeListState: {}
}


// getters
const getters = {
  saveIntegralGameState: state => state.saveIntegralGameState,
  integralCancelGameState: state => state.integralCancelGameState,
  integralExitGameState: state => state.integralExitGameState,
  integralEditGameState: state => state.integralEditGameState,
  integralStartSignUpState: state => state.integralStartSignUpState,
  integralCancelVipRewardState: state => state.integralCancelVipRewardState,
  integralSubmitRewardState: state => state.integralSubmitRewardState,
  integralBuyObjState: state => state.integralBuyObjState,
  getNoPrizeListState: state => state.getNoPrizeListState
}


// actions
const actions = {
  saveIntegralGame({commit}, data){  // 增加自由积分赛
      let userInfo = getUserInfo()
      let sendData = {
          InterfaceCode: '920201017',
          'CompanyId': userInfo.CompanyID,
          'ShopId': getHomeData().shop.ID,
          UserId: userInfo.UserID,
          ManualNo: '',
          EventId: data.EventId,
          DeskId: data.DeskId,
          IsOnLine: data.IsOnLine,
          PlayTime: data.PlayTime,
          Remark:data.Remark,
          IsNeedTime: 0 ,   // 是否按时计费
          MoneyItemId: '',  // 盲注级别ID
          Name: data.Name,
          ChargesType: data.ChargesType,
          ChargesMoney: data.ChargesMoney,
          ChargesRate: data.ChargesRate,
          ChipsQty: data.ChipsQty,
          BuyinMoney: data.BuyinMoney
      }

      commonSend.commonSend('get', data => {
          commit(SAVE_INTEGRAL_GAME, { data })
      }, sendData)
  },
  integralCancelOrGameOver({commit}, data){   // 积分赛取消比赛  0 : 取消比赛  1：比赛结束
      let userInfo = getUserInfo()
      let sendData = {
          InterfaceCode: data.Type == 0 ? '920201017F' : '920201017E',
          'CompanyId': userInfo.CompanyID,
          'ShopId': getHomeData().shop.ID,
          UserId: userInfo.UserID,
          BillId: data.BillId
      }
      if(data.Type == 1){
          sendData.MatchBillId = data.BillId
      }
      commonSend.commonSend('get', data => {
          commit(INTEGRAL_CANCEL_GAME, { data })
      }, sendData)
  },
  integralExitGame({commit}, data){  // 积分赛退出比赛
      let userInfo = getUserInfo()
      let sendData = {
          InterfaceCode: '920201017C',
          'CompanyId': userInfo.CompanyID,
          'ShopId': getHomeData().shop.ID,
          UserId: userInfo.UserID,
          BillId : data.BillId,
          IsSms: 0,
          VipId : data.VipId
      }
      commonSend.commonSend('get', data => {
          commit(INTEGRAL_EXIT_GAME, { data })
      }, sendData)
  },
  editIntegralGame({commit}, data){ // 修改积分赛比赛
    let userInfo = getUserInfo()
      let sendData = {
          InterfaceCode: '920201018',
          'CompanyId': userInfo.CompanyID,
          'ShopId': getHomeData().shop.ID,
          UserId: userInfo.UserID,
          BillId: data.BillId,
          EventId: data.EventId,
          DeskId: data.DeskId,
          IsOnLine: data.IsOnLine,
          PlayTime: data.PlayTime,
          Remark:data.Remark,
          Name: data.Name,
          ChargesType: data.ChargesType,
          ChargesMoney: data.ChargesMoney,
          ChargesRate: data.ChargesRate,
          ChipsQty: data.ChipsQty,
          BuyinMoney: data.BuyinMoney
      }

      commonSend.commonSend('get', data => {
          commit(EDIT_INTEGRAL_GAME, { data })
      }, sendData)
  },
  integralStartSignUp({commit}, data){  // integral 比赛报名
    let userInfo = getUserInfo();
    let sendData = {
        'InterfaceCode': '920201017A',
        UserId: userInfo.UserID,
        VipId: data.VipId,
        BillId: data.BillId,
        Remark:'',
        IsSms: 0,
        DiscountMoney: data.DiscountMoney,
        BuyinMoney: data.BuyinMoney,
        Qty: data.Qty
    }
    commonSend.commonSend('post', data => {
        commit(INTEGRAL_START_SIGNUP, { data })
    }, sendData)
  },
  integralSubmitReward({commit}, data){  // 积分赛兑换积分
    console.log(data)
    let userInfo = getUserInfo();
    let sendData = {
        'InterfaceCode': '920201017D',
        'CompanyId': userInfo.CompanyID,
        'ShopId': getHomeData().shop.ID,
        UserId: userInfo.UserID,
        VipId: data.VipId,
        MatchBillId: data.BillId,
        Remark: data.Remark,
        RewardName: data.RewardName,
        RewardMoney: data.RewardMoney,
        ContestQty: data.ContestQty,
        IsSms: 0
    }
    commonSend.commonSend('post', data => {
        commit(INTEGRAL_SUBMIT_REWARD, { data })
    }, sendData)
  },
  integralCancelRewardVip({commit}, data){   // 积分赛取消奖励(按会员)
    let userInfo = getUserInfo()
    let sendData = {
        InterfaceCode: '920201010H',
        'CompanyId': userInfo.CompanyID,
        'ShopId': getHomeData().shop.ID,
        UserId: userInfo.UserID,
        IsSms: 0,
        VipId: data.VipId,
        MatchBillId: data.BillId
    }
    commonSend.commonSend('get', data => {
        commit(INTEGRAL_CANCEL_VIP_REWARD, { data })
    }, sendData)
  },
  integralBuyObj({commit}, data){  // 积分赛报名详情
    let userInfo = getUserInfo()
    let sendData = {
        InterfaceCode: '920201017G',
        'CompanyId': userInfo.CompanyID,
        'ShopId': getHomeData().shop.ID,
        UserId: userInfo.UserID,
        BillId: data.BillId,
        IsReward: data.IsReward ? data.IsReward : -1,
        VipFilter: data.VipFilter ? data.VipFilter : ''
    }

    commonSend.commonSend('get', data => {
        commit(INTEGRAL_BUYOBJ, { data })
    }, sendData)
  },
  getNoPrizeList({commit}, data){  // 未领奖会员列表
   let userInfo = getUserInfo()
   let sendData = {
       InterfaceCode: '920201017G',
       'CompanyId': userInfo.CompanyID,
       'ShopId': getHomeData().shop.ID,
       UserId: userInfo.UserID,
       BillId: data.BillId,
       IsReward: data.IsReward,
       VipFilter: data.VipFilter ? data.VipFilter : ''
   }

   commonSend.commonSend('get', data => {
       commit(NO_PRIZE_LIST, { data })
   }, sendData)
 },

}

// mutations
const mutations = {
   [NO_PRIZE_LIST](state, { data }) {
      state.getNoPrizeListState = data
  },
  [SAVE_INTEGRAL_GAME](state, { data }) {
      state.saveIntegralGameState = data
  },
  [INTEGRAL_CANCEL_GAME](state, { data }) {
      state.integralCancelGameState = data
  },
  [INTEGRAL_EXIT_GAME](state, {data}){
      state.integralExitGameState = data
  },
  [INTEGRAL_CANCEL_VIP_REWARD](state, {data}){
      state.integralCancelVipRewardState = data
  },
  [EDIT_INTEGRAL_GAME](state, {data}){
    state.integralEditGameState = data
  },
  [INTEGRAL_START_SIGNUP](state, {data}){
    state.integralStartSignUpState = data
  },
  [INTEGRAL_SUBMIT_REWARD](state, {data}){
    state.integralSubmitRewardState = data
  },
  [INTEGRAL_BUYOBJ](state, {data}){
    state.integralBuyObjState = data
  },
}


export default {
  state,
  getters,
  actions,
  mutations
}
