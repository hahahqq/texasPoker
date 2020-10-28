
/**
 * 商品
 *
 * ***/
import commonSend from '@/api/api'
import {
  GOODS_LIST,
  GOODS_LIST3,
  GOODS_LIST4,
  GOODS_LIST_NEW,
  GOODS_ITEM, GOODS_ITEM2,
  DEAL_GOODS,
  GOODS_EXPORTDATA, GOODS_IMPORTDATA,
  SET_GOODS_MOVING,
  GET_GOODS_INVENTORY,
  GET_GOODS_SETMEALG,
  GET_GOODS_SETMEALGSAVE,
  GET_GOODS_SETMEALGDETAILS,
  GET_GOODS_DELETE,
  GOODS_CODE,
  PUT_RETRIEVAL_DATA,
  GET_WAREHOUSING_BILLID,
} from '@/store/mutation-types'
import { getUserInfo, getHomeData } from '@/api/index'
let selected = {}

// init state
const state = {
  goodsState: {},
  goodsListState: {
    paying: {
      "TotalNumber": 0,
      "PageNumber": 0,
      "PageSize": 20,
      "PN": 0,
    }
  },
  goodsListState3:{ paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  }},
  goodsListState4:{ paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  }},
  goodsListNewState: {
    paying: {
      "TotalNumber": 0,
      "PageNumber": 0,
      "PageSize": 20,
      "PN": 0,
    }
  },
  goodsList: [],
  goodsListNew: [],
  goodsItem: {},
  exportGoodsState: {},
  importGoodsState: {},
  goodsMovingState: {},
  goodsInventoryList: [],
  goodsInventoryListState: {
    paying: {
      "TotalNumber": 0,
      "PageNumber": 0,
      "PageSize": 20,
      "PN": 0,
    },
    List: []
  },
  selgoods: {},
  goodsstemaealgState: {},
  goodsstemaealgsaveState: {},
  goodsstemaealgdetailsState: {},
  goodsdeleteState: {},
  OnlyOneGoodsState:[],
  retrievalState:{},
  goodsCode:{},
  goodsList3:[],
  goodsList4:[],
  getWarehousingBillid:{},
}

// getters
const getters = {
  goodsState: state => state.goodsState,
  goodsListState: state => state.goodsListState,
  goodsListNewState: state => state.goodsListNewState,
  goodsList: state => state.goodsList,
  goodsListState3:state=>state.goodsListState3,
  goodsListState4:state=>state.goodsListState4,
  OnlyOneGoodsState: state=> state.OnlyOneGoodsState,
  goodsListNew: state => state.goodsListNew,
  goodsItem: state => state.goodsItem,
  exportGoodsState: state => state.exportGoodsState,
  importGoodsState: state => state.importGoodsState,
  goodsMovingState: state => state.goodsMovingState,
  goodsInventoryList: state => state.goodsInventoryList,
  goodsInventoryListState: state => state.goodsInventoryListState,
  selgoods: state => state.selgoods,
  goodsstemaealgState: state => state.goodsstemaealgState,
  goodsstemaealgsaveState: state => state.goodsstemaealgsaveState,
  goodsstemaealgdetailsState: state => state.goodsstemaealgdetailsState,
  goodsdeleteState: state => state.goodsdeleteState,
  retrievalState: state => state.retrievalState,
  goodsCode: state => state.goodsCode,
  goodsList3: state => state.goodsList3,
  goodsList4: state => state.goodsList4,
  getWarehousingBillid: state => state.getWarehousingBillid,
}

