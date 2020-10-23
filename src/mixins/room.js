/**
 * setup
 * */
import {
  mapState,
  mapGetters
} from "vuex";
import { getHomeData } from "@/api/index";
import { getDayindate } from "@/util/Printing";
const settheVipPrice_Fun = function (goodsItem, selmember, type, value) {
  // 设置会员折扣 type：0=商品选择，1=挂单商品， 2=all, 3=更改折扣
  let gPrice = 0;
  let price = parseFloat(goodsItem.PRICE),
    discount = 1,
    remark = "";
  switch (type) {
    case 1:
      gPrice = parseFloat(goodsItem.GOODSPRICE);
      break;
    case 2:
      gPrice = parseFloat(goodsItem.retailprice);
      break;
    case 3:
      gPrice = parseFloat(goodsItem.retailprice);
      break;
    case 4:
      gPrice = parseFloat(goodsItem.retailprice);
      break;
    default:
      gPrice = parseFloat(goodsItem.PRICE);
  }

  if (Object.keys(selmember).length > 0 && type < 3) {
    if (goodsItem.VIPPRICE && parseFloat(goodsItem.VIPPRICE) > 0) { // 有会员价
      price = goodsItem.VIPPRICE;
      discount =
        gPrice == 0 ? 0 : parseFloat(price / gPrice);
      remark = "(会员价" + goodsItem.VIPPRICE + "元)";
    } else {
      discount =
        goodsItem.GOODSMODE == 1
          ? selmember.SERVICEDISCOUNT
          : selmember.DISCOUNT; // 0=商品 1=服务
      price = gPrice * discount;
      if (discount < 1) {
        remark = "(会员折扣" + discount + "折)";
      }

    }
  }
  if (type == 3) {
    discount = parseFloat(value);
    price = gPrice * discount;
    remark = "(会员折扣" + discount + "折)";
  }
  if (type == 4) {
    price = parseFloat(value);
    discount =
      gPrice == 0 ? 0 : parseFloat(price / gPrice);
    remark = "(会员折扣" + discount.toFixed(2) + "折)";
  }
  return {
    price: price,
    discount: discount,
    remark: remark,
    retailprice: gPrice
  };
}
export default {
  ADD_GOODS: {
    computed: {
      ...mapGetters({
        selmember: "selmember",
      })
    },
    methods: {
      settheVipPrice(goodsItem, type, value) {
        return settheVipPrice_Fun(goodsItem, this.selmember, type, value);
      },
    }
  },
  DEAL_GOODS: {
    computed: {
      ...mapGetters({
        selroom: "selroom",
        selmember: "selmember",
        roomList: "roomList",
        categoryList: "categoryList",
        employeeList: "employeeList",
        roomOrderTime: "roomOrderTime"
      })
    },
    watch: {
      roomOrderTime(data) {
        if (data.success) {
          for (let i = 0; i < this.theOrderList.length; i++) {
            if (this.theOrderList[i].ROOMID == this.leftTabsValue) {
              this.theOrderList[i].ISSTART = data.Status;
            }
          }
        }
      },
      selmember(data) {
        if (data.type && data.type == 'room') {
          this.changeSelMember(); // 更改会员重设折扣
        }
      },
    },
    methods: {
      back() {
        this.clearSEL();
        this.$emit("changePage", 0);
      },
      delgoods(index, i, item) {
        //  移除商品
        this.theOrderList[index].List.splice(i, 1);
        this.dealTotalData(index);
      },
      dealTotalData(index) {
        // 总计
        // console.log(this.theOrderList[index]);
        if (!this.theOrderList[index].List) return;
        let itemList = [...this.theOrderList[index].List];
        let tnum = 0,
          tprice = 0;
        itemList.forEach(item => {
          tnum += parseInt(item.num);
          let m = parseFloat(
            item.retailprice * item.num * item.discount
          ).toFixed(2);
          tprice += parseFloat(m);
        });

        this.theOrderList[index].total = {
          num: tnum,
          price: tprice
        };
        this.theOrderList = [...this.theOrderList];
      },
      seltabForTotal() {
        // 总计当前房台
        for (let i = 0; i < this.theOrderList.length; i++) {
          if (this.theOrderList[i].ROOMID == this.leftTabsValue) {
            this.dealTotalData(i);
            break;
          }
        }
      },
      changeTab(tab, event) {
        this.seltabForTotal();
      },
      changeNumber(value) {
        this.seltabForTotal();
      },
      settheVipPrice(goodsItem, type, value) {
        return settheVipPrice_Fun(goodsItem, this.selmember, type, value);
      },
      changeSelMember() { // 选择会员重设折扣
        for (let i = 0; i < this.theOrderList.length; i++) {
          if (!this.theOrderList[i].List) continue;
          let itemList = this.theOrderList[i].List;
          for (let j = 0; j < itemList.length; j++) {
            let dd = this.settheVipPrice(itemList[j], 2);
            this.theOrderList[i].List[j] = Object.assign({}, itemList[j], dd)
          }
        }
        this.seltabForTotal();
      },
      changeDP(index, i, type, vv) { //更改折扣,实销价
        let itemData = this.theOrderList[index].List[i];
        if (itemData.VIPPRICE && itemData.VIPPRICE > 0 && Object.keys(this.selmember).length > 0) {
          return;
        }

        let msg = type == 1 ? "请输入1~100的百分比折扣数值" : "请输入实销价内容";
        let patrn = type == 1 ? /^[0-9]*$/ : /^\d+(\.\d+)?$/;
        let ivalue = null;
        if (vv > 0) {
          ivalue = type == 1 ? vv * 100 : vv;
        }

        this.$prompt(msg, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputType: "number",
          inputValue: ivalue,
          inputPattern: patrn,
          inputErrorMessage: "数值格式不正确"
        })
          .then(({
            value
          }) => {
            let val = 0, dd = new Object();
            if (type == 1) {
              val = parseFloat(value) > 100 ? 0 : parseFloat(value) / 100;
              dd = this.settheVipPrice(itemData, 3, val);
            } else {
              val = parseFloat(value).toFixed(2);
              dd = this.settheVipPrice(itemData, 4, val);
            }

            this.theOrderList[index].List[i] = Object.assign({}, itemData, dd);
            this.theOrderList = [...this.theOrderList];
            this.seltabForTotal();
          })
          .catch(() => { });
      },
      changeRoom(item) {
        // 更换房台
        for (let i = 0; i < this.theOrderList.length; i++) {
          if (this.theOrderList[i].ROOMID == this.leftTabsValue) {
            this.theOrderList[i] = Object.assign({}, item, {
              List: this.theOrderList[i].List,
              total: this.theOrderList[i].total
            });
            this.leftTabsValue = item.ROOMID;
            break;
          }
        }
        this.theOrderList = [...this.theOrderList];
      },

      sortGoodsDetail(arr) { // 保存
        let gList = [],
          tnum = 0,
          tprice = 0,
          tdiscount = 0;
        for (let i = 0; i < arr.length; i++) {
          if (!arr[i].List) continue;
          for (let j = 0; j < arr[i].List.length; j++) {
            let item = arr[i].List[j], ee = {};
            let dd = this.settheVipPrice(item, 2);
            let newItem = {
              RoomId: arr[i].ROOMID,
              GoodsId: item.ID,
              Id: item.gid ? item.gid : "", // 包含Id(新增时无需传值),GoodsId,Qty,Price,Discount,Remark,RoomId,SaleEmpId
              IsCancel: 0,
              Price: dd.price,
              Qty: item.num,
              Discount: dd.discount,
              Remark: arr[i].remark ? arr[i].remark : ""
            }

            if (item.empList && item.empList.length > 0) {
              let eObj = {}
              item.empList.forEach(item => {
                eObj = Object.assign(eObj, item)
              })
              if (eObj.EmpId1) {
                ee.SaleEmpId = arr[i].SALEEMPID ? arr[i].SALEEMPID : eObj.EmpId1;
                ee.SaleEmpMoney = eObj.EmpMoney1
              }
              if (eObj.EmpId2) {
                ee.SaleEmpId2 = eObj.EmpId2;
                ee.SaleEmpMoney2 = eObj.EmpMoney2
              }
              if (eObj.EmpId3) {
                ee.SaleEmpId3 = eObj.EmpId3;
                ee.SaleEmpMoney3 = eObj.EmpMoney3
              }
            }
            gList.push(Object.assign({}, newItem, ee));

            tnum += parseInt(newItem.Qty);
            tprice += parseFloat(dd.retailprice) * parseInt(newItem.Qty);
            if (newItem.Discount && parseFloat(newItem.Discount) > 0) {
              tdiscount += parseFloat(dd.retailprice) * parseInt(newItem.Qty) * (1 - parseFloat(newItem.Discount));
            }
          }
        }
        return {
          gList,
          tnum,
          tprice,
          tdiscount
        }
      },
      changeGoodsDetail(arr1, arr2) {
        /**
         * 编辑商品增或删
         * arr1=新商品列表，arr2=旧商品列表
         *
         *  */
        let newArr = [...arr2],
          addArr = [...arr1];
        for (let i = 0; i < arr2.length; i++) {
          newArr[i] = Object.assign({}, arr2[i], {
            IsCancel: 1
          })
          for (let j = 0; j < arr1.length; j++) {
            let element = arr1[j];
            if (arr2[i].GoodsId == element.GoodsId && arr2[i].RoomId == element.RoomId) {
              newArr[i] = Object.assign({}, element)
              delete addArr[j];
            }
          }
        }
        for (let i = 0; i < addArr.length; i++) {
          if (addArr[i]) newArr.push(addArr[i]);
        }
        return newArr
      },
      clearSEL() {
        this.$store.dispatch("selectingRoom", new Array());
        this.$store.dispatch("clearRoomAll", 1);
        this.$store.dispatch("clearMember", 8);
      },
      handleClickTime(type, item) { // 计时
        if (type == "startTime") {
          this.$store.dispatch("getRoomOrderTime", {
            RoomId: item.ROOMID,
            BillId: item.BILLID,
            Status: 1 // 1=开始，-1=暂停，其他=自动
          });
        }
        if (type == "stopTime") {
          this.$store.dispatch("getRoomOrderTime", {
            RoomId: item.ROOMID,
            BillId: item.BILLID,
            Status: -1 // 1=开始，-1=暂停，其他=自动
          });
        }
      },

      defaultData() {
        this.theOrderList = [...this.selroom]; // 当前已选房台
        this.leftTabsValue = this.selroom[0].ROOMID;

        if (this.selroom.length == 0) {
          this.back();
        }
        if (this.theOrderList.length > 0) {
          if (this.ptype > 1) {
            let ddata = this.sortGoodsDetail(this.theOrderList);
            this.oldOrderList = [...ddata.gList];
            this.remark = this.dataItem.data.Obj.REMARK;
            if (this.dataItem.rid) this.leftTabsValue = this.dataItem.rid
          } else {
            this.oldOrderList = [];
          }
          this.dealTotalData(0);
        }

        if (this.employeeList.length == 0) {
         this.$store.dispatch("getEmployeeList", { ShopId: getHomeData().shop.ID });
        }
      }
    },
    mounted() {
      this.defaultData();
    },
    activated() {
      this.defaultData();
    },

  },
  DEAL_ORDER: {
    data() {
      return {
        totalTotal: {
          type: 0,
          data: {},
          num: 0,
          price: 0, // 总金额
          discount: 0, // 折扣金额
        },
        VipId: "",
      }
    },
    computed: {
      ...mapGetters({
        selroom: "selroom",
        selmember: "selmember",
        roomOrderState: 'roomOrderState'
      })
    },
    watch: {
      roomOrderState(data) {
        if (data.success && this.loading) { // 结账成功
          let qresurl = this.$store.state.commodityc.saveQRcodeIMG;
          getDayindate("601020406", data.data.OutBillId, 1, qresurl);
          this.$store.dispatch("clearRoomAll", 0).then(() => {
            if (this.totalTotal.data) {
              this.closeModal_checkout(true)
            } else {
              this.resetData(true);
            }
          });
        }
        this.loading = false;
        this.$message({
          showClose: true,
          message: data.message,
          type: data.success ? "success" : "error"
        });
      }
    },
    methods: {
      settheVipPrice(goodsItem, type, value) {
        // DEAL_ORDER
        return settheVipPrice_Fun(goodsItem, this.selmember, type, value);
      },
      dealselRoomData(arr, billItem) { // 单据详情数据处理
        console.log('单据详情数据处理');
        let gList = [...arr.GoodsList],
          rList = [...arr.RoomList],
          vip = arr.VipObj ?
            Object.assign({}, arr.VipObj) : {};
        let newArr = [],
          tnum = 0,
          tprice = 0,
          tdiscount = 0;

        this.$store.dispatch("selectingMember", {
          isArr: false,
          data: vip
        }).then(() => {
          this.VipId = Object.keys(vip).length > 0 ? vip.ID : '';
        });

        for (let i = 0; i < rList.length; i++) {
          let aa = this.dataList.find(
            element => element.ROOMID == rList[i].ROOMID
          );
          newArr.push(Object.assign({
            List: []
          }, aa, rList[i]));
          for (let j = 0; j < gList.length; j++) {
            // 接口返回没有服务折扣 SERVICEDISCOUNT
            let item = Object.assign({ SERVICEDISCOUNT: gList[j].GOODSMODE == 1 ? gList[j].DISCOUNT : 1, }, gList[j]);
            if (rList[i].ROOMID == item.ROOMID) {
              let arr1 = [],
                arr2 = [];
              if (item.SALEEMPID&&item.SALEEMPNAME) {
                arr1.push({
                  EmpId1: item.SALEEMPID,
                  EmpMoney1: item.SALEEMPMONEY
                });
                arr2.push(item.SALEEMPNAME + item.SALEEMPMONEY + '元');
              }
              if (item.SALEEMPID2&&item.SALEEMPNAME2) {
                arr1.push({
                  EmpId2: item.SALEEMPID2,
                  EmpMoney2: item.SALEEMPMONEY2
                });
                arr2.push(item.SALEEMPNAME2 + item.SALEEMPMONEY2 + '元');
              }
              if (item.SALEEMPID3&&item.SALEEMPNAME3) {
                arr1.push({
                  EmpId3: item.SALEEMPID3,
                  EmpMoney3: item.SALEEMPMONEY3
                });
                arr2.push(item.SALEEMPNAME3 + item.SALEEMPMONEY3 + '元');
              }

              let dd = this.settheVipPrice(item, 1);
              let newItem = Object.assign({
                ID: item.GOODSID,
                NAME: item.GOODSNAME,
                PRICE: item.GOODSPRICE,
                gid: item.ID,
                num: item.QTY,
                empList: [...arr1], // 业绩员工 {EmpId1,EmpMoney1}
                empListLabel: [...arr2] // 业绩员工 ['1','2']
              }, item, dd);
              newArr[i].List.push(newItem);
              tnum += parseInt(newItem.num);
              tprice += parseFloat(newItem.retailprice) * parseInt(newItem.num);
              if (newItem.discount && parseFloat(newItem.discount) > 0) {
                tdiscount += parseFloat(newItem.retailprice) * parseInt(newItem.num) * (1 - parseFloat(newItem.discount));
              }
            }
          }
        }
        this.totalTotal = {
          price: parseFloat(tprice).toFixed(2),
          num: tnum,
          discount: tdiscount
        }
        this.$store.dispatch("selectingRoom", newArr);
        this.$store.dispatch("selectingRoomorder", billItem);
      },
      CashRecharge(data) { // 房台消费结帐
        let method = 'checkoutRoomOrder';
        let bid = this.dataItem.data.Obj.BILLID;
        if (!bid) {
          this.$message({
            message: '单据不存在，请重新选择',
            type: 'warning'
          });
          return;
        }
        let sendData = {
          NoteBillId: bid,
          VipId: "",
          PaytypeId: data.PaytypeId, // 付款方式
          GetIntegral: data.GetIntegral, // 获得积分
          IsSms: ~~data.IsSms, // 是否发短信
          PayIntegral: data.PayIntegral, // 抵现积分
          IntegralMoney: data.IntegralMoney, // 抵现金额
          FavorMoney: data.FavorMoney, // 优惠金额
          CouponNo: data.CouponNo, // 优惠券号
          OtherMoney: 0,
          Remark: ""
        }

        if (this.VipId) {
          sendData.VipId = this.VipId;
        }
        if (this.totalTotal.data&&Object.keys(this.totalTotal.data).length>0) {
          sendData = Object.assign(sendData, this.totalTotal.data);
          method = 'checkoutRoomOrder2';  // 房台消费结帐(含订单修改)
        }
        this.$store.dispatch(method, sendData).then(() => {
          this.loading = true;
        });
      }
    },
    mounted() {
      this.totalTotal = {
        type: 0,
        data: {},
        num: 0,
        price: 0,
        discount: 0
      };
    },
    activated() {
      this.totalTotal = {
        type: 0,
        data: {},
        num: 0,
        price: 0,
        discount: 0
      };
    },
  },

}


