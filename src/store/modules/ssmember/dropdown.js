import commonSend from "@/api/api";
import { getUserInfo, setHomeData, getHomeData } from "@/api/index";
import { GET_SSMEMBERD_LIST, GET_SSMEMBERD_LIST1 } from "@/store/mutation-types";
let selected = {};

// initial state
const state = {
   ssmemberdListState: {},
   ssmemberdListState1: {},
   ssmemberopenID: ""
   // ssmemberdList: [],
};

// getters
const getters = {
   // ssmemberdList: state => state.ssmemberdList,
   ssmemberdListState: state => state.ssmemberdListState,
   ssmemberdListState1: state => state.ssmemberdListState1
};

// actions
const actions = {
   //生意通商品消费获取会员列表接口
   getSsmemberdList({ commit }, data) {
      let userInfo = getUserInfo();
      let homeInfo = getHomeData();
      let shopuserInfo = getHomeData().shop;
      //  let ShopId=data.Filter!='' ? '' :shopuserInfo.ID;
      let ShopId = shopuserInfo.ID;
      let sendData = {
         InterfaceCode: "9204051",
         ShopId: ShopId,
         CompanyId: homeInfo.shop.COMPANYID,
         Name: data.Filter,
         PN: 1,
         birthday: -1,
         PayCount: -1,
         LossVip: -1,
         Status: -1,
         Sex: -1
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_SSMEMBERD_LIST, { data });
         },
         sendData
      );
   },
   getSsmemberdList1({ commit }, data) {
      let userInfo = getUserInfo();
      let homeInfo = getHomeData();
      let shopuserInfo = getHomeData().shop;
      //  let ShopId=data.Filter!='' ? '' :shopuserInfo.ID;
      let ShopId = shopuserInfo.ID;
      let sendData = {
         InterfaceCode: "9204051",
         ShopId: ShopId,
         CompanyId: homeInfo.shop.COMPANYID,
         Name: data.Filter,
         PN: 1,
         birthday: -1,
         PayCount: -1,
         LossVip: -1,
         Status: -1,
         Sex: -1
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_SSMEMBERD_LIST1, { data });
         },
         sendData
      );
   }
};

// mutations
const mutations = {
   [GET_SSMEMBERD_LIST](state, { data }) {
      if (data.success) {
         state.ssmemberdListState = Object.assign({}, data);
      }
   },
   [GET_SSMEMBERD_LIST1](state, { data }) {
      if (data.success) {
         state.ssmemberdListState1 = Object.assign({}, data);
      }
   }
};

export default {
   state,
   getters,
   actions,
   mutations
};