// actions
const actions = {
  getGoodsList({ commit, state }, data) {
    console.log("data.Status",data)
    if(data.Status.length<=0){
      data.Status='-1'
    }
    if(data.Mode.length<=0){
      data.Mode='-1'
    }
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let pn = parseInt(state.goodsListState.paying.PN) + 1;
    if (data.Filter &&
      state.goodsListState.paying.PageSize >= state.goodsListState.paying.TotalNumber) { pn = 1; }
    let sendData = {
      'InterfaceCode': 21002030101,
      'FilterStr':data.FilterStr,
      'PN': data.PN ? data.PN : pn,
      'status': data.Status !='-1' ? data.Status : '-1',
      'Mode': data.Mode !='-1' ? data.Mode : '-1', // -1=all  0=商品 1=服务
      'TypeID': data.TypeID ? data.TypeID : '', //商品类别ID
      'ShopId': homeInfo.shop.ID,
      'CompanyId': homeInfo.shop.COMPANYID
    };

    commonSend.commonSend('get', data => {
      commit(GOODS_LIST, { data })
    }, sendData)
  },
  getGoodsList3({commit, state}, data){
    let homeInfo = getHomeData();
    let sendData={
      'InterfaceCode':'21002030101_3',
      Filter:data.Filter,
      Mode: -1,
      TypeID: data.TypeID ? data.TypeID : '', //商品类别ID
      ShopId:homeInfo.shop.ID,
      PN: data.PN
    };
    commonSend.commonSend('get',data=>{
      commit(GOODS_LIST3,{data})
    },sendData)
  },

  getGoodsList4({commit, state}, data){ //商品积分接口
    let homeInfo = getHomeData();
    let sendData={
      'InterfaceCode':'21002030101_v2',
      FilterStr:'',
      PN: data.PN,
      status: 1, // -1=all  1=启用 0=停用
      Mode: -1,
      TypeID: data.TypeID ? data.TypeID : '', //商品类别ID
      ShopId:homeInfo.shop.ID,
      CompanyId: homeInfo.shop.COMPANYID,
      Isgift: 1, // -1=all  1=是 0=否
      OrderType:0,
      OrderStatus:1,
      DescType:0,
    };
    commonSend.commonSend('get',data=>{
      commit(GOODS_LIST4,{data})
    },sendData)
  },

  //生意通选择商品列表接口法
  getGoodsListNew({ commit }, data) {
    let homeInfo = getHomeData();
    let sendData = {
      InterfaceCode: '21002030101_3',
      Filter: data.Filter,
      Mode:0,
      TypeID: data.TypeID ? data.TypeID : '',
      ShopId: homeInfo.shop.ID,
      PN: data.PN,
      CompanyId : homeInfo.shop.COMPANYID,
    }
    commonSend.commonSend('get', data => {
      commit(GOODS_LIST_NEW, { data })
    }, sendData)
  },
  getGoodsItem({ commit }, item) {
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': 21002030102,
      'ShopId': homeInfo.shop.ID,
      ID: item.ID
    }
    commonSend.commonSend('get', data => {
      commit(GOODS_ITEM, { data })
    }, sendData)
  },
  getGoodssetmealg({ commit, state }, item) {
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': 60102010734,
      'ID': item.ID,
      'CompanyId': homeInfo.shop.COMPANYID,
    }
    commonSend.commonSend('get', data => {
      commit(GET_GOODS_SETMEALG, { data })
    }, sendData)
  },

  getGoodsdelete({ commit, state }, item) {
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': 21002030111,
      'GoodsId': item.ID,
      'CompanyId': homeInfo.shop.COMPANYID,
      'CheckDel':1
    }
    commonSend.commonSend('get', data => {
      commit(GET_GOODS_DELETE, { data })
    }, sendData)
  },
  getGoodssetmealgsave({ commit, state }, data) {
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': 60102010733,
      'CompanyId': homeInfo.shop.COMPANYID,
      'ShopId': homeInfo.shop.ID,
    }
    if (data) {
      sendData = Object.assign({}, sendData, data)
    }
    commonSend.commonSend('get', data => {
      commit(GET_GOODS_SETMEALGSAVE, { data })
    }, sendData)
  },

  getWarehousingBillid({ commit, state }, data) {
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': 210021205,
      'CompanyId': homeInfo.shop.COMPANYID,
      'ShopId': homeInfo.shop.ID,
    }
    // if (data) {
    //   sendData = Object.assign({}, sendData, data)
    // }
    commonSend.commonSend('get', data => {
      commit(GET_WAREHOUSING_BILLID, { data })
    }, sendData)
  },

  getGoodssetmealgdetails({ commit, state }, data) {
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': 60102010732,
      'CompanyId': homeInfo.shop.COMPANYID
    }
    if (data) {
      sendData = Object.assign({}, sendData, data)
    }
    commonSend.commonSend('get', data => {
      commit(GET_GOODS_SETMEALGDETAILS, { data })
    }, sendData)
  },
  //生意通新增商品
  addNewGoods({ commit, state }, { type, data }) {
    console.log("保存商品传积分",data)

    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': 21002030103,
      'Code': data.CODE,
      'Name': data.Name,
      Unitid: data.Unitid,
      Typeid: data.Typeid,
      Barcode: data.Barcode,
      Status: data.Status==1 ? 'True' : 'False',
      Price: data.Price ? data.Price : 0,
      Vipprice: data.VipPrice ? data.VipPrice : 0,
      Purprice: data.Purprice ? data.Purprice : 0,
      Integral:data.Integral,
      Iscalcortime:'',
      Remark: data.Remark,
      Isgift: data.Isgift==1 ? 'True' : 'False',
      Giftintegral: data.Giftintegral ? data.Giftintegral : 0,
      Pricetype:0,
      Minstocknumber:data.MinStockNumber,
      Maxstocknumber:0,
      Isstocktips:'Flase',
      Invalidday:0,
      Field1:'',
      Field2:'',
      Field3:'',
      Field4:'',
      Field5:'',
      GoodsMode: data.GoodsMode, // 0=商品   1=服务项目
      Specs:data.Specs,
      OrderNo:data.OrderNo,
      IsReturnVisit: data.IsReturnVisit ? 'True' : 'False',
      ReturnVisitDay: data.ReturnVisitDay,
      ServiceMinute: data.ServiceMinute,
      IsCycle: data.IsCycle ? 'True' : 'False',
      CycleDay: data.CycleDay,
      GoodsStock:'',
    };
    if (data.ID) {
      sendData.Id = data.ID
    }
    selected.type = type
    selected.data = Object.assign({}, sendData)
    commonSend.commonSend('get', data => {
      commit(DEAL_GOODS, { data })
    }, sendData)
  },
  editTheGoods({ commit, state }, data) {
    let homeInfo = getHomeData();
    console.log("库存预警",data.Minstocknumber)
    let sendData = {
      'InterfaceCode': '601020206',
      'VipID': data.id,
      VipCode: data.Code,
      VipName: data.Name,
      MobileNo: data.PhoneNo,
      Sex: data.Sex,
      ShopID: homeInfo.shop.ID,
      BirthDate: data.BirthDate ? data.BirthDate : 0,
      InvalidDate: data.InvalidDate,
      LevelID: data.LevelId,
      Password: data.Passwd,
      Status: data.STATUS ? data.STATUS : 0, // 0-正常 1-停用 2-挂失 3-换卡
      ShareVipID: '',
      SaleEmpIDL: '',
      Minstocknumber:data.MinStockNumber,
      address: data.Address,
      EMail: data.EMail ? data.EMail : '',
      Remark: data.Remark,
      VipFlag: data.VipFlag,
      OrderNo:data.OrderNo,
      Specs:data.Specs,
      IsUsePassWd: data.IsUsePassWd ? 1 : 0, // 0=不启用，1=启用
      'Height': data.Height ? parseInt(data.Height) : 0,
      'Weight': data.Weight ? parseInt(data.Weight) : 0,
      'formmode': ''
    };
    selected = Object.assign({}, sendData);
    commonSend.commonSend('get', data => {
      commit(DEAL_GOODS, { data })
    }, sendData)
  },
  getExportGoodsData({ commit }, data) {  // 导出
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': '21002030101_1',
      'ShopId': homeInfo.shop.ID,
      FilterStr: data.FilterStr,
      Mode: data.Mode, // -1=all  1=商品 0=服务
      TypeID: data.TypeID,
      status: data.Status // -1=all  1=上架 0=下架
    }
    commonSend.commonSend('get', data => {
      commit(GOODS_EXPORTDATA, { data })
    }, sendData)
  },
  getImportGoodsData({ commit }, arr) {  // 导入
    let homeInfo = getHomeData();
    // let GoodsDetaila = {}
    //   for (let i = 0; i < arr.length; i++) {
    //     GoodsDetaila[i] = arr[i]
    //   }
    let sendData = {
      InterfaceCode: '21002030101_2',
      'ShopID': homeInfo.shop.ID,
      'List': JSON.stringify(arr)
    }
    commonSend.commonSend('post', data => {
      commit(GOODS_IMPORTDATA, { data })
    }, sendData);
  },
  getGoodsInventory({ commit }, data) { // 商品出库入库记录
    let homeInfo = getHomeData();
    let pn = parseInt(state.goodsInventoryListState.paying.PN) + 1;
    let sendData = {
      'InterfaceCode': 21002030210,
      'ShopId': homeInfo.shop.ID,
      PN: data.PN ? data.PN : pn,
      GoodsId: data.ID,
    }
    commonSend.commonSend('get', data => {
      commit(GET_GOODS_INVENTORY, { data })
    }, sendData)
  },
  setGoodsMoving({ commit }, data) { // 商品出库入库 新增
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': 21002030203,
      'ShopId': homeInfo.shop.ID,
      GoodsId: data.id,
      Qty: data.QTY,
      BillType: data.BillType,  // 1=进货，2=退货，3=丢损 4=调整 5=调拨
      'EmpId': userInfo.UserID,
      Remark: data.Remark,
      movemode: data.movemode // -1=出 1=进
    }
    commonSend.commonSend('get', data => {
      commit(SET_GOODS_MOVING, { data })
    }, sendData)
  },
  getGoodsCode({ commit }, data) {
    let sendData = {
      'InterfaceCode': '2100127_11',
    }
    commonSend.commonSend('get', data => {
      commit(GOODS_CODE, { data })
    }, sendData)
  },
  selectingGoods({ state }, data) {
    state.selgoods = Object.assign({}, data)
  },
  clearGoodsAll({ state }) {
    state.goodsListState.paying.PN = 0
    state.goodsListState3.paying.PN = 0
    state.goodsList = []
    state.goodsList3=[]
    state.goodsItem = {}
    state.goodsMovingState = {}
    state.goodsInventoryList = []
    state.goodsInventoryListState.paying.PN = 0
    state.selgoods = {}
  },
  clearGoods1({ state }) {
    state.selgoods = {}
  }
}

