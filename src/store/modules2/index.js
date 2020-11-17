import commonSend from "@/api/api";
// import { GET_LIST, ACTIONS_STATE } from "@/store/mutation-types";
import * as types from "@/store/mutation-types";
let selected = {};
let listdata = {
   paying: {
      TotalNumber: 0,
      PageNumber: 0,
      PageSize: 20,
      PN: 0
   },
   List: []
};

// init state
const state = {
   actionsDataState: {},
   commonListState: {
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      },
      List: []
   },
   cReportDataState: {
      management: {},
      balance: {},
      cashier: {},
      matchItem: {},
      hour: {},
      week: {},
      sale: {},
      member: {},
      memberRegChart: {},
      managementA: Object.assign({}, listdata),
      managementB: Object.assign({}, listdata),
      managementC: Object.assign({}, listdata),
      managementD: Object.assign({}, listdata),
      managementE: Object.assign({}, listdata),
      managementF: Object.assign({}, listdata),
      balanceA: Object.assign({}, listdata),
      balanceB: Object.assign({}, listdata),
      balanceC: Object.assign({}, listdata),
      balanceD: Object.assign({}, listdata),
      balanceE: Object.assign({}, listdata),
      balanceF: Object.assign({}, listdata),
      balanceG: Object.assign({}, listdata),
      match: Object.assign({}, listdata),
      matchProList: Object.assign({}, listdata),
      matchCheckIn: Object.assign({}, listdata),
      fast: Object.assign({}, listdata),
      saleItem: Object.assign({}, listdata),
      goods: Object.assign({}, listdata),
      goodsItem: Object.assign({}, listdata),
      shop: Object.assign({}, listdata),
      memberRegister: Object.assign({}, listdata),
      memberRegisterItem: Object.assign({}, listdata),
      memberRecharge: Object.assign({}, listdata),
      memberAward: Object.assign({}, listdata),
      goodsSale: Object.assign({}, listdata),
      goodsSaleA: Object.assign({}, listdata),
      goodsSaleB: Object.assign({}, listdata),
      goodsSaleC: Object.assign({}, listdata),
      adjust: Object.assign({}, listdata),
      award: Object.assign({}, listdata)
   }
};

// getters
const getters = {
   actionsDataState: state => state.actionsDataState,
   commonListState: state => state.commonListState,
   cReportDataState: state => state.cReportDataState
};

// actions
const actions = {
   getList({ commit }, { type, sendData }) {
      if (!type) return;
      selected = {
         type: type,
         Mut: "GET_LIST_" + type
      };
      commonSend.commonSend2(
         "get",
         data => {
            commit(types[data.selected.Mut], { data });
         },
         { selected, sendData }
      );
   },
   actionsData({ commit }, { type, sendData }) {
      if (!type) return;
      selected = {
         type: type,
         Mut: "ACTIONS_STATE_" + type
      };
      commonSend.commonSend2(
         "get",
         data => {
            commit(types[data.selected.Mut], { data });
         },
         { selected, sendData }
      );
   }
};

// mutations
const cReporDealData_Fun = function(type, mutName, state, data) {
   if (type == 1) {
      let pageData = Object.assign({}, state.cReportDataState[mutName].paying),
         arr = [];
      if (data.success) {
         pageData = Object.assign(pageData, data.data.PageData);
         arr = [...pageData.DataArr];
      }
      state.cReportDataState[mutName] = Object.assign({}, data, {
         paying: pageData,
         List: arr,
         type: selected.type
      });
   } else {
      state.cReportDataState[mutName] = Object.assign({}, data, selected);
   }
   selected = {};
};
const mutations = {
   [types.ACTIONS_STATE_management](state, { data }) {
      let mutName = "management";
      cReporDealData_Fun(2, mutName, state, data);
   },
   [types.GET_LIST_managementA](state, { data }) {
      let mutName = "managementA";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_managementB](state, { data }) {
      let mutName = "managementB";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_managementC](state, { data }) {
      let mutName = "managementC";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_managementD](state, { data }) {
      let mutName = "managementD";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_managementE](state, { data }) {
      let mutName = "managementE";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_managementF](state, { data }) {
      let mutName = "managementF";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.ACTIONS_STATE_balance](state, { data }) {
      let mutName = "balance";
      cReporDealData_Fun(2, mutName, state, data);
   },
   [types.GET_LIST_balanceA](state, { data }) {
      let mutName = "balanceA";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_balanceB](state, { data }) {
      let mutName = "balanceB";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_balanceC](state, { data }) {
      let mutName = "balanceC";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_balanceD](state, { data }) {
      let mutName = "balanceD";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_balanceE](state, { data }) {
      let mutName = "balanceE";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_balanceF](state, { data }) {
      let mutName = "balanceF";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_balanceG](state, { data }) {
      let mutName = "balanceG";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.ACTIONS_STATE_cashier](state, { data }) {
      let mutName = "cashier";
      cReporDealData_Fun(2, mutName, state, data);
   },
   [types.GET_LIST_match](state, { data }) {
      let mutName = "match";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.ACTIONS_STATE_matchItem](state, { data }) {
      let mutName = "matchItem";
      cReporDealData_Fun(2, mutName, state, data);
   },
   [types.GET_LIST_matchProList](state, { data }) {
      let mutName = "matchProList";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_matchCheckIn](state, { data }) {
      let mutName = "matchCheckIn";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.ACTIONS_STATE_hour](state, { data }) {
      let mutName = "hour";
      cReporDealData_Fun(2, mutName, state, data);
   },
   [types.ACTIONS_STATE_week](state, { data }) {
      let mutName = "week";
      cReporDealData_Fun(2, mutName, state, data);
   },
   [types.GET_LIST_fast](state, { data }) {
      let mutName = "fast";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.ACTIONS_STATE_sale](state, { data }) {
      let mutName = "sale";
      cReporDealData_Fun(2, mutName, state, data);
   },
   [types.GET_LIST_saleItem](state, { data }) {
      let mutName = "saleItem";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_goods](state, { data }) {
      let mutName = "goods";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_goodsItem](state, { data }) {
      let mutName = "goodsItem";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_shop](state, { data }) {
      let mutName = "shop";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.ACTIONS_STATE_member](state, { data }) {
      let mutName = "member";
      cReporDealData_Fun(2, mutName, state, data);
   },
   [types.ACTIONS_STATE_memberRegChart](state, { data }) {
      let mutName = "memberRegChart";
      cReporDealData_Fun(2, mutName, state, data);
   },
   [types.GET_LIST_memberRegister](state, { data }) {
      let mutName = "memberRegister";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_memberRegisterItem](state, { data }) {
      let mutName = "memberRegisterItem";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_memberRecharge](state, { data }) {
      let mutName = "memberRecharge";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_memberAward](state, { data }) {
      let mutName = "memberAward";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_goodsSale](state, { data }) {
      let mutName = "goodsSale";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_goodsSaleA](state, { data }) {
      let mutName = "goodsSaleA";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_goodsSaleB](state, { data }) {
      let mutName = "goodsSaleB";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_goodsSaleC](state, { data }) {
      let mutName = "goodsSaleC";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_adjust](state, { data }) {
      let mutName = "adjust";
      cReporDealData_Fun(1, mutName, state, data);
   },
   [types.GET_LIST_award](state, { data }) {
      let mutName = "award";
      cReporDealData_Fun(1, mutName, state, data);
   }
};

export default {
   state,
   getters,
   actions,
   mutations
};
