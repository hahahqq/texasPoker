
// const ROOT_URL = 'http://www.dlaico88.cn';   // 生意通
 const ROOT_URL = 'http://bwangame.cn';   // 德州会员系统
const ROOT_PORT = ':8080';
const APIURL = ROOT_URL + ROOT_PORT + "/system/systemService";
const ROOT_URLQRCODE = ROOT_URL + '/WeChatQrcodeCallBackApi';
const ROOT_STATE = ROOT_URL == 'http://www.dlaico88.cn' ? 2 : 1;
var title = ROOT_STATE == 1 ? "德州会员系统" : "生意通";
document.title = title;

// http://bwangame.cn:8080/resources/vipidcardimg/1496894.png

document.getElementById('icon').href = "static/images/" + ROOT_STATE + "/sysLogo.png"

const IMGUPLOAD_URL = ROOT_URL + ROOT_PORT + "/toFileUpload/oneFileUpload";
const IMG_URL = ROOT_URL + ROOT_PORT + "/resources/";
const IMG_FILEPATH = [
  'goodsimage/',
  'vipimages/',
  'backgroundimage/'
];
const GOODS_IMGURL = ROOT_URL + ROOT_PORT + "/resources/goodsimage/";
const VIPIMAGESIMG = ROOT_URL + ROOT_PORT + "/resources/vipimages/";

const SYSTEM_INFO = {
  NAME: title,
  VERSION: '6.3.9',
  PREFIX: 'TZPK',
};

export {
  ROOT_URL,
  APIURL,
  GOODS_IMGURL,
  VIPIMAGESIMG,
  ROOT_URLQRCODE,
  ROOT_STATE,
  IMGUPLOAD_URL,
  SYSTEM_INFO,
  IMG_URL, IMG_FILEPATH
}
