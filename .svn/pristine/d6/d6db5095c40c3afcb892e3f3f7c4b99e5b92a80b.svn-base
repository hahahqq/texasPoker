<template>
   <div>
      <el-container>
         <el-main style="background:#fff; margin: 10px;">
            <div class="content-table full-width">
               <div class="content-table-center" style="padding-top:0">
                  <div style="width: 60%; background:#fef0f0; padding:6px 10px; border:1px solid #fbc4c4; border-radius:5px ">
                     <span>
                        <i class="el-icon-info" style="color:#f56c6c; font-size: 14px" ></i>
                        如需打印小票，请下载打印插件并完成安装
                        <el-button size='mini' type="primary" class="m-left-md">
                           <a href="static/images/CLodop_Setup.exe" title>点击下载</a>
                        </el-button>
                     </span>
                  </div>

                     <div class="print row-flex flex-start m-top-sm">
                        <section class="printEG">
                           <div class="top">
                              <div class="font-16 text-center m-top-sm overflow-hidden" v-if="printList.title.isShow">{{printList.title.value}}</div>
                              <div class="text-center paddingTB-xs" >{{shopName}}_销售小票</div>

                              <template v-for="(item,i) in billInfo">
                                 <div class="marginTB-xxs" :key="i">
                                    <span>{{item.label}}</span>
                                    <span>{{item.value}}</span>
                                 </div>
                              </template>

                              <div class="marginTB-xxs" v-if='printList.saleEmploy.isShow'>
                                 <span>{{printList.saleEmploy.label}}：</span>
                                 <span>{{printList.saleEmploy.value}}</span>
                              </div>

                              <div class="line"><i></i></div>
                           </div>

                           <div class="center">

                              <ul>
                                 <li class="row-flex" >
                                    <span style="width:25%;">商品</span>
                                    <span style="width:25%; text-align:center">单价</span>
                                    <span style="width:25%; text-align:center">数量</span>
                                    <span style="width:25%; text-align:center">金额</span>
                                 </li>
                                 <li v-for="(item,i) in goodsList" :key="i" class="row-flex" >
                                    <span style="width:25%;">{{item.name}}</span>
                                    <span style="width:25%; text-align:center">{{item.purPrice}}</span>
                                    <span style="width:25%; text-align:center">{{item.qty}}</span>
                                    <span style="width:25%; text-align:center">{{item.price}}</span>
                                 </li>
                              </ul>

                              <div class="line"><i></i></div>

                              <template v-for="(item1,j) in saleInfo">
                                 <div class="marginTB-xxs" :key="j">
                                    <span>{{item1.label}}</span>
                                    <span>{{item1.value}}</span>
                                 </div>
                              </template>

                              <!-- 会员信息 -->
                              <div class="line" v-if='printList.vipInfo[0].isShow || printList.vipInfo[1].isShow || printList.vipInfo[2].isShow'> <i></i></div>

                              <template v-for="(item1,j) in printList.vipInfo">
                                 <div class="marginTB-xxs" :key="j+'1'" v-if="item1.isShow">
                                    <span>{{item1.label}}：</span>
                                    <span>{{item1.value}}</span>
                                 </div>
                              </template>

                              <!-- 备注 -->
                              <div class="marginTB-xxs" v-if='printList.remark.isShow'>
                                 <div class="line"><i></i></div>

                                 <span>{{printList.remark.label}}：</span>
                                 <span>{{printList.remark.value}}</span>
                              </div>

                              <!-- 联系电话 -->
                              <div class="line"><i></i></div>
                              <div class="marginTB-xxs" v-if='printList.phone.isShow'>
                                 <span>{{printList.phone.label}}：</span>
                                 <span>{{printList.phone.value}}</span>
                              </div>

                              <!-- 联系地址 -->
                              <div class="marginTB-xxs" v-if='printList.address.isShow'>
                                 <span>{{printList.address.label}}：</span>
                                 <span>{{printList.address.value}}</span>
                              </div>

                              <!-- 注脚 、 二维码 -->
                              <div class="text-center m-top-md">
                                 <div class="marginTB-xxs overflow-hidden" v-if="printList.footNote.isShow">{{printList.footNote.value}}</div>
                                 <img :src="printList.shopQRCode.value" style="width:100px" v-if="printList.shopQRCode.isShow" />
                              </div>
                           </div>

                           <div class="bottom"> </div>
                        </section>

                        <div style="width: 340px; height: 430px; border:1px solid #ddd; border-radius: 6px; box-shadow: -5px 5px 5px #ddd;" class="m-top-md padding-md m-left-md " >
                           <div style="margin-bottom:12px;">
                              <span>自动打印小票</span>
                              <el-switch v-model="printList.autoPrint" active-color="#rgb(251, 120, 154)" inactive-color="##9E9E9E" class="pull-right" ></el-switch>
                           </div>

                           <div class="row-flex flex-between flex-items-center" style="margin-bottom:12px;" >
                              <span>打印小票份数</span>
                              <el-select size="mini" v-model="printList.setupPrintnum" placeholder="请选择" style="width:80px; float:right" >
                                 <el-option size="mini" v-for="(v,k) in [1,2,3,4,5]" :key="k" :label="v+' 份'" :value="v"></el-option>
                              </el-select>
                           </div>

                           <div class="row-flex">
                              <el-checkbox v-model="printList.title.isShow" class="marginTB-xs" style="width:100px;">{{printList.title.label}}</el-checkbox>
                              <a class="m-top-xs inline-block border-bottom full-width pointer" @click="changeLabel(printList.title)">{{printList.title.value}}</a>
                           </div>

                           <div class="row-flex">
                              <el-checkbox v-model="printList.footNote.isShow" class="marginTB-xs" style="width:100px;">{{printList.footNote.label}}</el-checkbox>
                              <a class="m-top-xs inline-block border-bottom full-width pointer" @click="changeLabel(printList.footNote)">{{printList.footNote.value}}</a>
                           </div>

                           <!-- 店铺信息 -->
                           <div style="font-size:14px; margin-top: 10px; font-weight:bold"> 店铺信息</div>
                           <div class="shopInfoItem" style="display:table">
                              <el-checkbox v-model="printList.phone.isShow">{{printList.phone.label}}</el-checkbox>
                              <el-checkbox v-model="printList.address.isShow">{{printList.address.label}}</el-checkbox>
                              <el-checkbox v-model="printList.shopQRCode.isShow">{{printList.shopQRCode.label}}</el-checkbox>
                              <el-checkbox v-model="printList.remark.isShow">{{printList.remark.label}}</el-checkbox>
                              <el-checkbox v-model="printList.saleEmploy.isShow">{{printList.saleEmploy.label}}</el-checkbox>
                           </div>

                           <!-- 会员信息 -->
                           <div style="display:table; font-size:14px; margin-top: 10px; font-weight:bold"> 会员信息</div>
                           <div class="shopInfoItem">
                              <div v-for="(item,ii) in printList.vipInfo" :key="ii" >
                                 <el-checkbox v-model="item.isShow">{{item.label}}</el-checkbox>
                              </div>
                           </div>

                           <div style="border-top: 1px dashed #ddd; display:table; width: 100%; padding-top: 30px">
                              <el-button size="small" type="info" plain style="float:left" @click="testPrint()">测试打印</el-button>
                              <el-button size="small" type="primary" style="float:right" @click="savePrintRules">保存</el-button>
                           </div>
                        </div>
                     </div>
               </div>
            </div>
         </el-main>
      </el-container>
   </div>
