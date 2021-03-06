import Vue from "vue";
import CRYPTO from "crypto-js";
import { APIURL, IMGUPLOAD_URL } from "@/util/define";
import { getUserInfo } from "@/api/index";

var qs = require("qs");

const url = APIURL;
const appid = "1722b3131bdca65b2add62bd4b323aea";
const appsecret = "3259d510d5e1be44342018b0bffdd7da";

const makeSign = function(data, time) {
   var str = "",
      newDAta = {};
   var timestamp = Number(time) + Number(new Date().getTime());

   var dd = Object.assign(data, {
      timestamp: timestamp,
      appid: appid
   });
   var arr = Object.keys(dd).sort();

   for (var i = 0; i < arr.length; i++) {
      if (dd[arr[i]] != undefined) {
         str += arr[i] + "=" + dd[arr[i]];
         if (i != arr.length - 1) {
            str += "&";
         }
         newDAta[arr[i]] = dd[arr[i]];
      }
   }
   var encrypted = CRYPTO.MD5(str + appsecret).toString();
   var sendData = Object.assign({}, newDAta, {
      signature: encrypted
   });

   return sendData;
};

// 请求服务器后无操作后每20分钟自动重连登录接口 ， 重连3次后停止自动重连
var onlineState = 0,
   setOnline = null;
const timeout = 20 * 58 * 1000;
const setOnlineFun = function() {
   setOnline = setTimeout(() => {
      let userInfo = getUserInfo();
      if (Object.keys(userInfo).length > 0 && onlineState < 3) {
         let sendData = {
            AuthCode: userInfo.CompanyCode,
            UserCode: userInfo.CODE2,
            Password: userInfo.PPWW.slice(6, userInfo.PPWW.length),
            InterfaceCode: "2100102",
            AppType: 0, // 0=PC
            VersionText: "",
            IMEI: "",
            platform: 0
         };
         arg.commonSend(
            "get",
            data => {
               if (data.success) {
                  onlineState++;
               }
            },
            sendData
         );
      } else {
         onlineState = 0;
         clearTimeout(setOnline);
      }
   }, timeout);
};

var stopLineState = 0,
   setOnline1 = null; // 断线重连， 每1秒调取一次，连续5次调取失败后回到登录页面
const setOnlineFun1 = function() {
   setOnline1 = setTimeout(() => {
      let userInfo = getUserInfo();
      if (stopLineState < 5 && stopLineState > 0) {
         alert("正在尝试第" + stopLineState + "次重连,失败5次后将退回登录页面");
      }
      if (stopLineState == 5) {
         sessionStorage.removeItem("userFZBInfo");
         sessionStorage.removeItem("serverIP");
         location.href = "#/login";
      }
      if (Object.keys(userInfo).length > 0 && stopLineState < 5) {
         let sendData = {
            AuthCode: userInfo.CompanyCode,
            UserCode: userInfo.CODE2,
            Password: userInfo.PPWW.slice(6, userInfo.PPWW.length),
            InterfaceCode: "2100102",
            AppType: 0, // 0=PC
            VersionText: "",
            IMEI: "",
            platform: 0
         };
         arg.commonSend(
            "get",
            data => {
               if (data.success) {
                  stopLineState = 0;
                  clearTimeout(setOnline1);
               } else {
                  stopLineState++;
               }
            },
            sendData
         );
      } else {
         stopLineState = 0;
         clearTimeout(setOnline1);
      }
   }, 1000);
};

