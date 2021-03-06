const columnData = {
   balance: {
      balanceA: [
         // 收支结余_商品销售明细 BILLID
         { prop: "BILLNO", label: "单据号", width: "150px" },
         { prop: "DATESTR", label: "日期", width: "150px" },
         { prop: "VIPNAME", label: "会员" },
         { prop: "PAYTYPENAME", label: "支付方式" },
         { prop: "PAYMONEY", label: "支付金额", align: "right", width: "100px" },
         { prop: "SHOPNAME", label: "门店" },
         { prop: "LONGGOODSNAME", label: "商品" }
         // {prop:"ISCANCEL",label: '状态'},
      ],
      balanceB: [
         // BILLID
         { prop: "BILLNO", label: "单据号", width: "150px" },
         { prop: "DATESTR", label: "日期", width: "150px" },
         { prop: "VIPNAME", label: "会员" },
         { prop: "PAYTYPENAME", label: "支付方式" },
         { prop: "PAYMONEY", label: "支付金额", align: "right", width: "100px" },
         { prop: "SHOPNAME", label: "门店" },
         { prop: "LONGGOODSNAME", label: "商品" }
         // {prop:"ISCANCEL",label: '状态'},
      ],
      balanceC: [
         // BILLID
         { prop: "BILLNO", label: "单据号", width: "150px" },
         { prop: "DATESTR", label: "日期", width: "150px" },
         { prop: "VIPNAME", label: "会员" },
         { prop: "PAYTYPENAME", label: "支付方式" },
         { prop: "PAYMONEY", label: "支付金额", align: "right", width: "100px" },
         { prop: "SHOPNAME", label: "门店" },
         { prop: "LONGGOODSNAME", label: "商品" }
         // {prop:"ISCANCEL",label: '状态'},
      ],
      balanceD: [
         // BILLID
         { prop: "BILLNO", label: "单据号", width: "150px" },
         { prop: "DATESTR", label: "日期", width: "150px" },
         { prop: "VIPNAME", label: "会员" },
         { prop: "PAYTYPENAME", label: "支付方式" },
         { prop: "PAYMONEY", label: "支付金额", align: "right", width: "100px" },
         { prop: "SHOPNAME", label: "门店" },
         { prop: "LONGGOODSNAME", label: "商品" }
         // {prop:"ISCANCEL",label: '状态'},
      ],
      balanceE: [
         // BILLID
         { prop: "BILLNO", label: "单据号", width: "150px" },
         { prop: "DATESTR", label: "日期", width: "150px" },
         { prop: "VIPNAME", label: "会员" },
         { prop: "PAYTYPENAME", label: "支付方式" },
         { prop: "PAYMONEY", label: "支付金额", align: "right", width: "100px" },
         { prop: "SHOPNAME", label: "门店" },
         { prop: "LONGGOODSNAME", label: "商品" }
         // {prop:"ISCANCEL",label: '状态'},
      ],
      balanceF: [
         // BILLID
         { prop: "BILLNO", label: "单据号", width: "150px" },
         { prop: "DATESTR", label: "日期", width: "150px" },
         { prop: "VIPNAME", label: "会员" },
         { prop: "PAYTYPENAME", label: "支付方式" },
         { prop: "PAYMONEY", label: "支付金额", align: "right", width: "100px" },
         { prop: "SHOPNAME", label: "门店" },
         { prop: "LONGGOODSNAME", label: "商品" }
         // {prop:"ISCANCEL",label: '状态'},
      ],
      balanceG: [
         // BILLID
         { prop: "BILLNO", label: "单据号", width: "150px" },
         { prop: "DATESTR", label: "日期", width: "150px" },
         { prop: "VIPNAME", label: "会员" },
         { prop: "PAYTYPENAME", label: "支付方式" },
         { prop: "PAYMONEY", label: "支付金额", align: "right", width: "100px" },
         { prop: "SHOPNAME", label: "门店" },
         { prop: "LONGGOODSNAME", label: "商品" }
         // {prop:"ISCANCEL",label: '状态'},
      ]
   },
   sale: {
      item: [
         // 销售分析明细 GOODSID
         { prop: "GOODNAME", label: "商品" },
         { prop: "GOODSPRICE", label: "价格", align: "right" },
         { prop: "RICE", label: "金额", align: "right" },
         { prop: "QTY", label: "数量", align: "right" },
         { prop: "MONEY", label: "销售金额", align: "right" },
         { prop: "PURPRICE", label: "支付金额", align: "right" },
         { prop: "GAINMONEY", label: "获得金额", align: "right" }
         // { prop: "IMGCHECKTIME", label: "" }
      ]
   },
   goods: {
      item: [
         // 商品分析详情 BILLID
         { prop: "BILLNO", label: "单号", width: "150px" },
         { prop: "GOODSNAME", label: "商品" },
         { prop: "PRICE", label: "价格", align: "right" },
         { prop: "PURPRICE", label: "售价", align: "right" },
         { prop: "SALEPRICE", label: "出售价", align: "right" },
         { prop: "SALEMONEY", label: "实销价", align: "right" },
         { prop: "QTY", label: "数量", align: "right" },
         { prop: "DISCOUNTSTR", label: "折扣", align: "right" },
         { prop: "GROSSPROFITMONEY", label: "毛利润", align: "right" },
         { prop: "DATESTR", label: "日期", width: "150px" },
         { prop: "VIPNAME", label: "会员" }
      ]
   }
};

export { columnData };
