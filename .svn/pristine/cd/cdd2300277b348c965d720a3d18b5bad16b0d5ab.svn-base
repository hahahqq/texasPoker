// 销售查询
import commonSend from '@/api/api'
import { getUserInfo,getHomeData } from '@/api/index'
import { 
  GET_SALEINQUIRY_DATA,
  GET_SALEINQUIRY_LIST,
  GET_SALEINQUIRY_ITEM,
} from '@/store/mutation-types'
let selected={}
var ListARR = [
//   { InterfaceCode:'',title:'销售查询明细',paying:{ "TotalNumber": 0, "PageNumber": 0, "PageSize": 20, "PN": 0,  },List:[]  },
]

// initial state
const state = {
  saleInquiryState: {},
  saleInquiryData: {paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  },List:[],info:{}},
  saleInquiryList:[],
  saleInquiryListState:{paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  },List:[]},
  saleInquiryListARR: [...ListARR],
  saleInquiryItem:{}
}

// getters
const getters = {
  saleInquiryData: state => state.saleInquiryData,
  saleInquiryList: state => state.saleInquiryList,
  saleInquiryState: state => state.saleInquiryState,
  saleInquiryListState: state=>state.saleInquiryListState,
  saleInquiryListARR: state=>state.saleInquiryListARR,
  saleInquiryItem : state=>state.saleInquiryItem,
}

// actions
const actions = {
  getsaleInquiryData ({commit},data) { 
    let userInfo= getUserInfo();
    let homeInfo = getHomeData();
    let pn = parseInt(state.saleInquiryData.paying.PN) +1;
    let sendData = {
      'InterfaceCode': '6010317_1',
      'CompanyId': userInfo.CompanyID,
      ShopId:data.ShopId?data.ShopId:'',
      BeginDate:data.BeginDate?data.BeginDate :1,
      EndDate:data.EndDate?data.EndDate : 9999999999999,
      PN:data.PN?data.PN:pn,
      Status: data.Status,  //-1=all 0=正常,1=作废
      PaytypeId:data.PaytypeId, // 付款方式
      Filter: data.Filter?data.Filter:''
    };
    commonSend.commonSend('get',data => {
      commit(GET_SALEINQUIRY_DATA, { data })
    }, sendData )
  },
  getsaleInquiryList ({commit,state},{obj,data}) { // 明细
    // let userInfo= getUserInfo();
    // let homeInfo = getHomeData();
    // let listArrData = state.saleInquiryListARR[obj.index];
    // let pn = parseInt(listArrData.paying.PN) +1;
    // let sendData = {
    //   'InterfaceCode': listArrData.InterfaceCode,
    //   'CompanyId': userInfo.CompanyID,
    //   ShopId:data.ShopId?data.ShopId:'',
    //   DateStr:data.DateStr?data.DateStr:'', // string 2018-09-03
    //   PN:data.PN?data.PN:pn,
    //   OrderType:data.OrderType?data.OrderType:0 // 0=按金额，1=按数量
    // };
    // selected.obj = obj;
    // commonSend.commonSend('get',data => {
    //   commit(GET_SALEINQUIRY_LIST, { data })
    // }, sendData )
  },
  clearsaleInquiryList({state},index) {
    state.saleInquiryList=[]
    state.saleInquiryListState.paying.PN = 0 
    state.saleInquiryListARR[index].paying.PN = 0 
  },
  clearsaleInquiryList2({state}){
    state.saleInquiryData.paying.PN = 0
    state.saleInquiryData.List = []
    state.saleInquiryData.info = {}
  },
  clearsaleInquiryAll({state}){
    state.saleInquiryList = [];
    state.saleInquiryListState.paying.PN=0
    state.saleInquiryData.paying.PN = 0
    state.saleInquiryData.List = []
    state.saleInquiryData.info = {}
    state.saleInquiryListARR= [...ListARR]
  },
}

// mutations
const mutations = {
  [GET_SALEINQUIRY_DATA] (state, { data }) {
    if(data.success){
      let pageData = Object.assign({},state.saleInquiryData.paying);
      let newArr = [...data.data.PageData.DataArr];
      if(newArr.length>0){
        pageData = Object.assign(pageData, data.data.PageData);
        delete pageData.DataArr;
        state.saleInquiryData.paying = Object.assign({},pageData)
        state.saleInquiryData.List = [...newArr];
        state.saleInquiryData.info={
            "QTY":data.data.Qty,
            'MONEY':data.data.Money,
            'BILLCOUNT':data.data.BillCount
        }
      }
    }
    state.saleInquiryState = Object.assign({},data);
  },
  [GET_SALEINQUIRY_LIST](state, { data }) {
    let listArrData = state.saleInquiryListARR[selected.obj.index]
    let pageData = Object.assign({},listArrData.paying);
    if(data.success){
      let newArr = [...data.data.PageData.DataArr];
      if(newArr.length>0){
        pageData = Object.assign(pageData, data.data.PageData)
        state.saleInquiryList = [...newArr];
        state.saleInquiryListARR[selected.obj.index].paying = Object.assign({},pageData)
        state.saleInquiryListARR[selected.obj.index].List = [...state.saleInquiryList]
      }
    }
    state.saleInquiryListState = Object.assign({},data,{'paying':pageData,'List':state.saleInquiryList});
    selected = {}
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
