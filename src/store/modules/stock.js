/**
 * 库存管理
 *
 * ***/

import commonSend from "@/api/api";
import {
   GET_WAREHOUSING_REPORT,
   GET_SALE_CENSUS_REPORT,
   GET_Allocation_REPORT,
   GET_Inventory_REPORT,
   GET_STOCK_DETAILS,
   GET_STOCK_TOTAl,
   EXPORT_WAREHOUSING_REPORT,
   UPLOAD_STOCK_STATE,
   BILLID_DETAILS_CHECK
} from "@/store/mutation-types";
import { getUserInfo, getHomeData } from "@/api/index";

// init state
const state = {
   getCaiGouReportState: {},
   getSaleCensusReportState: {},
   getAllocationReportState: {},
   getInventoryReportState: {},
   CaiGouReportList: [],
   SaleCensusReportList: [],
   AllocationReportList: [],
   InventoryReportList: [],
   stockDetailsState: {},
   stockTotalState: {},
   exportWarehousingRbort: {},
   uploadStockState: {},
   billIdDetailsCheckState: {}
};

// getters
const getters = {
   billIdDetailsCheckState: state => state.billIdDetailsCheckState,
   uploadStockState: state => state.uploadStockState,
   getCaiGouReportState: state => state.getCaiGouReportState,
   getSaleCensusReportState: state => state.getSaleCensusReportState,
   getAllocationReportState: state => state.getAllocationReportState,
   getInventoryReportState: state => state.getInventoryReportState,
   CaiGouReportList: state => state.CaiGouReportList,
   SaleCensusReportList: state => state.SaleCensusReportList,
   AllocationReportList: state => state.AllocationReportList,
   InventoryReportList: state => state.InventoryReportList,
   stockDetailsState: state => state.stockDetailsState,
   stockTotalState: state => state.stockTotalState,
   exportWarehousingRbort: state => state.exportWarehousingRbort
};

// actions
const actions = {
   GetWarehousingReport({ commit }, data) {
      // 采购统计
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021251_1",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: data.ShopId,
         BeginDate: data.dateChoose[0],
         EndDate: data.dateChoose[1],
         PN: data.PN,
         Filter: data.Filter,
         SupplierId: data.SupplierId,
         TypeId: data.TypeId
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_WAREHOUSING_REPORT, { data });
         },
         sendData
      );
   },

   getExportcaiGouData({ commit }, data) {
      // 采购统计导出
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021434",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: data.ShopId,
         BeginDate: data.dateChoose[0],
         EndDate: data.dateChoose[1],
         PN: data.PN,
         Filter: data.Filter,
         SupplierId: data.SupplierId,
         TypeId: data.TypeId
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(EXPORT_WAREHOUSING_REPORT, { data });
         },
         sendData
      );
   },

   GetSaleCensusReport({ commit }, data) {
      //销售统计
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "91031011",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: data.ShopId,
         BeginDate: data.dateChoose[0],
         EndDate: data.dateChoose[1],
         FN: data.PN,
         Filter: data.Filter,
         SaleEmpId: data.SaleEmpId,
         Brand: data.Brand,
         TypeId: data.TypeId
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_SALE_CENSUS_REPORT, { data });
         },
         sendData
      );
   },
   getAllocationReport({ commit }, data) {
      // 调拨统计
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021261_1",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: data.ShopId,
         BeginDate: data.dateChoose[0],
         EndDate: data.dateChoose[1],
         PN: data.PN,
         Filter: data.Filter,
         Brand: "",
         TypeId: data.TypeId
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_Allocation_REPORT, { data });
         },
         sendData
      );
   },
   GetInventoryReport({ commit }, data) {
      // 盘点统计
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021271",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: data.ShopId,
         BeginDate: data.dateChoose[0],
         EndDate: data.dateChoose[1],
         PN: data.PN,
         Filter: data.Filter,
         Brand: "",
         TypeId: data.TypeId
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_Inventory_REPORT, { data });
         },
         sendData
      );
   },
   uploadStockExcel({ commit }, data) {
      // 单据明细转id
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021281",
         CompanyId: homeInfo.shop.COMPANYID,
         GoodsList: data.GoodsList
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(UPLOAD_STOCK_STATE, { data });
         },
         sendData
      );
   },
   billdetailsCheck({ commit }, data) {
      //单据明细单条检测
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021282",
         CompanyId: homeInfo.shop.COMPANYID,
         Code: data.GOODSCODE
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(BILLID_DETAILS_CHECK, { data });
         },
         sendData
      );
   },
   GetStockDetails({ commit }, data) {
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021245",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: data.ShopId,
         TypeId: data.TypeId,
         Filter: data.Filter,
         PN: data.PN
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_STOCK_DETAILS, { data });
         },
         sendData
      );
   },
   GetStockTotal({ commit }, data) {
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021244",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: data.ShopId,
         TypeId: data.TypeId,
         Filter: data.Filter,
         PN: data.PN
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_STOCK_TOTAl, { data });
         },
         sendData
      );
   }
};

// mutations
const mutations = {
   [BILLID_DETAILS_CHECK](state, { data }) {
      state.billIdDetailsCheckState = data;
   },
   [UPLOAD_STOCK_STATE](state, { data }) {
      state.uploadStockState = data;
   },
   [GET_STOCK_TOTAl](state, { data }) {
      state.stockTotalState = data;
   },
   [GET_STOCK_DETAILS](state, { data }) {
      state.stockDetailsState = data;
   },
   [GET_WAREHOUSING_REPORT](state, { data }) {
      if (data.success) {
         state.CaiGouReportList = [...data.data.PageData.DataArr];
      }
      state.getCaiGouReportState = Object.assign({}, data);
   },
   [EXPORT_WAREHOUSING_REPORT](state, { data }) {
      if (data.success) {
         state.exportWarehousingRbort = [...data.data.List];
      }
   },
   [GET_SALE_CENSUS_REPORT](state, { data }) {
      if (data.success) {
         state.SaleCensusReportList = [...data.data.PageData.DataArr];
      }
      state.getSaleCensusReportState = Object.assign({}, data);
   },
   [GET_Allocation_REPORT](state, { data }) {
      console.log(data)
      if (data.success) {
         state.AllocationReportList = [...data.data.PageData.DataArr];
      }
      state.getAllocationReportState = Object.assign({}, data);
   },
   [GET_Inventory_REPORT](state, { data }) {
      if (data.success) {
         state.InventoryReportList = [...data.data.PageData.DataArr];
      }
      state.getInventoryReportState = Object.assign({}, data);
   }
};

export default {
   state,
   getters,
   actions,
   mutations
};
