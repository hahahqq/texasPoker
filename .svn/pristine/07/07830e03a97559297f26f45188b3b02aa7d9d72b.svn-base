// 收支结余
import commonSend from '@/api/api'
import { getUserInfo,getHomeData } from '@/api/index'
import { 
  GET_SURPLUS_DATA,
  GET_SURPLUS_LIST
} from '@/store/mutation-types'
let selected={}
var ListARR = [
  {},
  {InterfaceCode:'21002071201_01',title:'营业额明细',paying:{ "TotalNumber": 0, "PageNumber": 0, "PageSize": 20, "PN": 0,  },List:[]  },
  {InterfaceCode:'6010302_02',title:'会员消费明细',paying:{ "TotalNumber": 0, "PageNumber": 0, "PageSize": 20, "PN": 0,  },List:[]  },
  {InterfaceCode:'6010302_03',title:'充值明细',paying:{ "TotalNumber": 0, "PageNumber": 0, "PageSize": 20, "PN": 0,  },List:[]  },
  {InterfaceCode:'6010302_04',title:'支出明细',paying:{ "TotalNumber": 0, "PageNumber": 0, "PageSize": 20, "PN": 0,  },List:[]  },
  {InterfaceCode:'6010302_05',title:'支付明细',paying:{ "TotalNumber": 0, "PageNumber": 0, "PageSize": 20, "PN": 0,  },List:[]  },
  {InterfaceCode:'6010302_06',title:'欠款明细',paying:{ "TotalNumber": 0, "PageNumber": 0, "PageSize": 20, "PN": 0,  },List:[]  },
  {InterfaceCode:'6010302_07',title:'还款明细',paying:{ "TotalNumber": 0, "PageNumber": 0, "PageSize": 20, "PN": 0,  },List:[]  },
 ]

// initial state
const state = {
  surplusReportState: {},
   surplusReportData: {},
   surplusReportList:[],
   surplusReportListState:{paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  },List:[]},
  surplusReportListARR: [...ListARR],
}

// getters
const getters = {
  surplusReportData: state => state.surplusReportData,
  surplusReportList: state => state.surplusReportList,
  surplusReportState: state => state.surplusReportState,
  surplusReportListState: state=>state.surplusReportListState,
  surplusReportListARR: state=>state.surplusReportListARR,
}

// actions
const actions = {
  getsurplusReportData ({commit},data) { // 首页收支结余
    let userInfo= getUserInfo();
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': '21002071201',
      'CompanyId': userInfo.CompanyID,
      ShopId:data.ShopId?data.ShopId:'',
      BeginDate:data.BeginDate?data.BeginDate :1,
      EndDate:data.EndDate?data.EndDate : 9999999999999
    };
    commonSend.commonSend('get',data => {
      commit(GET_SURPLUS_DATA, { data })
    }, sendData )
  },
  getsurplusReportList ({commit,state},{obj,data}) {
    let userInfo= getUserInfo();
    let homeInfo = getHomeData();
    let listArrData = state.surplusReportListARR[obj.index];
    let pn = parseInt(listArrData.paying.PN) +1;
    let sendData = {
      'InterfaceCode': listArrData.InterfaceCode,
      'CompanyId': userInfo.CompanyID,
      ShopId:data.ShopId?data.ShopId:'',
      BeginDate:data.BeginDate?data.BeginDate :1,
      EndDate:data.EndDate?data.EndDate : 9999999999999,
      PN:data.PN?data.PN:pn
    };
    if(data.PayTypeId){ // 支付明细
      sendData.PayTypeId = data.PayTypeId
    }
    selected.obj = obj;
    commonSend.commonSend('get',data => {
      commit(GET_SURPLUS_LIST, { data })
    }, sendData )
  },
  clearsurplusReportList({state},index) {
    state.surplusReportList=[]
    state.surplusReportListState.paying.PN = 0 
    state.surplusReportListARR[index].paying.PN = 0 
  },
  clearsurplusReportAll({state}) {
    state.surplusReportData = {}
    state.surplusReportList=[]
    state.surplusReportListState.paying.PN = 0 
    state.surplusReportListARR = [...ListARR]
  }
}

// mutations
const mutations = {
  [GET_SURPLUS_DATA] (state, { data }) {
    if(data.success){
        state.surplusReportData = Object.assign({},data.data);
    }
    state.surplusReportState = Object.assign({},data);
  },
  [GET_SURPLUS_LIST](state, { data }) {


    console.log("收支结余",data)
    let listArrData = state.surplusReportListARR[selected.obj.index]
    let pageData = Object.assign({},listArrData.paying);
    if(data.success){
      let newArr = [...data.data.PageData.DataArr];
      // if(newArr.length>0){
        pageData = Object.assign(pageData, data.data.PageData)
        state.surplusReportList = [...newArr];
        state.surplusReportListARR[selected.obj.index].paying = Object.assign({},pageData)
        state.surplusReportListARR[selected.obj.index].List = [...state.surplusReportList]
        console.log("state.surplusReportList 值能打印出来吗哈哈都发",state.surplusReportList)
      // }
    }
    state.surplusReportListState = Object.assign({},data,{'paying':pageData,'List':state.surplusReportList});
    selected = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
