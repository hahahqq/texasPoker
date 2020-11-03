/**
 * 商品类别
 *
 * ***/
import commonSend from "@/api/api";
import { getUserInfo, setHomeData, getHomeData } from "@/api/index";
import {
   GET_CATEGORY_LIST,
   GET_CATEGORY_ITEM,
   DEAL_CATEGORY_ITEM,
   GOODS_LIST2
} from "@/store/mutation-types";
let selected = {};

// initial state
const state = {
   categoryListState: {
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      }
   },
   categoryList: [],
   categoryState: [],
   selcategory: {},
   categoryItem: {},
   dealCategoryState: {},
   goodsListState2: {
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      }
   },
   goodsList2: []
};

// getters
const getters = {
   categoryListState: state => state.categoryListState,
   categoryList: state => state.categoryList,
   categoryState: state => state.categoryState,
   selcategory: state => state.selcategory,
   categoryItem: state => state.categoryItem,
   dealCategoryState: state => state.dealCategoryState,
   goodsListState2: state => state.goodsListState2,
   goodsList2: state => state.goodsList2
};

// actions
const actions = {
   getCategoryList({ commit }) {
      let userInfo = getUserInfo();
      let pn = parseInt(state.categoryListState.paying.PN) + 1;
      let sendData = {
         InterfaceCode: 21002030104,
         PID: "",
         PN: pn
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_CATEGORY_LIST, { data });
         },
         sendData
      );
   },
   getCategoryItem({ commit }, id) {
      let userInfo = getUserInfo();
      let sendData = {
         InterfaceCode: 60102010712,
         CompanyId: userInfo.CompanyID,
         ID: id
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_CATEGORY_ITEM, { data });
         },
         sendData
      );
   },

   dealCategoryItem({ commit }, data) {
      let userInfo = getUserInfo();
      let sendData = {
         InterfaceCode: 21002030107,
         CompanyId: data.COMPANYID ? data.COMPANYID : userInfo.CompanyID,
         Name: data.Name,
         PID: "",
         Remark: data.Remark
      };
      selected.type = "add";
      if (data.ID) {
         sendData.ID = data.ID;
         selected.type = "edit";
         selected.data = Object.assign({}, data);
      } else {
         selected.data = Object.assign({}, sendData);
         delete selected.data.InterfaceCode;
      }
      commonSend.commonSend(
         "get",
         data => {
            commit(DEAL_CATEGORY_ITEM, { data });
         },
         sendData
      );
   },
   delCategoryItem({ commit }, data) {
      let userInfo = getUserInfo();
      let sendData = {
         InterfaceCode: 21002030108,
         CompanyId: userInfo.CompanyID,
         ID: data.data.ID
      };
      selected.type = "del";
      selected.idnex = data.index;
      selected.data = Object.assign({}, data.data);
      commonSend.commonSend(
         "get",
         data => {
            commit(DEAL_CATEGORY_ITEM, { data });
         },
         sendData
      );
   },
   choosingCategory({ commit }, item) {
      setHomeData({ category: item });
   },
   selectingCategory({ state }, data) {
      state.selcategory = Object.assign({}, data);
   },
   clearCategoryAll({ state }) {
      state.categoryListState = {};
      state.categoryList = [];
      state.selcategory = {};
      state.categoryItem = {};
      state.goodsListState2 = {}
      state.goodsList2 = [];
   },
   getGoodsList2({ commit, state }, data) {
      let homeInfo = getHomeData();
      let pn = parseInt(state.goodsListState2.paying.PN) + 1;
      let sendData = {
         InterfaceCode: 60102010721,
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: homeInfo.shop.ID,
         Filter: data.Filter,
         status: 1,
         Mode: data.Mode, // -1=all  0=商品 1=服务
         TypeID: data.TypeID ? data.TypeID : "", //商品类别ID
         DescType: 0,
         IsGift: -1, // -1=all  1=是 0=否
         IsEmpMoney: -1,
         isReturnvisit: -1,
         IsCycle: -1,
         PN: data.PN ? data.PN : pn
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GOODS_LIST2, { data });
         },
         sendData
      );
   }
};

// mutations
const mutations = {
   [GET_CATEGORY_LIST](state, { data }) {
      let pageData = Object.assign({}, state.categoryListState.paying);
      if (data.success) {
         state.categoryList = [...data.data.PageData.DataArr];
         pageData = Object.assign(pageData, data.data.PageData);
      }
      console.log("5555555555555555555");
      console.log(state.categoryList);
      state.categoryListState = Object.assign({}, data, { paying: pageData });
   },
   [GET_CATEGORY_ITEM](state, { data }) {
      if (data.success) {
         state.categoryItem = Object.assign({}, data.data.obj);
      }
      state.categoryState = Object.assign({}, data);
   },
   [DEAL_CATEGORY_ITEM](state, { data }) {
      if (data.success) {
         if (selected.type == "edit") {
            let index = state.categoryList.findIndex(obj =>
               Object.is(parseInt(selected.data.ID), parseInt(obj.ID))
            );
            for (let key in selected.data) {
               let kk = key.toUpperCase();
               state.categoryList[index][kk] = selected.data[key];
            }
         }
         if (selected.type == "add") {
            // let item = Object.assign({},selected.data,{Id:data.data.OutId})
            state.categoryList = [];
         }
         if (selected.type == "del") {
            let index = state.categoryList.findIndex(obj =>
               Object.is(parseInt(selected.data.ID), parseInt(obj.ID))
            );
            state.categoryList.splice(index, 1);
         }
         state.categoryListState.paying.PN = 0;
      }
      state.dealCategoryState = Object.assign({}, data);
      selected = {};
   },
   [GOODS_LIST2](state, { data }) {
      let pageData = Object.assign({}, state.goodsListState2.paying);
      if (data.success) {
         state.goodsList2 = [...data.data.PageData.DataArr];
         pageData = Object.assign(pageData, data.data.PageData);
      }
      state.goodsListState2 = Object.assign({}, data, { paying: pageData });
   }
};

export default {
   state,
   getters,
   actions,
   mutations
};
