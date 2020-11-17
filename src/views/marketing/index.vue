<template>
   <el-container>
      <el-header style="height: 50px">
         <headerPage :hiddenTitle="hiddenTitle"></headerPage>
      </el-header>
      <el-container>
         <el-aside width="100px">
            <section style="min-width: 100px">
               <memberMenu
                  :activePath="activePath"
                  :routesList="routesList"
                  :width="100"
               ></memberMenu>
            </section>
         </el-aside>
         <el-container>
            <div
               class="content-new-fex"
               :style="`height:${clientHeight}px; background:#fff; margin: 10px`"
            >
               <div class="content-table-center">
                  <el-row :gutter="10" v-for="(item, i) in list" :key="i">
                     <el-col :xs="24" class="font-600 font-14 m-bottom-sm">
                        {{ item.title }}
                     </el-col>
                     <el-col
                        :xs="24"
                        :sm="8"
                        :xl="8"
                        v-for="(item1, ii) in item.children"
                        :key="ii"
                     >
                        <a
                           @click="toFollowLink(item1.url, item1.number)"
                           class="rounded-xs block padding-sm m-bottom-md pointer"
                           style="background: #f7f8fa"
                        >
                           <img
                              :src="item1.img"
                              class="inline-block pull-left m-right-sm"
                              style="width: 50px; height: 50px"
                           />
                           <div class="itt">{{ item1.title }}</div>
                           <div class="itt1">{{ item1.des }}</div>
                        </a>
                     </el-col>
                  </el-row>
               </div>
            </div>
         </el-container>
      </el-container>
   </el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXNINS_EXPORT from "@/mixins/exportData.js";
import MIXINS_MARKETING from "@/mixins/marketing.js";
import img1 from "@/assets/card_img1.png";
import img2 from "@/assets/card_img2.png";
import img3 from "@/assets/card_img3.png";
import img4 from "@/assets/card_img4.png";
import img5 from "@/assets/card_img5.png";
import img6 from "@/assets/card_img6.png";
import img7 from "@/assets/card_img7.png";
import img8 from "@/assets/card_img8.png";
import img9 from "@/assets/card_img9.png";
import img10 from "@/assets/card_img10.png";
import img11 from "@/assets/card_img11.png";
import img12 from "@/assets/card_img12.png";
import { getUserInfo } from "@/api/index";

export default {
   mixins: [MIXINS_MARKETING.MARKETING_MENU],
   data() {
      return {
         hiddenTitle: true,
         clientHeight: document.body.clientHeight - 70,
         list: [
            {
               title: "卡券中心",
               children: [
                  {
                     title: "优惠券",
                     des: "发放优惠券刺激消费",
                     url: "/gameGoodsCoupon",
                     img: img1,
                     number: "92100501"
                  },
                  {
                     title: "定向优惠券",
                     des: "向指定会员发放优惠券",
                     // url: "/memberCoupon",
                     url: "/directionalCoupon",
                     img: img2,
                     number: "92100502"
                  },
                  {
                     title: "批量发券",
                     des: "一次发多张优惠券给指定会员",
                     url: "/lotGroup",
                     img: img3,
                     number: "92100503"
                  }
               ]
            },
            {
               title: "营销工具",
               children: [
                  {
                     title: "注册有礼",
                     des: "注册赠送积分、优惠券",
                     url: "/RegisterGifts",
                     img: img4,
                     number: "92100504"
                  },
                  {
                     title: "充值赠送",
                     des: "充值赠送积分",
                     url: "/Recharge",
                     img: img5,
                     number: "92100505"
                  },
                  {
                     title: "限时特价",
                     des: "指定时间商品特价优惠",
                     url: "/Specials",
                     img: img6,
                     number: "92100506"
                  }
               ]
            },
            {
               title: "微信营销",
               children: [
                  {
                     title: "微信会员卡",
                     des: "微信平台会员卡定制",
                     url: "/weiXinVipCard",
                     img: img8,
                     number: "92100507"
                  },
                  {
                     title: "微信优惠商品",
                     des: "发布优惠商品到微信平台",
                     url: "/weiXinGoods",
                     img: img9,
                     number: "92100509"
                  },
                  {
                     title: "微信活动海报",
                     des: "发布活动海报到微信平台",
                     url: "/weiXinPromotion",
                     img: img10,
                     number: "92100508"
                  }
               ]
            },
            {
               title: "店铺工具",
               children: [
                  {
                     title: "群发短信",
                     des: "向会员发送短信",
                     url: "/groupSMS",
                     img: img11,
                     number: "92100510"
                  }
                  // {
                  //   title: '积分清零',
                  //   des:'积分清零',
                  //   url:'/IntegralReset',
                  //   img: img12,
                  //   number: "210040311"
                  // }
               ]
            }
         ]
      };
   },
   methods: {
      toFollowLink(path, number) {
         let agentPermission = getUserInfo().List;
         let arr = agentPermission.filter(element => element.MODULECODE == number);
         if (arr.length > 0 && !this.isPurViewFun(number)) {
            this.$message.warning("您还没有获得相关权限!");
         } else {
            this.$store.dispatch("selectingMember", { isArr: false, data: {} });
            this.$router.push({ path: path });
            // console.log('')
         }
      }
   },
   components: {
      headerPage: () => import("@/components/header")
   }
};
</script>
<style scoped>
.member-header {
   display: flex;
   align-items: center;
   height: 50px;
}
.center-title {
   width: 100px;
   text-align: center;
   height: 50px;
   line-height: 50px;
   border: solid 1px #d7d7d7;
}
.center-cont {
   width: 100px;
   text-align: center;
   height: 50px;
   line-height: 50px;
}
.el-header {
   padding: 0 !important;
}
.shop {
   display: flex;
   align-items: center;
   height: 50px;
   position: relative;
}
.shop .name {
   position: absolute;
   right: 50px;
   height: 50px;
   line-height: 50px;
   width: 150px;
   text-align: center;
   top: 0;
   /* background: rebeccapurple; */
}
.el-header,
.el-footer {
   background-color: #fff;
   color: #333;
}

.el-aside {
   background-color: #d3dce6;
   color: #333;
   text-align: center;
   line-height: 200px;
}

.el-main {
   background-color: #f4f5fa;
   color: #333;
}
.member-main-top {
   width: 99%;
   margin-left: 0.5%;
   margin-right: 0.5%;
   height: 150px;
   background: #fff;
}
.member-main-table {
   margin-top: 8px;
   width: 99%;
   margin-left: 0.5%;
   margin-right: 0.5%;
   height: 600px;
   background: #fff;
}
.member-main-top-buttom {
   height: 70px;
   width: 100%;
   line-height: 70px;
}
.member-main-top-type {
   height: 70px;
   width: 100%;
   line-height: 70px;
}
.itt {
   height: 23px;
   line-height: 23px;
   font-size: 14px;
   margin-top: 2px;
}
.itt1 {
   margin-top: 4px;
   height: 23px;
   line-height: 23px;
   font-size: 12px;
   color: #aaa;
}
</style>
