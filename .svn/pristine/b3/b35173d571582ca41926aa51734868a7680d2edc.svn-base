/**
 * 会员等级
 * ***/
import commonSend from '@/api/api'
import { getUserInfo,setHomeData } from '@/api/index'
import {
  GET_LEVEL_LIST,
  GET_LEVEL_ITEM,
  DEAL_LEVEL_ITEM
} from '@/store/mutation-types'
let selected={}

// initial state
const state = {
  levelListState: {},
  levelList: [],
  levelState: [],
  sellevel:{},
  levelItem:{},
  dealLevelState:{},
}

// getters
const getters = {
  levelListState: state => state.levelListState,
  levelList: state => state.levelList,
  levelState:state=>state.levelState,
  sellevel : state=>state.sellevel,
  levelItem: state=>state.levelItem,
  dealLevelState: state=>state.dealLevelState,
}

// actions
const actions = {
  getLevelList ({commit}) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': 60102011201,
      CompanyId: userInfo.CompanyID
    };
    commonSend.commonSend('get',data => {
      commit(GET_LEVEL_LIST, { data })
    }, sendData )
  },
  getLevelItem ({commit},id) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': 60102011202,
      CompanyId: userInfo.CompanyID,
      ID:id
    };
    commonSend.commonSend('get',data => {
      commit(GET_LEVEL_ITEM, { data })
    }, sendData )
  },
  //生意通保存折扣
  dealLevelItem ({commit},data) {
    console.log(data)
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': 21002060203,
      Name:data.Name,
      ID:data.ID?data.ID:"",
      Rate: parseFloat(data.Rate) *0.01,
      Remark : data.Remark,
    };
    selected.type="add";
    if(data.Id){
      sendData.Id = data.Id
      selected.type="edit";
      selected.data=Object.assign({},data);
    }else{
      selected.data=Object.assign({},sendData);
      delete selected.data.InterfaceCode
    }
    commonSend.commonSend('get',data => {
      commit(DEAL_LEVEL_ITEM, { data })
    }, sendData )
  },

  delLevelItem ({commit},data) {
    console.log(data)
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': 9201021,
      ID:data.ID
    };
    selected.type="del";
    selected.idnex=data.index;
    selected.data=Object.assign({},data.data);
    commonSend.commonSend('get',data => {
      commit(DEAL_LEVEL_ITEM, { data })
    }, sendData )
  },
  choosingLevel({commit},item){
    setHomeData({'level':item})
  },
  selectingLevel({commit,state},data){
    state.sellevel = Object.assign({},data);
  },
  clearLevelAll({state}){
    state.levelList= []
    state.sellevel={}
    state.levelItem={}
  }
}

// mutations
const mutations = {
  [GET_LEVEL_LIST] (state, { data }) {
    if(data.success){
      state.levelList = [...data.data.List];
    }
    state.levelListState = Object.assign({},data);
  },
  [GET_LEVEL_ITEM] (state, { data }) {
    if(data.success){
      state.levelItem = Object.assign({},data.data.obj)
    }
    state.levelState = Object.assign({},data);
  },
  [DEAL_LEVEL_ITEM] (state, { data }) {
    if(data.success){
      if(selected.type=="edit"){
        let index = state.levelList.findIndex(obj => Object.is(parseInt(selected.data.ID), parseInt(obj.ID)));
        for(let key in selected.data){
          let kk = key.toUpperCase();
          state.levelList[index][kk] = selected.data[key];
        }
      }
      if(selected.type=="add"){

        state.levelList = []
      }
      if(selected.type=="del"){
        let index =state.levelList.findIndex(obj => Object.is(parseInt(selected.data.ID), parseInt(obj.ID)));
        state.levelList.splice(index, 1);
      }
    }
    state.dealLevelState = Object.assign({},data);
    selected = {}
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
