import commonSend from '@/api/api'
import { 
  ROOM_LIST,ROOM_LIST2, ROOM_ITEM,  DEAL_ROOM_ITEM,
  ROOM_AREA_LIST, DEAL_ROOM_AREA,
  DEAL_ROOMORDER, GET_ROOMORDER_LIST,  GET_ROOMORDER_ITEM,  ROOMORDER_STATE,  GET_ROOMORDER_TIME,
  PRINT_ROOMORDER,
  CANECL_ROOMORDER
} from '@/store/mutation-types'
import { getUserInfo,getHomeData } from '@/api/index'
let selected={}

// init state
const state = {
  roomList:[],
  roomList2:[],
  roomListState:{},
  roomItem:{},
  roomState:{type:'list'},
  selroom:[],
  thatRoomOrder:{},
  roomOrderState:{},
  roomOrderList:[],
  roomOrderList2:[],
  roomOrderListState:{
    paying:{
      "TotalNumber": 0,
      "PageNumber": 0,
      "PageSize": 20,
      "PN": 0,
    },
    List:[]
  },
  roomOrderItem:{},
  dealRoomOrder:{},
  roomOrderTime:{},
  roomAreaList:[],
  roomAreaListState:{},
  roomAreaState:{},
  printRoomOrderState:{},
  cancelRoomOrderState:{},
  selroomorder:{}
}

// getters
const getters = {
  roomList: state=>state.roomList,
  roomList2: state=>state.roomList2,
  roomListState: state=>state.roomListState,
  roomItem: state=>state.roomItem,
  roomState: state=>state.roomState,
  selroom: state=>state.selroom,
  thatRoomOrder: state=>state.thatRoomOrder,
  roomOrderState: state=>state.roomOrderState,
  roomOrderList: state=>state.roomOrderList,
  roomOrderListState: state=>state.roomOrderListState,
  roomOrderItem: state=>state.roomOrderItem,
  dealRoomOrder: state=>state.dealRoomOrder,
  roomOrderTime: state=>state.roomOrderTime,
  roomAreaList: state=>state.roomAreaList,
  roomAreaListState: state=>state.roomAreaListState,
  roomAreaState: state=>state.roomAreaState,
  printRoomOrderState: state=>state.printRoomOrderState,
  cancelRoomOrderState:state=>state.cancelRoomOrderState,
  selroomorder: state=>state.selroomorder
}

