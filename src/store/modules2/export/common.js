/**
 * 公共导出 - 分页导出 - 接口处理
 *
 * ***/

import commonSend from "@/api/api";
import { EXPORT_COMMON } from "@/store/mutation-types";
import { getUserInfo, getHomeData } from "@/api/index";
import { exportDataFun } from "./theData.js";
let selected = {};

// init state
const state = {
   commonExportState: {}
};

// getters
const getters = {
   commonExportState: state => state.commonExportState
};

// actions
const actions = {
   getExportData({ commit }, { index, data }) {
      let sendData = exportDataFun(index, data);
      selected.index = index;
      commonSend.commonSend(
         "get",
         data => {
            commit(EXPORT_COMMON, { data });
         },
         sendData
      );
   }
};

// mutations
const mutations = {
   [EXPORT_COMMON](state, { data }) {
      let pageData = null,
         arr = [];
      if (data.success) {
         arr = [...data.data.PageData.DataArr];
         pageData = Object.assign({}, data.data.PageData);
      }
      state.commonExportState = Object.assign({ paying: pageData, List: arr }, data, selected);
      selected = {};
   }
};

export default {
   state,
   getters,
   actions,
   mutations
};
