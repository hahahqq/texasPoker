const columnData = {
   balance: {
      balanceA: [
         // 收支结余_商品销售明细 BILLID
         { prop: "BILLNO", label: "单据号" },
         { prop: "DATESTR", label: "日期" },
         { prop: "VIPNAME", label: "会员" },
         { prop: "PAYTYPENAME", label: "支付方式" },
         { prop: "PAYMONEY", label: "支付金额" },
         { prop: "SHOPNAME", label: "门店" },
         { prop: "LONGGOODSNAME", label: "商品" }
         // {prop:"ISCANCEL",label: '状态'},
      ],
      balanceB: [
         // BILLID
         { prop: "BILLNO", label: "单据号" },
         { prop: "DATESTR", label: "日期" },
         { prop: "VIPNAME", label: "会员" },
         { prop: "PAYTYPENAME", label: "支付方式" },
         { prop: "PAYMONEY", label: "支付金额" },
         { prop: "SHOPNAME", label: "门店" },
         { prop: "LONGGOODSNAME", label: "商品" }
         // {prop:"ISCANCEL",label: '状态'},
      ],
      balanceC: [
         // BILLID
         { prop: "BILLNO", label: "单据号" },
         { prop: "DATESTR", label: "日期" },
         { prop: "VIPNAME", label: "会员" },
         { prop: "PAYTYPENAME", label: "支付方式" },
         { prop: "PAYMONEY", label: "支付金额" },
         { prop: "SHOPNAME", label: "门店" },
         { prop: "LONGGOODSNAME", label: "商品" }
         // {prop:"ISCANCEL",label: '状态'},
      ],
      balanceD: [
         // BILLID
         { prop: "BILLNO", label: "单据号" },
         { prop: "DATESTR", label: "日期" },
         { prop: "VIPNAME", label: "会员" },
         { prop: "PAYTYPENAME", label: "支付方式" },
         { prop: "PAYMONEY", label: "支付金额" },
         { prop: "SHOPNAME", label: "门店" },
         { prop: "LONGGOODSNAME", label: "商品" }
         // {prop:"ISCANCEL",label: '状态'},
      ],
      balanceE: [
         // BILLID
         { prop: "BILLNO", label: "单据号" },
         { prop: "DATESTR", label: "日期" },
         { prop: "VIPNAME", label: "会员" },
         { prop: "PAYTYPENAME", label: "支付方式" },
         { prop: "PAYMONEY", label: "支付金额" },
         { prop: "SHOPNAME", label: "门店" },
         { prop: "LONGGOODSNAME", label: "商品" }
         // {prop:"ISCANCEL",label: '状态'},
      ],
      balanceF: [
         // BILLID
         { prop: "BILLNO", label: "单据号" },
         { prop: "DATESTR", label: "日期" },
         { prop: "VIPNAME", label: "会员" },
         { prop: "PAYTYPENAME", label: "支付方式" },
         { prop: "PAYMONEY", label: "支付金额" },
         { prop: "SHOPNAME", label: "门店" },
         { prop: "LONGGOODSNAME", label: "商品" }
         // {prop:"ISCANCEL",label: '状态'},
      ],
      balanceG: [
         // BILLID
         { prop: "BILLNO", label: "单据号" },
         { prop: "DATESTR", label: "日期" },
         { prop: "VIPNAME", label: "会员" },
         { prop: "PAYTYPENAME", label: "支付方式" },
         { prop: "PAYMONEY", label: "支付金额" },
         { prop: "SHOPNAME", label: "门店" },
         { prop: "LONGGOODSNAME", label: "商品" }
         // {prop:"ISCANCEL",label: '状态'},
      ]
   },
   sale: {
      item: [
         // 销售分析明细 GOODSID
         { prop: "GOODNAME", label: "商品" },
         { prop: "GOODSPRICE", label: "价格" },
         { prop: "RICE", label: "金额" },
         { prop: "QTY", label: "数量" },
         { prop: "MONEY", label: "销售金额" },
         { prop: "PURPRICE", label: "支付金额" },
         { prop: "GAINMONEY", label: "获得金额" }
         // { prop: "IMGCHECKTIME", label: "" }
      ]
   },
   goods: {
      item: [
         // 商品分析详情 BILLID
         { prop: "BILLNO", label: "单号" },
         { prop: "GOODSNAME", label: "商品" },
         { prop: "PRICE", label: "价格" },
         { prop: "PURPRICE", label: "售价" },
         { prop: "SALEPRICE", label: "出售价" },
         { prop: "SALEMONEY", label: "实销价" },
         { prop: "QTY", label: "数量" },
         { prop: "DISCOUNTSTR", label: "折扣" },
         { prop: "GROSSPROFITMONEY", label: "毛利润" },
         { prop: "DATESTR", label: "日期" },
         { prop: "VIPNAME", label: "会员" }
      ]
   }
};

export { columnData };