// actions
const actions = {
  getRoomAreaList({commit}, data) { 
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': 60102011401,
      'CompanyId':homeInfo.shop.COMPANYID,
      'ShopId': homeInfo.shop.ID,
      IsStop:data.Status,   //-1=全部，1=停用，0=启用
    }
    selected.type='list'
    commonSend.commonSend('get', data => {
      commit( ROOM_AREA_LIST, { data })
    }, sendData)
  },
  saveRoomArea({commit}, data) { 
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode':60102011402,
      'CompanyId':homeInfo.shop.COMPANYID,
      'ShopId': homeInfo.shop.ID,
      Name: data.Name,
      IsStop: data.Status?0:1, // 0=启用，1=停用
      DescNo: data.DescNo?data.DescNo:''
    }
    selected.type='add'
    if(data.Id){
      sendData.Id = data.Id;
      selected.type='edit'
    }
    commonSend.commonSend('get', data => {
      commit( DEAL_ROOM_AREA, { data })
    }, sendData)
  },
  delRoomArea({commit}, data) { 
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode':60102011403,
      'CompanyId':homeInfo.shop.COMPANYID,
      'ShopId': homeInfo.shop.ID,
      Id: data.Id
    }
    selected.type='del'
    commonSend.commonSend('get', data => {
      commit( DEAL_ROOM_AREA, { data })
    }, sendData)
  },

  getRoomList({commit}, data) { 
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode':'60102011411',
      'CompanyId':homeInfo.shop.COMPANYID,
      'ShopId': homeInfo.shop.ID,
      Status:data.Status,   // 0=全部，1=空闲房台
    }
    selected.type='list'
    commonSend.commonSend('get', data => {
      commit( ROOM_LIST, { data })
    }, sendData)
  },
  getRoomList2({commit}) { 
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode':'60102011411',
      'CompanyId':homeInfo.shop.COMPANYID,
      'ShopId': homeInfo.shop.ID,
      Status:1,  
    }
    commonSend.commonSend('get', data => {
      commit( ROOM_LIST2, { data })
    }, sendData)
  },
  saveRoomItem({commit}, data) { 
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode':60102011412,
      'CompanyId':homeInfo.shop.COMPANYID,
      'ShopId': homeInfo.shop.ID,
      DistrictId: data.DistrictId, // 区域id
      Name: data.Name,
      IsStop: data.Status?0:1, // 0=启用，1=停用
      DescNo: data.DescNo?data.DescNo:''
    }
    selected.type='add'
    if(data.Id){
      sendData.Id = data.Id;
      selected.type='edit'
    }
    commonSend.commonSend('get', data => {
      commit( DEAL_ROOM_ITEM, { data })
    }, sendData)
  },
  delRoomItem({commit}, data) { 
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode':60102011413,
      'CompanyId':homeInfo.shop.COMPANYID,
      'ShopId': homeInfo.shop.ID,
      DistrictId: data.DistrictId,
      Id: data.Id
    }
    selected.type='del';
    commonSend.commonSend('get', data => {
      commit( DEAL_ROOM_ITEM, { data })
    }, sendData)
  },
  selectingRoom({state},arr){
      state.selroom = [...arr];
  },
  selectingRoomorder({state},data){
    state.selroomorder = Object.assign({},data);
  },
  // thatRoomOrder({state},arr){ // 存储已选商品数据
  //   state.thatRoomOrder = {}
  //   arr.forEach((item)=>{
  //     if(item.List&&item.List.length>0){
  //       state.thatRoomOrder[item.ROOMID] = item;
  //     }
  //   });
  // },
  saveRoomOrder({commit}, data) {  // 房台消费下单
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode':601020440,
      'CompanyId':homeInfo.shop.COMPANYID,
      'ShopId': homeInfo.shop.ID,
      GoodsDetail: data.GoodsDetail, // Object
      VipId: data.VipId,
      IsCancel: data.IsCancel?data.IsCancel:0, // 1=作废
      Remark: data.Remark
    }
    selected.type='add';
    if(data.BillId){
      sendData.BillId = data.BillId;
      selected.type='edit';
    }
    commonSend.commonSend('post', data => {
      commit( DEAL_ROOMORDER, { data })
    }, sendData)
  },
  getRoomOrderList({commit,state}, data) { 
    let homeInfo = getHomeData();
    let pn = parseInt(state.roomOrderListState.paying.PN) +1;
    let sendData = {
      'InterfaceCode':601020441,
      'CompanyId':homeInfo.shop.COMPANYID,
      'ShopId': homeInfo.shop.ID,
      IsCheck: data.IsCheck, // -1=all,0=未结账,1=已结账
      BeginDate: data.BeginDate,
      EndDate: data.EndDate,
      PN:data.PN?data.PN:pn
    }
    commonSend.commonSend('get', data => {
      commit(GET_ROOMORDER_LIST, { data })
    }, sendData)
  },
  getRoomOrderItem({commit}, data) { 
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode':601020442,
      'CompanyId':homeInfo.shop.COMPANYID,
      RoomId: data.RoomId, 
      BillId: data.BillId
    }
    selected.rid = data.rid?data.rid:null;
    commonSend.commonSend('get', data => {
      commit( GET_ROOMORDER_ITEM, { data })
    }, sendData)
  },
  checkoutRoomOrder({commit}, data) {  // 房台消费结帐
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode':601020443,
      'CompanyId':homeInfo.shop.COMPANYID,
      NoteBillId: data.NoteBillId, 
      VipId: data.VipId,
      PaytypeId: data.PaytypeId, // 付款方式
      GetIntegral: data.GetIntegral, // 获得积分
      IsSms: data.IsSms?1:0, // 是否发短信
      PayIntegral: data.PayIntegral, // 抵现积分
      IntegralMoney: data.IntegralMoney, // 抵现金额
      FavorMoney: data.FavorMoney,  // 优惠金额
      CouponNo: data.CouponNo, // 优惠券号
      OtherMoney: data.OtherMoney,
      Remark: data.Remark?data.Remark:'',
    }
    commonSend.commonSend('get', data => {
      commit( ROOMORDER_STATE, { data })
    }, sendData)
  },
  checkoutRoomOrder2({commit}, data) {  // 房台消费结帐(含订单修改)
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode':'601020443_1',
      'CompanyId':homeInfo.shop.COMPANYID,
      NoteBillId: data.NoteBillId, 
      VipId: data.VipId,
      PaytypeId: data.PaytypeId, // 付款方式
      GetIntegral: data.GetIntegral, // 获得积分
      IsSms: data.IsSms?1:0, // 是否发短信
      PayIntegral: data.PayIntegral, // 抵现积分
      IntegralMoney: data.IntegralMoney, // 抵现金额
      FavorMoney: data.FavorMoney,  // 优惠金额
      CouponNo: data.CouponNo, // 优惠券号
      OtherMoney: data.OtherMoney,
      Remark: data.Remark?data.Remark:'',
      GoodsDetail: data.GoodsDetail
    }
    commonSend.commonSend('post', data => {
      commit( ROOMORDER_STATE, { data })
    }, sendData)
  },
  printRoomOrder({commit}, data) {  // 房台消费订单打印
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode':601020444,
      'CompanyId':homeInfo.shop.COMPANYID,
      'ShopId': homeInfo.shop.ID,
      BillId: data.BillId
    }
    commonSend.commonSend('get', data => {
      commit( PRINT_ROOMORDER, { data })
    }, sendData)
  },
  cancelRoomOrder({commit}, data) {  // 房台消费订单作废
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode':601020445,
      'CompanyId':homeInfo.shop.COMPANYID,
      BillId: data.BillId
    }
    commonSend.commonSend('get', data => {
      commit( CANECL_ROOMORDER, { data })
    }, sendData)
  },
  getRoomOrderTime({commit}, data) { // 房台消费计时
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode':601020450,
      'CompanyId':homeInfo.shop.COMPANYID,
      RoomId: data.RoomId, 
      BillId: data.BillId,
      Status: data.Status // 1=开始，-1=暂停，其他=自动
    }
    selected.Status = sendData.Status
    commonSend.commonSend('get', data => {
      commit( GET_ROOMORDER_TIME, { data })
    }, sendData)
  },
  clearRoomAll({state},type){
    switch(type){
      case 1: 
      state.roomList=[];
      state.roomList2=[];
      state.roomAreaList = []
      break;
      case 2: 
      state.roomOrderListState.paying.PN = 0;
      state.roomOrderList = []
      break;
      default:
      state.roomList=[];
      state.roomList2=[];
      state.roomAreaList = []
      state.roomOrderListState.paying.PN = 0;
      state.roomOrderList = []
      state.selroom = []
      state.selroomorder = {}
    }
  },

}

