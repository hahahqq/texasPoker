/**
 * 用户
 * ***/
import commonSend from '@/api/api'
import { getUserInfo,getHomeData} from '@/api/index'
import {
  GET_USER_LIST,
  GET_USER_ITEM,
  DEAL_USER_ITEM,
  GET_PERMISSION_LIST,
  SET_PERMISSION,
  DEL_USER,
  RESET_USER_PASSWORD,
  SET_PERMISSION_STORE
} from '@/store/mutation-types'
let selected={}

// initial state
const state = {
  userListState: { paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  }},
  userList: [],
  userState: {},
  seluser:{},
  userItem:{},
  deluser:{},
  dealUserState:{},
  permissionList:{},
  permissionStore:[],
  permissionListState:{},
  permissionState:{},
  resetUserPassWordState: {},
  delUserState:{},
  permissionStoreState: {}
}

// getters
const getters = {
  userListState: state => state.userListState,
  userList: state => state.userList,
  userState:state=>state.userState,
  seluser : state=>state.seluser,
  userItem: state=>state.userItem,
  dealUserState: state=>state.dealUserState,
  permissionList: state=>state.permissionList,
  permissionStore : state=>state.permissionStore,
  permissionListState: state=>state.permissionListState,
  permissionState: state => state.permissionState,
  resetUserPassWordState: state => state.resetUserPassWordState,
//   deluser: state => state.deluser,
  delUserState: state => state.delUserState,
  permissionStoreState: state => state.permissionStoreState
}

// actions用户
const actions = {
  getUserList ({commit},data) {
    let userInfo = getUserInfo();
    let pn = parseInt(state.userListState.paying.PN) +1;
    if(  state.userListState.paying.PageSize >= state.userListState.paying.TotalNumber){ pn=1;}
    let sendData = {
      'InterfaceCode': '2100106',
      'Companyid': userInfo.CompanyID,
      isstop:'false', // 是否禁用
      isall:-1, // 返回全部
      filter: data.filter?data.filter:'',
      PN: data.PN?data.PN:pn
    };
    commonSend.commonSend('get',data => {
      commit(GET_USER_LIST, { data })
    }, sendData )
  },
  addUserItem ({commit},data) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '60101015',
      'Companyid': userInfo.CompanyID,
      username:data.username,
      password:data.password,
      usercode: data.usercode,
      isadmin:data.isadmin?true:false
    };
    selected.type="add";
    commonSend.commonSend('get',data => {
      commit(DEAL_USER_ITEM, { data })
    }, sendData )
  },
  editUserItem ({commit},data) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '60101016',
      'Companyid': userInfo.CompanyID,
      UserID :data.UserID,
      UserName:data.username,
      UserCode: data.usercode,
      IsAdmin:data.isadmin?true:false,
      IsStop: data.IsStop?true:false
    };
    selected.type="edit";
    commonSend.commonSend('get',data => {
      commit(DEAL_USER_ITEM, { data })
    }, sendData )
  },
  delUser ({commit},data) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '2100107_1',
      'CompanyId': userInfo.CompanyID,
      'UserID': data.UserID,
    };
    commonSend.commonSend('get',data => {
      commit(DEL_USER, { data })
    }, sendData )
  },
  changeUserPwd({commit},data) {
    let sendData = {
      'InterfaceCode': '60101017',
      OldPswd: data.OldPswd,
      NewPswd: data.NewPswd
    };
    commonSend.commonSend('get',data => {
      commit(DEAL_USER_ITEM, { data })
    }, sendData )
  },
  selectingUser({state},data){
    state.seluser = Object.assign({},data);
  },

  sendUserMessage({commit},data) { // 商家留言提交
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': '2100141',
      'CompanyId': userInfo.CompanyID,
      AppType: 3, // 3=生意通,6=餐饮宝,8=美业宝
      VersionText: homeInfo.shop.VERSION,
      Remark: data.Remark,
      PhoneNo : data.PhoneNo
    };
    commonSend.commonSend('get',data => {
      commit(DEAL_USER_ITEM, { data })
    }, sendData )
  },
  clearUserAll({state}){
    state.userListState.paying.PN =0
    state.userList= []
    state.seluser={}
    state.userItem={}
    state.permissionList = {};
    state.permissionStore = [];
  },
  getPermissionList({commit},uid){ // 获取用户权限列表
    let sendData = {
      'InterfaceCode': '2100104',
      'UserID':uid
    }
    commonSend.commonSend('get',data => {
      commit(GET_PERMISSION_LIST, { data })
    }, sendData )
  },
  setPermissionList({commit},{uid,parr}){ // 用户权限保存
    let userInfo = getUserInfo();
    let CompanyID = userInfo.CompanyID;
    let sendData = {
      'InterfaceCode': '2100105',
      UserID: uid,
      List:'',
    }
    let arr = [];
    for(let i=0;i<parr.length;i++){
      arr.push({
        'IsPurview':1,
        'FunID': parr[i].FUNID,
        'CompanyID':CompanyID
      })
    }
    let userquanxianList = {}
      for (let i = 0; i < arr.length; i++) {
        userquanxianList[i] = arr[i]
      }
    sendData.List = JSON.stringify(userquanxianList);
    commonSend.commonSend('post',data => {
      commit(SET_PERMISSION, { data })
    }, sendData )
  },
  setPermissionStore({commit},{uid,sarr}){ // 用户店铺权限保存
    let userInfo = getUserInfo();
    let usershopList = {}
      for (let i = 0; i < sarr.length; i++) {
        usershopList[i] = sarr[i]
      }
    let sendData = {
      'InterfaceCode': '60101021',
      'Companyid':userInfo.CompanyID,
      writer: userInfo.UserID,
      userid: uid,
      list:JSON.stringify(usershopList),
    }
    commonSend.commonSend('get',data => {
      commit(SET_PERMISSION, { data })
    }, sendData )
  },
  resetUserPassWord( { commit} , data){  // 修改用户密码
   let userInfo = getUserInfo()
   let sendData = {
     'InterfaceCode' : '9201012',
     Password: data.Password,
     UserID: data.UserID
   }
   commonSend.commonSend('post', data => {
     commit(RESET_USER_PASSWORD, {data})
   }, sendData)
 },
 setPermissionStore({commit},{uid,sarr}){ // 用户店铺权限保存
   let userInfo = getUserInfo()
   let sendData = {
     'InterfaceCode': '2100108',
     'Companyid':userInfo.CompanyID,
     writer: userInfo.UserID,
     userid: uid,
     list: JSON.stringify(sarr)
   }
   commonSend.commonSend('post',data => {
     commit(SET_PERMISSION_STORE, { data })
   }, sendData )
 },
}