const arg = {
   commonSend(type = "get", cb, data) {
      let SERVER_TIME = sessionStorage.getItem("SERVER_TIME");
      if (SERVER_TIME) {
         SERVER_TIME = JSON.parse(SERVER_TIME);
      } else {
         SERVER_TIME = { time: new Date().getTime(), JSESSIONID: "" };
      }

      let method = type.toLowerCase();
      let axios = {
         url: url,
         method: method,
         headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json"
         }
      };
      if (method == "post") {
         let dd = makeSign(data, SERVER_TIME.time);
         let params = new URLSearchParams();
         for (let it in dd) {
            params.append(it, dd[it]);
         }
         axios = Object.assign(axios, {
            data: params
         });
      } else {
         if (data.dealautograph == 1) {
            Vue.delete(data, "dealautograph");
            axios = Object.assign(axios, { params: data });
         } else {
            axios = Object.assign(axios, {
               params: makeSign(data, SERVER_TIME.time)
            });
         }
      }
      Vue.axios(axios)
         .then(response => {
            cb(response.data);
            if (
               response.data.message.indexOf("请先登录") > -1 &&
               !response.data.success &&
               !response.data.data
            ) {
               clearTimeout(setOnline1);
               setOnlineFun1();
            } else {
               clearTimeout(setOnline);
               setOnlineFun();
            }
         })
         .catch(error => {
            cb({
               success: false,
               message: "网络有误 !！"
            });
            console.log(error);
         });
   },
   commonSend2(type = "get", cb, data) {
      let dd = data.sendData,
         selected = data.selected;
      let SERVER_TIME = sessionStorage.getItem("SERVER_TIME");
      if (SERVER_TIME) {
         SERVER_TIME = JSON.parse(SERVER_TIME);
      } else {
         SERVER_TIME = { time: new Date().getTime(), JSESSIONID: "" };
      }

      let method = type.toLowerCase();
      let axios = {
         url: url,
         method: method,
         headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json"
         }
      };
      if (method == "post") {
         let dd = makeSign(dd, SERVER_TIME.time);
         let params = new URLSearchParams();
         for (let it in dd) {
            params.append(it, dd[it]);
         }
         axios = Object.assign(axios, {
            data: params
         });
      } else {
         if (dd.dealautograph == 1) {
            Vue.delete(dd, "dealautograph");
            axios = Object.assign(axios, { params: dd });
         } else {
            axios = Object.assign(axios, {
               params: makeSign(dd, SERVER_TIME.time)
            });
         }
      }
      Vue.axios(axios)
         .then(response => {
            let backData = Object.assign({}, response.data, { selected: selected });
            cb(backData);
            if (
               response.data.message.indexOf("请先登录") > -1 &&
               !response.data.success &&
               !response.data.data
            ) {
               clearTimeout(setOnline1);
               setOnlineFun1();
            } else {
               clearTimeout(setOnline);
               setOnlineFun();
            }
         })
         .catch(error => {
            cb({
               success: false,
               message: "网络有误!!!",
               selected: selected
            });
            console.log(error);
         });
   },
   methodGet(callback, data) {
      Vue.axios
         .get(url, {
            headers: {
               "Content-Type": "application/x-www-form-urlencoded",
               Accept: "application/json"
            },
            params: data
         })
         .then(function(response) {
            callback(response);
         })
         .catch(function(error) {
            callback(error);
         });
   },
   methodUpload(callback, data) {
      // 转为base64为file
      var bytes = window.atob(data.file.split(",")[1]); //去掉url的头，并转换为byte
      // //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
         ia[i] = bytes.charCodeAt(i);
      }
      var filedata = new Blob([ab], {
         type: "image/png"
      });

      let sendData = new FormData();
      sendData.append("name", data.name);
      sendData.append("filePath", data.filePath);
      sendData.append("file", filedata);
      let axios = {
         url: IMGUPLOAD_URL,
         method: "post",
         data: sendData,
         headers: {
            "Content-Type": "application/x-www-form-urlencoded"
         }
      };
      Vue.axios(axios)
         .then(response => {
            callback(response.data);
         })
         .catch(function(error) {
            callback({
               success: false,
               message: "网络有误!！"
            });
         });
   }
};

export default {
   commonSend(type, cb, data) {
      arg.commonSend(type, cb, data);
   },
   commonSend2(type, callback, data) {
      arg.commonSend2(type, callback, data);
   },
   methodGet(callback, data) {
      arg.methodGet(callback, data);
   },
   methodUpload(callback, data) {
      arg.methodUpload(callback, data);
   }
};