const mutations = {
  [ROOM_LIST] (state, { data }) {
    if(data.success){
      state.roomList = [...data.data.List];
    }
    state.roomListState = Object.assign({},data);
  },
  [ROOM_LIST2] (state, { data }) {
    if(data.success){
      state.roomList2 = [...data.data.List];
    }
    state.roomListState = Object.assign({},data);
  },
  [DEAL_ROOM_ITEM](state, { data }) {
    state.roomState = Object.assign({},data,{type:selected.type})
    selected = {}
  },
  [DEAL_ROOMORDER] (state, { data }) {
    state.dealRoomOrder = Object.assign({},data);
    selected = {}
  },
  [GET_ROOMORDER_LIST] (state, { data }) { 
    let pageData = Object.assign({},state.roomOrderListState.paying);
    if(data.success){
      state.roomOrderList = [...data.data.PageData.DataArr];
      pageData = Object.assign(pageData, data.data.PageData)
    }
    state.roomOrderListState = Object.assign({},data,{
      'paying':pageData,
      'List':state.roomOrderList
    });
  },
  [GET_ROOMORDER_ITEM] (state, { data }) {
    state.roomOrderItem = Object.assign({},data,{rid:selected.rid});
    selected = {}
  },
  [ROOMORDER_STATE](state, { data }) {
    state.roomOrderState = Object.assign({},data);
  },
  [GET_ROOMORDER_TIME] (state, { data }) {
    state.roomOrderTime = Object.assign({},data,selected);
    selected = {}
  },
  [ROOM_AREA_LIST] (state, { data }) {
    if(data.success){
      state.roomAreaList = [...data.data.List];
    }
    state.roomAreaListState = Object.assign({},data);
  },
  [DEAL_ROOM_AREA](state, { data }) {
    state.roomAreaState = Object.assign({},data);
  },
  [PRINT_ROOMORDER](state, { data }) {
    state.printRoomOrderState = Object.assign({},data);
  },
  [CANECL_ROOMORDER](state, { data }) {
    state.cancelRoomOrderState = Object.assign({},data);
  },
}

export default{
  state,
  getters,
  actions,
  mutations
}