// mutations
const mutations = {
  [GOODS_LIST](state, { data }) {
    console.log("能来到这里吗111111111111")
    let pageData = Object.assign({}, state.goodsListState.paying);
    if (data.success) {
      state.goodsList = [...data.data.PageData.DataArr];
      pageData = Object.assign(pageData, data.data.PageData)
    }
    state.goodsListState = Object.assign({}, data, { 'paying': pageData });
  },
  [GOODS_LIST_NEW](state, { data }) {
    console.log("能来到这里吗")
    let pageData = Object.assign({}, state.goodsListNewState.paying);
    if (data.success) {
      state.goodsListNew = [...data.data.PageData.DataArr];
      pageData = Object.assign(pageData, data.data.PageData)
    }
    state.goodsListNewState = Object.assign({}, data, { 'paying': pageData });
  },
  [GOODS_ITEM](state, { data }) {
    if (data.success) {
      state.goodsItem = Object.assign({}, data.data.obj)
    }
    state.goodsState = Object.assign({}, data)
  },
  [GET_GOODS_SETMEALG](state, { data }) {
    state.goodsstemaealgState = Object.assign({}, data)
  },
  [GET_GOODS_DELETE](state, { data }) {
    state.goodsdeleteState = Object.assign({}, data)
  },
  [GET_GOODS_SETMEALGSAVE](state, { data }) {
    state.goodsstemaealgsaveState = Object.assign({}, data)
  },

  [GET_WAREHOUSING_BILLID](state, { data }) {
    state.getWarehousingBillid = Object.assign({}, data.data)
  },

  [GET_GOODS_SETMEALGDETAILS](state, { data }) {
    state.goodsstemaealgdetailsState = Object.assign({}, data)
  },
  [GOODS_ITEM2](state, { data }) {
    if (data.success) {
      state.goodsItem.profile = Object.assign({}, state.goodsItem.profile, { total: data.data })
    }
    state.goodsState = Object.assign({}, data)
  },
  [DEAL_GOODS](state, { data }) {
    if (data.success) {
      state.goodsListState.paying.PN = 0
    }
    state.goodsState = Object.assign({}, data);
    selected = {}
  },
  [GOODS_EXPORTDATA](state, { data }) { // 导出
    state.exportGoodsState = Object.assign({}, data);
  },
  [GOODS_IMPORTDATA](state, { data }) { // 导入
    state.importGoodsState = Object.assign({}, data);
  },
  [GET_GOODS_INVENTORY](state, { data }) {
    let pageData = Object.assign({}, state.goodsInventoryListState.paying);
    if (data.success) {
      state.goodsInventoryList = [...data.data.PageData.DataArr];
      pageData = Object.assign(pageData, data.data.PageData)
    }
    state.goodsInventoryListState = Object.assign({}, data, { 'paying': pageData });
  },
  [SET_GOODS_MOVING](state, { data }) {
    state.goodsMovingState = Object.assign({}, data);
  },
  [GOODS_CODE](state, { data }) {
    state.goodsCode = Object.assign({}, data);
  },
  [GOODS_LIST3](state, {data}){
    if(data.success){
      console.log("5555555555555558",)
      state.goodsList3 = [...data.data.PageData];
      console.log(state.goodsList3)
    }
  },
  [GOODS_LIST4](state, {data}){
    let pageData = Object.assign({},state.goodsListState3.paying);
    if(data.success){
      state.goodsList4 = [...data.data.PageData.DataArr];
      pageData = Object.assign(pageData, data.data.PageData)
      let param = data.data.PageData.DataArr, newParam = []
      if(param.length >=1){
        for(let i in param){
          param[i].isEdit = false
          newParam.push(param[i])
        }
        state.OnlyOneGoodsState = newParam
      }else{
        state.OnlyOneGoodsState = []
      }
    }
    state.goodsListState4 = Object.assign({},data,{'paying':pageData})
  },
}


export default {
  state,
  getters,
  actions,
  mutations
}

