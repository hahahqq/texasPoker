/**
 * 商品单位
 * ***/
import commonSend from '@/api/api'
import { getUserInfo,setHomeData } from '@/api/index'
import { 
  GET_UNIT_LIST,GET_UNIT_ITEM,DEAL_UNIT_ITEM
} from '@/store/mutation-types'
let selected={}

// initial state
const state = {
  unitListState: {},
  unitList: [],
  unitState: [],
  selunit:{},
  unitItem:{},
  dealUnitState:{},
}

// getters
const getters = {
  unitListState: state => state.unitListState,
  unitList: state => state.unitList,
  unitState:state=>state.unitState,
  selunit : state=>state.selunit,
  unitItem: state=>state.unitItem,
  dealUnitState: state=>state.dealUnitState,
}
// actions
const actions = {
  getUnitList ({commit}) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': 2100206101,
      CompanyId: userInfo.CompanyID,
      Filter:''
    };
    commonSend.commonSend('get',data => {
      commit(GET_UNIT_LIST, { data })
    }, sendData )
  },
  getUnitItem ({commit},id) {
    // let userInfo = getUserInfo();
    // let sendData = {
    //   'InterfaceCode': 60102011202,
    //   CompanyId: userInfo.CompanyID,
    //   ID:id
    // };
    // commonSend.commonSend('get',data => {
    //   commit(GET_UNIT_ITEM, { data })
    // }, sendData )
  },
  dealUnitItem ({commit},data) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': 2100206102,
      'CompanyId': userInfo.CompanyID,
      Name:data.Name,
      Remark : data.Remark
    }
    selected.type="add";
    if(data.Id){
      sendData.id = data.ID;
      selected.type="edit";
      selected.data=Object.assign({},data);
    }else{
      selected.data=Object.assign({},sendData);
      delete selected.data.InterfaceCode
    }
    commonSend.commonSend('get',data => {
      commit(DEAL_UNIT_ITEM, { data })
    }, sendData )

  },
  delUnitItem ({commit},data) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': 2100206103,
      CompanyId: userInfo.CompanyID,
      id:data.data.ID
    };
    selected.type="del";
    selected.idnex=data.index;
    selected.data=Object.assign({},data.data);
    commonSend.commonSend('get',data => {
      commit(DEAL_UNIT_ITEM, { data })
    }, sendData )
  },
  choosingUnit({commit},item){
    setHomeData({'unit':item})
  },
  selectingUnit({commit,state},data){
    state.selunit = Object.assign({},data);
  },
  clearUnitAll({state}){
    state.unitList= []
    state.unitItem= {}
    state.selunit={}
  }
}

// mutations
const mutations = {
  [GET_UNIT_LIST] (state, { data }) {
    if(data.success){
      state.unitList = [...data.data.List];
    }
    state.unitListState = Object.assign({},data);
  },
  [GET_UNIT_ITEM] (state, { data }) {
    if(data.success){
      state.unitItem = Object.assign({},data.data.obj)
    }
    state.unitState = Object.assign({},data);
  },
  [DEAL_UNIT_ITEM] (state, { data }) {
    if(data.success){
      // if(selected.type=="edit"){
      //   let index = state.unitList.findIndex(obj => Object.is(parseInt(selected.data.ID), parseInt(obj.ID)));
      //   for(let key in selected.data){
      //     let kk = key.toUpperCase();
      //     state.unitList[index][kk] = selected.data[key];
      //   }
      // }
      // if(selected.type=="add"){
      //   // let item = Object.assign({},selected.data,{Id:data.data.OutId})
      //   state.unitList = []
      // }
      // if(selected.type=="del"){
      //   let index =state.unitList.findIndex(obj => Object.is(parseInt(selected.data.ID), parseInt(obj.ID)));
      //   state.unitList.splice(index, 1);
      // }
    } 
    state.dealUnitState = Object.assign({},data);
    selected = {}
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