// mutations
const mutations = {
   [DEL_USER](state, {data}){
      state.delUserState = data
    },
   [RESET_USER_PASSWORD](state, { data }){
      state.resetUserPassWordState = data
   },
  [GET_USER_LIST] (state, { data }) {
    let pageData = Object.assign({},state.userListState.paying);
    if(data.success){
      state.userList = [...data.data.PageData.DataArr];
      pageData = Object.assign(pageData, data.data.PageData)
    }
    state.userListState = Object.assign({},data,{'paying':pageData});
  },
  [GET_USER_ITEM] (state, { data }) {
    if(data.success){
      state.userItem = Object.assign({},data.data.obj)
    }
    state.userState = Object.assign({},data);
  },
  [DEAL_USER_ITEM] (state, { data }) {
    state.dealUserState = Object.assign({},data);
    selected = {}
  },
  [GET_PERMISSION_LIST](state,{data}){
   if(data.success){
     let darr = [...data.data.List]
     let newList = {};
     for(let i=0;i<darr.length;i++){
       if(darr[i].MODULEID == '806' || darr[i].MODULEID == '807' || darr[i].MODULEID == '808' || darr[i].MODULEID == '809'){
         darr[i].MODULETYPE = 0
       }

       if(darr[i].MODULETYPE == 0){
         newList[darr[i].MODULEID] = { info:darr[i], list:[] }
       }else{
         if(newList[darr[i].PID])
         newList[darr[i].PID].list.push(Object.assign({},darr[i],{
           'IsPurview':darr[i].ISPURVIEW==1?true:false
         }))
       }
     }
     state.permissionList = Object.assign({},newList);
     state.permissionStore= [...data.data.ShopList];
   }
   state.permissionListState = Object.assign({},data)
 },
  [SET_PERMISSION](state,{data}){
    state.permissionState = Object.assign({},data)
  },
  [SET_PERMISSION_STORE](state,{data}){
      state.permissionStoreState = Object.assign({},data)
   },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
