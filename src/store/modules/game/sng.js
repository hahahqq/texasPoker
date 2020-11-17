import commonSend from "@/api/api";
import {
   SAVE_SNG_GAME,
   SNG_CANCEL_GAME,
   SNG_EXIT_GAME,
   EDIT_SNG_GAME,
   SNG_START_SIGNUP,
   SNG_CANCEL_VIP_REWARD,
   SNG_SUBMIT_REWARD
} from "@/store/mutation-types";
import { getUserInfo, getHomeData } from "@/api/index";

// init state
const state = {
   saveSngGameState: {},
   sngCancelGameState: {},
   sngExitGameState: {},
   sngEditGameState: {},
   sngStartSignUpState: {},
   sngCancelVipRewardState: {},
   sngSubmitRewardState: {}
};

// getters
const getters = {
   saveSngGameState: state => state.saveSngGameState,
   sngCancelGameState: state => state.sngCancelGameState,
   sngExitGameState: state => state.sngExitGameState,
   sngEditGameState: state => state.sngEditGameState,
   sngStartSignUpState: state => state.sngStartSignUpState,
   sngCancelVipRewardState: state => state.sngCancelVipRewardState,
   sngSubmitRewardState: state => state.sngSubmitRewardState
};

// actions
const actions = {
   saveSngGame({ commit }, data) {
      // SNG增加比赛
      let userInfo = getUserInfo();

      let arr = data.RewardList,
         newArr = [];
      if (arr.length != 0) {
         for (var i in arr) {
            let name = arr[i].Name.substr(1);
            arr[i].Name = name.substr(0, name.length - 1); // 去掉名次中的 “第”、“名”
            arr[i].Integral = data.RewardType == 0 ? 0 : arr[i].RewardRate;
            arr[i].Rate = data.RewardType == 0 ? arr[i].RewardRate / 100 : 0;
            newArr.push(arr[i]);
         }
      }

      let sendData = {
         InterfaceCode: "920201010",
         CompanyId: userInfo.CompanyID,
         ShopId: getHomeData().shop.ID,
         UserId: "",
         EventId: data.EventId,
         DeskId: data.DeskId,
         IsOnLine: data.IsOnLine,
         PlayTime: data.PlayTime,
         Remark: data.Remark,
         RewardList: JSON.stringify(newArr),
         RewardType: 0,
         Name: data.Name,
         ChargesType: data.ChargesType,
         ChargesMoney: data.ChargesMoney,
         ChargesRate: data.ChargesRate,
         ChipsQty: data.ChipsQty,
         BuyinMoney: data.BuyinMoney
      };

      commonSend.commonSend(
         "get",
         data => {
            commit(SAVE_SNG_GAME, { data });
         },
         sendData
      );
   },
   sngCancelOrGameOver({ commit }, data) {
      // SNG取消比赛  0 : 取消比赛  1：比赛结束
      let userInfo = getUserInfo();
      let sendData = {
         InterfaceCode: data.Type == 0 ? "920201010E" : "920201010D",
         CompanyId: userInfo.CompanyID,
         ShopId: getHomeData().shop.ID,
         UserId: "",
         BillId: data.BillId
      };
      if (data.Type == 1) {
         sendData.MatchBillId = data.BillId;
      }

      commonSend.commonSend(
         "get",
         data => {
            commit(SNG_CANCEL_GAME, { data });
         },
         sendData
      );
   },
   sngExitGame({ commit }, data) {
      // SNG退出比赛
      let userInfo = getUserInfo();
      let sendData = {
         InterfaceCode: "920201010C",
         CompanyId: userInfo.CompanyID,
         ShopId: getHomeData().shop.ID,
         UserId: "",
         BillId: data.BillId,
         IsSms: 0,
         VipId: data.VipId
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(SNG_EXIT_GAME, { data });
         },
         sendData
      );
   },
   editSngGame({ commit }, data) {
      // 修改sng比赛
      let userInfo = getUserInfo();
      let arr = data.RewardList,
         newArr = [];
      if (arr.length != 0) {
         for (var i in arr) {
            let name = arr[i].Name.substr(1);
            arr[i].Name = name.substr(0, name.length - 1); // 去掉名次中的 “第”、“名”
            arr[i].Integral = data.RewardType == 0 ? 0 : arr[i].RewardRate;
            arr[i].Rate = data.RewardType == 0 ? arr[i].RewardRate / 100 : 0;
            newArr.push(arr[i]);
         }
      }

      let sendData = {
         InterfaceCode: "920201011",
         CompanyId: userInfo.CompanyID,
         ShopId: getHomeData().shop.ID,
         UserId: "",
         BillId: data.BillId,
         EventId: data.EventId,
         DeskId: data.DeskId,
         IsOnLine: data.IsOnLine,
         PlayTime: data.PlayTime,
         Remark: data.Remark,
         RewardList: JSON.stringify(newArr),
         RewardType: 0,
         Name: data.Name,
         ChargesType: data.ChargesType,
         ChargesMoney: data.ChargesMoney,
         ChargesRate: data.ChargesRate,
         ChipsQty: data.ChipsQty,
         BuyinMoney: data.BuyinMoney
      };

      commonSend.commonSend(
         "get",
         data => {
            commit(EDIT_SNG_GAME, { data });
         },
         sendData
      );
   },
   sngStartSignUp({ commit }, data) {
      // sng 比赛报名
      let userInfo = getUserInfo();
      let sendData = {
         InterfaceCode: "920201010A",
         UserId: "",
         VipId: data.VipId,
         BillId: data.BillId,
         Remark: data.Remark,
         IsSms: 0,
         DiscountMoney: data.DiscountMoney,
         BuyinMoney: data.BuyinMoney,
         Payintegral: data.Payintegral
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(SNG_START_SIGNUP, { data });
         },
         sendData
      );
   },
   sngSubmitReward({ commit }, data) {
      // SNG领取奖励
      console.log(data);
      let name = data.RewardName.substr(1)
      let RewardName = name.substr(0, name.length - 1); // 去掉名次中的 “第”、“名”

      let userInfo = getUserInfo();
      let sendData = {
         InterfaceCode: "920201010F",
         CompanyId: userInfo.CompanyID,
         ShopId: getHomeData().shop.ID,
         UserId: "",
         VipId: data.VipId,
         MatchBillId: data.BillId,
         Remark: data.Remark,
         RewardName: RewardName,
         RewardIntegral: data.RewardIntegral,
         ContestQty: data.ContestQty,
         IsSms: 0
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(SNG_SUBMIT_REWARD, { data });
         },
         sendData
      );
   },
   sngCancelRewardVip({ commit }, data) {
      // SNG取消奖励(按会员)
      let userInfo = getUserInfo();
      let sendData = {
         InterfaceCode: "920201010H",
         CompanyId: userInfo.CompanyID,
         ShopId: getHomeData().shop.ID,
         UserId: "",
         IsSms: 0,
         VipId: data.VipId,
         MatchBillId: data.BillId
      };

      commonSend.commonSend(
         "get",
         data => {
            commit(SNG_CANCEL_VIP_REWARD, { data });
         },
         sendData
      );
   }
};

// mutations
const mutations = {
   [SAVE_SNG_GAME](state, { data }) {
      state.saveSngGameState = data;
   },
   [SNG_CANCEL_GAME](state, { data }) {
      state.sngCancelGameState = data;
   },
   [SNG_EXIT_GAME](state, { data }) {
      state.sngExitGameState = data;
   },
   [SNG_CANCEL_VIP_REWARD](state, { data }) {
      state.sngCancelVipRewardState = data;
   },
   [EDIT_SNG_GAME](state, { data }) {
      state.sngEditGameState = data;
   },
   [SNG_START_SIGNUP](state, { data }) {
      state.sngStartSignUpState = data;
   },
   [SNG_SUBMIT_REWARD](state, { data }) {
      state.sngSubmitRewardState = data;
   }
};

export default {
   state,
   getters,
   actions,
   mutations
};