</template>

<script>
import qrcode from "@/assets/qrcode.png";
import { getDayindata } from "@/util/testPrinting";
import MIXINS_SETUP from "@/mixins/setup";
import { SYSTEM_INFO } from "@/util/define.js";
import { getHomeData, getUserInfo } from '@/api/index'
export default {
    mixins: [MIXINS_SETUP.SIDERBAR_MENU],
    data() {
       return{
          height: document.body.clientHeight-80,
          shopName: getHomeData().shop.SHOPNAME,
          saleInfo: [
            {
               label: "商品总数：", value: '2'
            },
            {
               label: "金额合计：", value: '48'
            },
            {
               label: "优惠金额：", value: '5'
            },
            {
               label: "实付金额：", value: '43'
            },
            {
               label: "支付方式：", value: '微信'
            }
         ],
         goodsList:[
            {
               name: "红烧肉",
               purPrice: 20,
               qty: "1",
               price: "20"
            },
            {
               name: "鱼香肉丝",
               purPrice: 28,
               qty: "1",
               price: "28"
            },
         ],
         billInfo: [
            {
               label: "结账单号：",
               value: "202010191134001"
            },
            {
               label: "结账日期：",
               value: "2014-06-19 15:04"
            }
         ],
         printList: {
            autoPrint: false,
            setupPrintnum: '1',
            title:{
               label: "标题",
               value: SYSTEM_INFO.NAME,
               isShow: true
            },
            footNote:{
               label: "注脚",
               value: "谢谢惠顾，欢迎下次光临!",
               isShow: true
            },
            shopQRCode:{
               label: "店铺二维码",
               value: qrcode,
               isShow: true
            },
            phone:{
               label: "联系电话",
               value: getHomeData().shop.PHONENO,
               isShow: true
            },
            address: {
               label: "联系地址",
               value: getHomeData().shop.ADDRESS,
               isShow: true
            },
            remark:{
               label: "备 注",
               value: '',
               isShow: true
            },
            saleEmploy: {
               label: "收 银 员",
               value: getUserInfo().UserName,
               isShow: true
            },
            vipInfo: [
               {
                  label: '会员卡号',
                  value: '100001',
                  isShow: true
               },
               {
                  label: '会员姓名',
                  value: '张三',
                  isShow: true
               },
               {
                  label: '储值积分',
                  value: '1800',
                  isShow: true
               }
            ]
         },
       }
    },
    computed: {

    },
    methods:{
       testPrint(){
          let printData = Object.assign({}, this.printList, { billInfo: this.billInfo }, { saleInfo: this.saleInfo }, { goodsList: this.goodsList } )
          let qresurl = this.$store.state.commodityc.saveQRcodeIMG;
          getDayindata(printData, 'print2', qresurl)
       },
       savePrintRules(){
         localStorage.setItem( SYSTEM_INFO.PREFIX + 'Print2', JSON.stringify(this.printList))
         console.log(this.printList)
         this.$message.success('保存成功 ！')
       },
      changeLabel(item) {
         this.$prompt("请输入" + item.label + "内容", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputValue: item.value
         }).then(({ value }) => {
            item.value = value;
         }).catch(() => { })
      }
    },
    mounted(){
      let printRules = localStorage.getItem(SYSTEM_INFO.PREFIX +'Print2')
      if(printRules == null){
         localStorage.setItem(SYSTEM_INFO.PREFIX + 'Print2', JSON.stringify(this.printList))
      }else{
         this.printList = JSON.parse(printRules)
      }
    },
    components: {
      headerPage: () => import("@/components/header")
    }
}
</script>

<style scoped>
.shopInfoItem>>>.el-checkbox{
   margin-right:0 !important;
   float:left;
   width: 50%;
   margin-top: 5px;
   margin-bottom: 5px
}
.printEG .marginTB-xxs {
    margin: 5px 0px;
}

.printEG .line {
    padding: 5px 0;
    position: relative;
}

.printEG .line > i {
    display: block;
    height: 1px;
    border-bottom: 1px dashed rgb(0, 0, 0);
}

.printEG > .center > ul {
    padding: 3px 0;
    line-height: 1.5;
}

.print .line2 {
    border-bottom: 2px dashed #ccc;
}

</style>
