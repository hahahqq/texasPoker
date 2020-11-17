import Main from "@/views/Main.vue";
import MoneyIndex from "@/views/money/index.vue";

import Setup from "@/views/setup/index.vue";

let routes = [
   {
      path: "",
      redirect: {
         path: "/login"
      },
      hidden: true
   },
   {
      path: "/login",
      component: () => import("@/views/login/index.vue"),
      name: "",
      hidden: true
   },
   {
      path: "/",
      component: Main,
      name: "",
      iconCls: "icon-home", //图标样式class
      leaf: true, //只有一个节点
      hidden: false,
      children: [
         {
            path: "/home",
            component: () => import("@/views/home/index.vue"),
            name: "首页",
            meta: {
               title: "首页中心"
            }
         }
      ]
   },

   {
      path: "/",
      component: Main,
      name: "",
      iconCls: "icon-credit-card", //图标样式class
      leaf: true, //只有一个节点
      children: [
         {
            path: "/game",
            component: () => import("@/views/game/match/index.vue"),
            name: "赛事",
            redirect: {
               path: "/game/match/index"
            },
            hidden: true
         },

         {
            path: "/game/match/index",
            component: () => import("@/views/game/match/index.vue"),
            name: "赛事报名",
            modulecode: "92100101",
            meta: {
               parent: "game",
               title: "赛事中心"
            }
         },
         {
            path: "/game/match/verityBill",
            component: () => import("@/views/game/match/verityBill.vue"),
            name: "verityBill",
            meta: { parent: "game", title: "赛事中心" },
            hidden: true
         },

         {
            path: "/game/events/index",
            component: () => import("@/views/game/events/index.vue"),
            name: "比赛项目",
            modulecode: "92100102",
            meta: {
               parent: "game",
               title: "赛事中心"
            }
         },
         {
            path: "/game/cPManagement",
            component: () => import("@/views/game/cPManagement.vue"),
            name: "彩池管理",
            meta: {
               parent: "game",
               title: "赛事中心"
            },
            hidden: true
         },
         {
            // sng赛详情
            path: "/game/match/sngDetails",
            component: () => import("@/components/game/match/sng/sng_details.vue"),
            name: "sngDetails",
            modulecode: "92100101",
            meta: {
               parent: "game",
               title: "赛事中心"
            },
            hidden: true
         },
         {
            // mtt赛详情
            path: "/game/match/mttDetails",
            component: () => import("@/components/game/match/mtt/mtt_details.vue"),
            name: "mttDetails",
            modulecode: "92100101",
            meta: {
               parent: "game",
               title: "赛事中心"
            },
            hidden: true
         },
         {
            // 积分赛详情
            path: "/game/match/integralDetails",
            component: () => import("@/components/game/match/integral/integral_details.vue"),
            name: "integralDetails",
            modulecode: "92100101",
            meta: {
               parent: "game",
               title: "赛事中心"
            },
            hidden: true
         }
      ]
   },

   {
      path: "/",
      component: Main,
      name: "",
      iconCls: "icon-sitemap",
      leaf: true,
      children: [
         {
            path: "/money",
            component: MoneyIndex,
            name: "收银",
            redirect: {
               path: "/money/commoditycPage"
            },
            hidden: true
         },
         {
            path: "/money/commoditycPage",
            component: () => import("@/views/money/commodityc.vue"),
            name: "商品消费",
            modulecode: "92100103",
            meta: {
               name: "shop",
               parent: "money"
               // deskmode:1,//1代表服务行业
            }
         },
         {
            path: "/money/fastcPage",
            component: () => import("@/views/money/fastc.vue"),
            name: "快速消费",
            modulecode: "92100104",
            meta: {
               name: "fastc",
               parent: "money"
               // deskmode:2,
            }
         },
         {
            path: "/money/storagevaluerPage",
            component: () => import("@/views/money/storagevaluer.vue"),
            name: "会员充值",
            modulecode: "92100105",
            meta: {
               name: "storagevaluer",
               parent: "money"
               // deskmode:1,
            }
         },
         {
            path: "/money/IntegralExchangePage",
            component: () => import("@/views/money/IntegralExchange.vue"),
            name: "会员领奖",
            modulecode: "92100106",
            meta: {
               name: "member",
               parent: "money"
            },
            hidden: false
         },
         {
            path: "/money/addmemberPage",
            component: () => import("@/views/money/addmember.vue"),
            name: "增加会员",
            meta: {
               name: "member",
               parent: "money",
               title: "增加",
               line: true
            },
            hidden: true
         },
         {
            path: "/money/businesstablePage",
            component: () => import("@/views/money/businesstable.vue"),
            name: "营业查询",
            modulecode: "92100107",
            meta: {
               name: "businesstable",
               parent: "money"
            }
         }
      ]
   },
   {
      path: "/",
      component: Main,
      name: "",
      iconCls: "icon-user",
      leaf: true,
      children: [
         {
            path: "/member",
            component: () => import("@/views/member/member.vue"),
            name: "会员",
            // modulecode: "92100201",
            redirect: {
               path: "/member/MemberList"
            },
            hidden: true
         },
         {
            path: "/member/MemberList",
            component: () => import("@/views/member/member.vue"),
            name: "会员列表",
            modulecode: "92100201",
            meta: {
               name: "shop",
               parent: "member",
               title: "会员中心"
            }
         },
         {
            path: "/MemberItem",
            component: () => import("@/views/member/memberItem.vue"),
            name: "memberItem",
            meta: { parent: "member", title: "会员中心" },
            hidden: true
         },

         {
            path: "/member/discountPage",
            component: () => import("@/views/member/discount.vue"),
            name: "会员等级",
            modulecode: "92100202",
            meta: {
               name: "shop",
               parent: "member",
               title: "会员中心",
               line: true
            }
         },
         {
            path: "/member/Integral",
            component: () => import("@/views/member/integral.vue"),
            name: "积分调整",
            modulecode: "92100203",
            meta: {
               name: "shop",
               parent: "member",
               title: "会员中心"
            }
         },

         {
            path: "/member/vipReminder",
            component: () => import("@/views/member/vipReminder.vue"),
            name: "会员提醒",
            modulecode: "92100204",
            meta: {
               name: "shop",
               parent: "member",
               title: "会员中心",
               line: false
            }
         },

         {
            path: "/member/acceptance",
            component: () => import("@/views/member/acceptance.vue"),
            name: "意见受理",
            modulecode: "92100205",
            meta: {
               name: "shop",
               parent: "member",
               title: "会员中心",
               line: false
            }
         },

         {
            path: "/acceptanceItem",
            component: () => import("@/views/member/acceptanceItem.vue"),
            name: "acceptanceItem",
            meta: { parent: "member", title: "会员中心" },
            hidden: true
         }
      ]
   },
   {
      path: "/",
      component: Main,
      name: "",
      iconCls: "icon-gift",
      leaf: true,
      children: [
         {
            path: "/good",
            component: () => import("@/views/goods/good.vue"),
            name: "商品",
            redirect: {
               path: "/good/GoodList"
            },
            hidden: true
         },
         {
            path: "/good/GoodList",
            component: () => import("@/views/goods/good.vue"),
            name: "商品列表",
            modulecode: "92100301",
            meta: {
               name: "shop",
               parent: "good",
               title: "商品中心"
            }
         },
         {
            path: "/good/GoodsType",
            component: () => import("@/views/goods/item.vue"),
            name: "商品分类",
            modulecode: "92100302",
            meta: {
               name: "shop",
               parent: "good",
               title: "商品中心"
            }
         },
         {
            path: "/good/Goodsunit",
            component: () => import("@/views/goods/index.vue"),
            name: "商品单位",
            modulecode: "92100303",
            meta: {
               name: "shop",
               parent: "good",
               title: "商品中心",
               line: true
            }
         },
         {
            path: "/good/warehousing/addNew",
            component: () => import("@/views/goods/warehousing/head.vue"),
            name: "采购入库",
            modulecode: "92100304",
            meta: {
               name: "shop",
               parent: "good",
               title: "商品中心"
            }
         },
         {
            path: "/good/return/addNew",
            component: () => import("@/views/goods/return/head.vue"),
            name: "采购退货",
            modulecode: "92100305",
            meta: {
               name: "shop",
               parent: "good",
               title: "商品中心"
            }
         },
         {
            path: "/good/allocation/addNew",
            component: () => import("@/views/goods/allocation/head.vue"),
            name: "库存调拨",
            modulecode: "92100306",
            meta: {
               name: "shop",
               parent: "good",
               title: "商品中心"
            }
         },
         {
            path: "/good/inventory/addNew",
            component: () => import("@/views/goods/inventory/head.vue"),
            name: "库存盘点",
            modulecode: "92100307",
            meta: {
               name: "shop",
               parent: "good",
               title: "商品中心",
               line: true
            }
         },
         {
            path: "/good/supplier",
            component: () => import("@/views/goods/supplier.vue"),
            name: "供应商管理",
            modulecode: "92100308",
            meta: {
               name: "shop",
               parent: "good",
               title: "商品中心"
            }
         },
         {
            path: "/good/stockQuery",
            component: () => import("@/views/goods/stockQuery.vue"),
            name: "库存查询",
            modulecode: "92100309",
            meta: {
               name: "shop",
               parent: "good",
               title: "商品中心"
            }
         }
      ]
   },
   {
      path: "/",
      component: Main,
      name: "",
      iconCls: "icon-credit-card", //图标样式class
      leaf: true, //只有一个节点
      children: [
         {
            path: "/defray",
            component: () => import("@/views/defray/index.vue"),
            name: "支出",
            redirect: {
               path: "/defray/defrayList"
            },
            hidden: true
         },
         {
            path: "/defray/defrayList",
            component: () => import("@/views/defray/index.vue"),
            name: "支出明细",
            modulecode: "92100401",
            meta: {
               parent: "defray",
               title: "支出中心"
            }
         },
         {
            path: "/defray/payment",
            component: () => import("@/views/defray/payment.vue"),
            name: "支出项目",
            modulecode: "92100402",
            meta: {
               parent: "defray",
               title: "支出中心"
            }
         },
         {
            path: "/defray/defrayReport",
            component: () => import("@/views/defray/defrayReport.vue"),
            name: "支出分析",
            modulecode: "92100403",
            meta: {
               parent: "defray",
               title: "支出中心",
               line: true
            }
         },
         {
            path: "/defray/moneyAccount",
            component: () => import("@/views/defray/moneyAccount.vue"),
            name: "资金账户",
            modulecode: "92100404",
            meta: {
               parent: "defray",
               title: "支出中心"
            }
         }
      ]
   },
   {
      path: "/",
      component: Main,
      name: "",
      iconCls: "icon-user-md", //图标样式class
      leaf: true, //只有一个节点
      hidden: false,
      children: [
         {
            path: "/marketing",
            component: () => import("@/views/marketing/index.vue"),
            name: "营销",
            redirect: {
               path: "/marketing/bespeakList"
            },
            hidden: true
         },

         {
            path: "/marketing/bespeakList",
            component: () => import("@/views/marketing/index.vue"),
            name: "拓客工具",
            meta: {
               name: "marketing",
               parent: "marketing",
               title: "营销中心"
            }
         },
         {
            path: "/gameGoodsCoupon",
            component: () => import("@/views/marketing/gameGoodsCoupon"),
            name: "优惠券",
            modulecode: "92100501",
            hidden: true,
            meta: { parent: "marketing", title: "营销中心" }
         },

         {
            path: "/getCouponDetails",
            component: () => import("@/views/marketing/getCouponDetails"),
            name: "领券详情",
            modulecode: "92100501",
            hidden: true,
            meta: { parent: "marketing", title: "营销中心" }
         },


         // {
         //    path: "/memberCoupon",
         //    component: () => import("@/views/marketing/memberCoupon"),
         //    name: "定向优惠券",
         //    modulecode: "92100502",
         //    hidden: true,
         //    meta: { parent: "marketing", title: "营销中心" }
         // },

         {
            path: "/directionalCoupon",
            component: () => import("@/views/marketing/directionalCoupon"),
            name: "定向优惠券",
            modulecode: "92100502",
            hidden: true,
            meta: { parent: "marketing", title: "营销中心" }
         },

         {
            path: "/lotGroup",
            component: () => import("@/views/marketing/lotgroup"),
            name: "批量发券",
            modulecode: "92100503",
            hidden: true,
            meta: { parent: "marketing", title: "营销中心" }
         },
         {
            path: "/groupSMS",
            component: () => import("@/views/marketing/groupSMS"),
            name: "群发短信",
            modulecode: "92100510",
            hidden: true,
            meta: { parent: "marketing", title: "营销中心" }
         },
         {
            path: "/RegisterGifts",
            component: () => import("@/views/marketing/RegisterGifts"),
            name: "注册有礼",
            modulecode: "92100504",
            hidden: true,
            meta: { parent: "marketing", title: "营销中心" }
         },
         {
            path: "/weiXinVipCard",
            component: () => import("@/views/marketing/weiXinVipCard.vue"),
            name: "微信会员卡",
            modulecode: "92100507",
            hidden: true,
            meta: { parent: "marketing", title: "营销中心" }
         },
         {
            path: "/weiXinGoods",
            component: () => import("@/views/marketing/weiXinGoods"),
            name: "微信优惠商品",
            hidden: true,
            meta: {
               parent: "marketing",
               title: "营销中心"
            }
         },
         {
            path: "/weiXinPromotion",
            component: () => import("@/views/marketing/weiXinPromotion"),
            name: "微信活动海报",
            hidden: true,
            meta: {
               parent: "marketing",
               title: "营销中心"
            }
         },
         {
            path: "/Recharge",
            component: () => import("@/views/marketing/Recharge"),
            name: "充值赠送",
            modulecode: "92100505",
            hidden: true,
            meta: { parent: "marketing", title: "营销中心" }
         },
         {
            path: "/Specials",
            component: () => import("@/views/marketing/Specials"),
            name: "限时特价",
            modulecode: "92100506",
            hidden: true,
            meta: { parent: "marketing", title: "营销中心" }
         },
         {
            path: "/IntegralReset",
            component: () => import("@/views/marketing/IntegralReset"),
            name: "积分清零",
            modulecode: "92100511",
            hidden: true,
            meta: { parent: "marketing", title: "营销中心" }
         }
      ]
   },
   {
      path: "/",
      component: Main,
      name: "",
      iconCls: "icon-desktop", //图标样式class
      leaf: true, //只有一个节点
      hidden: true,
      children: [
         {
            path: "/bespeak",
            component: () => import("@/views/bespeak/index.vue"),
            name: "预约",
            modulecode: "210040303",
            redirect: {
               path: "/bespeak/bespeakList"
            },
            hidden: true
         },
         {
            path: "/bespeak/bespeakList",
            component: () => import("@/views/bespeak/index.vue"),
            name: "预约服务",
            meta: {
               name: "bespeak",
               parent: "bespeak",
               title: "预约管理"
            }
         },
         {
            path: "/bespeak/WechatList",
            component: () => import("@/views/bespeak/wechat/wechat.vue"),
            name: "预约管理",
            meta: {
               name: "bespeak",
               parent: "bespeak",
               title: "预约管理"
            }
         }
      ]
   },
   // mall
   {
      path: "/",
      component: Main,
      name: "mall",
      iconCls: "icon-inbox",
      leaf: true,
      hidden: false,
      children: [
         {
            path: "/malls",
            name: "商城",
            redirect: { path: "/mall/orderList" },
            hidden: true
         },
         {
            path: "/mall/",
            component: () => import("@/views/mall/index.vue"),
            name: "商城",
            children: [
               {
                  path: "",
                  redirect: { path: "/mall/orderList" },
                  hidden: true
               },
               // {
               //    path: "home",
               //    component: () => import("@/views/mall/home"),
               //    name: "商城首页",
               //    meta: {
               //       name: "home",
               //       parent: "malls",
               //       title: "商城管理"
               //    }
               // },
               {
                  path: "orderList",
                  component: () => import("@/views/mall/order/list"),
                  name: "订单管理",
                  meta: {
                     name: "orderList",
                     parent: "malls",
                     title: "商城管理"
                  }
               },
               {
                  path: "orderItem",
                  component: () => import("@/views/mall/order/item"),
                  name: "详情",
                  meta: {
                     name: "orderList",
                     parent: "malls",
                     title: "商城管理",
                     breadcrumb: [{ label: "订单管理", value: "/mall/orderList" }]
                  },
                  hidden: true
               },
               {
                  path: "refundList",
                  component: () => import("@/views/mall/refund"),
                  name: "售后管理",
                  meta: {
                     name: "refundList",
                     parent: "malls",
                     title: "商城管理"
                  }
               },
               {
                  path: "refundItem",
                  component: () => import("@/views/mall/refund/item"),
                  name: "详情",
                  meta: {
                     name: "refundList",
                     parent: "malls",
                     title: "商城管理",
                     breadcrumb: [{ label: "售后管理", value: "/mall/refundList" }]
                  },
                  hidden: true
               },
               {
                  path: "goods",
                  component: () => import("@/views/mall/goods"),
                  name: "商品上架",
                  meta: {
                     name: "goods",
                     parent: "malls",
                     title: "商城管理",
                     line: true
                  }
               },
               {
                  path: "setting",
                  component: () => import("@/views/mall/setting"),
                  name: "商城管理",
                  meta: {
                     name: "setting",
                     parent: "malls",
                     title: "商城管理"
                  }
               },
               // {
               //   path: 'decorationList',
               //   name: '商城布局',
               //   component: () => import('@/views/mall/decoration/list'),
               //   meta: { name: 'decoration', parent: 'malls', title: '商城管理' }
               // },
               // {
               //   path: 'decorationItem',
               //   name: '商城布局',
               //   component: () => import('@/views/mall/decoration/page'),
               //   meta: { name: 'decoration', parent: 'malls', title: '商城管理' },
               //   hidden: true
               // },
               {
                  path: "setup",
                  component: () => import("@/views/mall/setup"),
                  name: "交易设置",
                  meta: {
                     name: "setup",
                     parent: "malls",
                     title: "商城管理"
                  }
               },
               {
                  path: "freight",
                  component: () => import("@/views/mall/freight/index-old.vue"),
                  name: "运费设置",
                  meta: {
                     name: "freight",
                     parent: "malls",
                     title: "商城管理"
                  }
               },
               // {
               //   path: 'freight',
               //   component: (resolve) => require(['@/views/mall/freight' ),
               //   name: '配送设置',
               //   meta: {
               //     name: 'freight',
               //     parent: 'malls',
               //     title: '商城管理',
               //     buttonGroup: [
               //       { label: '快递发货', value: '/mall/freight' },
               //       { label: '到店自提', value: '/mall/extract' }
               //     ]
               //   }
               // },
               {
                  path: "extract",
                  component: () => import("@/views/mall/extract"),
                  name: "到店自提",
                  meta: {
                     name: "freight",
                     parent: "malls",
                     title: "商城管理",
                     buttonGroup: [
                        { label: "快递发货", value: "/mall/freight" },
                        { label: "到店自提", value: "/mall/extract" }
                     ]
                  },
                  hidden: true
               },
               {
                  path: "postage",
                  component: () => import("@/views/mall/postage"),
                  name: "包邮设置",
                  meta: {
                     name: "postage",
                     parent: "malls",
                     title: "商城管理"
                  }
               }
            ]
         }
      ]
   },
   // mall -^
   {
      path: "/",
      component: Main,
      name: "reports",
      iconCls: "icon-bar-chart",
      leaf: true,
      children: [
         {
            path: "/reports",
            name: "报表",
            redirect: {
               path: "/report/management"
            },
            hidden: true
         },
         {
            path: "/report/",
            component: resolve => require(["@/views/reports/index.vue"], resolve),
            name: "报表",
            children: [
               // {
               //    path: "navigation",
               //    component: () => import("@/views/reports/navigation"),
               //    name: "报表导航",
               //    modulecode: "",
               //    meta: {
               //       title: "报表中心",
               //       line: false,
               //       name: "navigation",
               //       parent: "reports"
               //    }
               // },
               {
                  path: "management",
                  component: () => import("@/views/reports/management"),
                  name: "经营报表",
                  modulecode: "",
                  meta: {
                     title: "报表中心",
                     line: false,
                     name: "management",
                     parent: "reports",
                     buttonGroup: [
                        { label: "营业概况", value: "", modulecode: "92100601" },
                        { label: "收支结余", value: "", modulecode: "92100602" },
                        { label: "收银对账", value: "", modulecode: "92100603" }
                     ]
                  }
               },
               {
                  path: "match",
                  component: () => import("@/views/reports/match"),
                  name: "赛事分析",
                  modulecode: "",
                  meta: {
                     title: "报表中心",
                     line: false,
                     name: "match",
                     parent: "reports",
                     buttonGroup: [
                        { label: "赛事盈利分析", value: "", modulecode: "92100604" },
                        { label: "比赛项目排行", value: "", modulecode: "92100605" },
                        { label: "消费时段分析", value: "", modulecode: "92100606" }
                     ]
                  }
               },
               {
                  path: "sale",
                  component: () => import("@/views/reports/sale"),
                  name: "销售分析",
                  modulecode: "",
                  meta: {
                     title: "报表中心",
                     name: "sale",
                     parent: "reports",
                     buttonGroup: [
                        { label: "销售分析", value: "", modulecode: "92100607" },
                        { label: "商品分析", value: "", modulecode: "92100608" },
                        { label: "店铺分析", value: "", modulecode: "92100609" }
                     ]
                  }
               },
               {
                  path: "member",
                  component: () => import("@/views/reports/member"),
                  name: "会员分析",
                  modulecode: "",
                  meta: {
                     title: "报表中心",
                     name: "member",
                     parent: "reports",
                     buttonGroup: [
                        { label: "会员分析", value: "", modulecode: "92100610" },
                        // { label: "会员RFM分析", value: "", modulecode: "92100611" },
                        { label: "会员注册分析", value: "", modulecode: "92100612" }
                     ]
                  }
               },
               {
                  path: "statistics",
                  component: () => import("@/views/reports/statistics"),
                  name: "统计报表",
                  modulecode: "",
                  meta: {
                     title: "报表中心",
                     name: "statistics",
                     parent: "reports",
                     buttonGroup: [
                        { label: "会员充值", value: "", modulecode: "92100613" },
                        { label: "比赛登记", value: "", modulecode: "92100614" },
                        { label: "奖励积分", value: "", modulecode: "92100615" },
                        { label: "积分调整", value: "", modulecode: "92100616" },
                        { label: "商品销售", value: "", modulecode: "92100617" },
                        { label: "快速消费", value: "", modulecode: "92100618" },
                        { label: "会员领奖", value: "", modulecode: "92100619" }
                     ]
                  }
               }
            ]
         }
      ]
   },
   {
      path: "/",
      component: Main,
      name: "setup",
      iconCls: "icon-cog",
      leaf: true,
      children: [
         {
            path: "/setup",
            component: Setup,
            name: "设置",
            redirect: {
               path: "/setup/myshop"
            },
            hidden: true
         },
         {
            path: "/setup/myshop",
            component: () => import("@/views/setup/myShop.vue"),
            name: "我的店铺",
            modulecode: "92100701",
            meta: {
               name: "myshop",
               parent: "setup",
               title: "系统设置"
            }
         },
         {
            path: "/setup/shop",
            component: () => import("@/views/setup/shop.vue"),
            name: "店铺管理",
            modulecode: "92100701",
            meta: {
               name: "shop",
               parent: "setup",
               title: "系统设置"
            }
         },
         {
            path: "/setup/tableSetting",
            component: () => import("@/views/setup/tableSetting.vue"),
            name: "桌台管理",
            modulecode: "92100702",
            meta: {
               name: "tableSetting",
               parent: "setup",
               title: "系统设置"
            }
         },
         {
            path: "/setup/employee",
            component: () => import("@/views/setup/employee.vue"),
            name: "员工管理",
            modulecode: "92100703",
            meta: {
               name: "employee",
               parent: "setup",
               title: "系统设置"
            }
         },
         {
            path: "/setup/user",
            component: () => import("@/views/setup/user"),
            name: "用户管理",
            modulecode: "92100704",
            meta: {
               name: "user",
               parent: "setup",
               title: "系统设置"
            }
         },
         // {
         //    path: "/setup/integral",
         //    component: () => import("@/views/setup/integral.vue"),
         //    name: "积分管理",
         //    modulecode: "210040501",
         //    meta: {
         //       name: "integral",
         //       parent: "setup",
         //       title: "系统设置"
         //    }
         // },
         {
            path: "/setup/payWay",
            component: () => import("@/views/setup/payWay.vue"),
            name: "支付方式",
            modulecode: "92100705",
            meta: {
               name: "payWay",
               parent: "setup",
               title: "系统设置",
               line: false
            }
         },

         {
            path: "/setup/print",
            component: () => import("@/views/setup/print/index.vue"),
            name: "打印设置",
            modulecode: "92100706",
            meta: {
               name: "print",
               parent: "setup",
               title: "系统设置"
            }
         },
         {
            path: "/setup/parameter",
            component: () => import("@/views/setup/parameter.vue"),
            name: "参数设置",
            modulecode: "92100707",
            meta: {
               name: "parameter",
               parent: "setup",
               title: "系统设置"
            }
         },
         {
            path: "/setup/system",
            component: () => import("@/views/setup/system"),
            name: "系统重置",
            modulecode: "92100708",
            meta: {
               name: "system",
               parent: "setup",
               title: "系统设置"
            }
         }
      ]
   }
];

export default routes;
