import commonSend from '@/api/api'
import { getUserInfo,setHomeData,getHomeData } from '@/api/index'
import { 
    GET_PERIOD
} from '@/store/mutation-types'
let selected={}
let ItemsHeaderType=0;

// initial state
const state = {
    periodDate:{},
}

// getters
const getters = {
    periodDate: state => state.periodDate,
}

// actions

const actions = {
  //生意通时段充值接口调
  getPeriod ({commit},data) {
    console.log(data)
    let homeInfo = getHomeData();
    let sendData = {
      InterfaceCode: 210020113,
      VipId:data.VipId,
      AddMoney:data.AddMoney,
      shopid:homeInfo.shop.ID,
      IsSmd:"",
      Remark:data.Remark,
      PayTypeID:data.PayTypeID,
      GoodsID:data.GoodsID,
      GetIntegral:data.GetIntegral,
      BeginDate:data.dateBE[0],
      Invaliddate:data.dateBE[1],
      SaleEmpList:data.SaleEmpList,
    };
    if(data){
      sendData = Object.assign({},sendData,data)
    }
    commonSend.commonSend('get',data => {
      commit(GET_PERIOD, { data })
    }, sendData )
  },
}

// mutations
const mutations = {
  [GET_PERIOD] (state, { data }) {
    state.periodDate = Object.assign({},data);
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
