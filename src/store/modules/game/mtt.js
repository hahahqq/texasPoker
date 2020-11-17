import commonSend from "@/api/api";
import {
   SAVE_MTT_GAME,
   MTT_CANCEL_GAME,
   MTT_EXIT_GAME,
   EDIT_MTT_GAME,
   MTT_START_SIGNUP,
   MTT_CANCEL_VIP_REWARD,
   MTT_SUBMIT_REWARD
} from "@/store/mutation-types";
import { getUserInfo, getHomeData } from "@/api/index";

// init state
const state = {
   saveMttGameState: {},
   mttCancelGameState: {},
   mttExitGameState: {},
   mttEditGameState: {},
   mttStartSignUpState: {},
   mttCancelVipRewardState: {},
   mttSubmitRewardState: {}
};

// getters
const getters = {
   saveMttGameState: state => state.saveMttGameState,
   mttCancelGameState: state => state.mttCancelGameState,
   mttExitGameState: state => state.mttExitGameState,
   mttEditGameState: state => state.mttEditGameState,
   mttStartSignUpState: state => state.mttStartSignUpState,
   mttCancelVipRewardState: state => state.mttCancelVipRewardState,
   mttSubmitRewardState: state => state.mttSubmitRewardState
};

// actions
const actions = {
   saveMttGame({ commit }, data) {
      // MTT增加比赛
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
         InterfaceCode: "920201012",
         CompanyId: userInfo.CompanyID,
         ShopId: getHomeData().shop.ID,
         UserId: "",
         EventId: data.EventId,
         DeskId: data.DeskId,
         IsOnLine: data.IsOnLine,
         PlayTime: data.PlayTime,
         Remark: data.Remark,
         RewardList: JSON.stringify(newArr),
         RewardType: data.RewardType,
         Name: data.Name,
         ChargesType: data.ChargesType,
         ChargesMoney: data.ChargesMoney,
         ChargesRate: data.ChargesRate,
         ChipsQty: data.ChipsQty,
         BuyinMoney: data.BuyinMoney,
         ChipsQty2: data.ChipsQty2 ? data.ChipsQty2 : 0, // Rebuy记分牌
         ChipsQty3: data.ChipsQty3 ? data.ChipsQty3 : 0, // Addon记分牌
         RebuyMoney: data.RebuyMoney ? data.RebuyMoney : 0,
         AddonMoney: data.AddonMoney ? data.AddonMoney : 0,
         BuyinCanQty: -1,
         RebuyCanQty: -1,
         AddonCanQty: -1,
         IsControlMtt: 0 // 是否控制MTT流程
      };

      commonSend.commonSend(
         "get",
         data => {
            commit(SAVE_MTT_GAME, { data });
         },
         sendData
      );
   },
   mttCancelOrGameOver({ commit }, data) {
      // MTT取消比赛  0 : 取消比赛  1：比赛结束
      let userInfo = getUserInfo();
      let sendData = {
         InterfaceCode: data.Type == 0 ? "920201012F" : "920201012E",
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
            commit(MTT_CANCEL_GAME, { data });
         },
         sendData
      );
   },
   mttExitGame({ commit }, data) {
      // MTT退出比赛
      let userInfo = getUserInfo();
      let sendData = {
         InterfaceCode: "920201012C",
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
            commit(MTT_EXIT_GAME, { data });
         },
         sendData
      );
   },
   editMttGame({ commit }, data) {
      // 修改mtt比赛
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
         InterfaceCode: "920201013",
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
         RewardType: data.RewardType,
         Name: data.Name,
         ChargesType: data.ChargesType,
         ChargesMoney: data.ChargesMoney,
         ChargesRate: data.ChargesRate,
         ChipsQty: data.ChipsQty,
         BuyinMoney: data.BuyinMoney,
         ChipsQty2: data.ChipsQty2 ? data.ChipsQty2 : 0, // Rebuy记分牌
         ChipsQty3: data.ChipsQty3 ? data.ChipsQty3 : 0, // Addon记分牌
         RebuyMoney: data.RebuyMoney ? data.RebuyMoney : 0,
         AddonMoney: data.AddonMoney ? data.AddonMoney : 0,
         BuyinCanQty: -1,
         RebuyCanQty: -1,
         AddonCanQty: -1,
         IsControlMtt: 0 // 是否控制MTT流程
      };

      commonSend.commonSend(
         "get",
         data => {
            commit(EDIT_MTT_GAME, { data });
         },
         sendData
      );
   },
   mttStartSignUp({ commit }, data) {
      // mtt 比赛报名
      let userInfo = getUserInfo();
      let sendData = {
         InterfaceCode: "920201012A",
         UserId: "",
         VipId: data.VipId,
         BillId: data.BillId,
         Remark: "",
         IsSms: 0,
         DiscountMoney: data.DiscountMoney,
         BuyinMoney: data.BuyinMoney,
         Payintegral: data.Payintegral,
         BuyType: data.BuyType == 0 ? "BuyIn" : data.BuyType == 1 ? "Rebuy" : "AddOn",
         Qty: data.Qty
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(MTT_START_SIGNUP, { data });
         },
         sendData
      );
   },
   mttSubmitReward({ commit }, data) {
      // MTT领取奖励
      let name = data.RewardName.substr(1)
      let RewardName = name.substr(0, name.length - 1); // 去掉名次中的 “第”、“名”

      let userInfo = getUserInfo();
      let sendData = {
         InterfaceCode: "920201012D",
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
            commit(MTT_SUBMIT_REWARD, { data });
         },
         sendData
      );
   },
   mttCancelRewardVip({ commit }, data) {
      // MTT取消奖励(按会员)
      let userInfo = getUserInfo();
      let sendData = {
         InterfaceCode: "920201012H",
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
            commit(MTT_CANCEL_VIP_REWARD, { data });
         },
         sendData
      );
   }
};

// mutations
const mutations = {
   [SAVE_MTT_GAME](state, { data }) {
      state.saveMttGameState = data;
   },
   [MTT_CANCEL_GAME](state, { data }) {
      state.mttCancelGameState = data;
   },
   [MTT_EXIT_GAME](state, { data }) {
      state.mttExitGameState = data;
   },
   [MTT_CANCEL_VIP_REWARD](state, { data }) {
      state.mttCancelVipRewardState = data;
   },
   [EDIT_MTT_GAME](state, { data }) {
      state.mttEditGameState = data;
   },
   [MTT_START_SIGNUP](state, { data }) {
      state.mttStartSignUpState = data;
   },
   [MTT_SUBMIT_REWARD](state, { data }) {
      state.mttSubmitRewardState = data;
   }
};

export default {
   state,
   getters,
   actions,
   mutations
};
