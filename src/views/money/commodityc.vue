<template>
  <el-container>
    <el-container>
      <el-aside width="100px">
        <section style="min-width: 100px">
          <sidebarMenu :activePath="activePath" :routesList="routesList" :width="100"></sidebarMenu>
        </section>
      </el-aside>
      <el-container>
        <div class="t-botton-timescountc" ref="elememt">
          <div class="f-botton-fs" style="height: 100%">
            <div style="position: absolute; top: 0px; bottom: 0px; left: 100px; right: 0px">
              <el-row style="height: 100%; margin-right: 0px; margin-left: 0px">
                <el-col
                  :span="8"
                  style="
                    height: 100%;
                    position: relative;
                    background: rgb(248, 248, 249);
                    padding-right: 0px;
                    padding-left: 0px;
                  "
                >
                  <div class="commodityc-top">
                    <span class="title">商品消费</span>
                    <span class="commodityc-top-text" @click="clearData">清空页面</span>
                  </div>
                  <div>
                    <div class="vue-dropdown default-theme" v-clickOutSide="handleCloseMember">
                      <div class="search-module clearfix">
                        <input
                          class="search-text"
                          v-model="searchText1"
                          @keyup="search_mb"
                          placeholder="输入会员手机号/卡号"
                          v-show="inputShow"
                        />
                      </div>
                      <div
                        class="ssmemberul"
                        :memberid="memberdetails.ID"
                        v-if="memberdetails.ID != null"
                      >
                        <div class="ssmemberul-cont">
                          <div class="ssmemberul-imgUrl">
                            <img
                              :src="memberdetails.IMAGEURL"
                              onerror="this.src='static/images/merberpic.png'"
                            />
                          </div>
                          <div class="ssmemberul-massge">
                            <div class="ssmemberul-massge-ncp">
                              <div>
                                <span class="ssmemberul-cont-name">{{ memberdetails.NAME }}</span>
                                <span class="ssmemberul-cont-phone">
                                  {{ memberdetails.MOBILENO }}
                                </span>
                              </div>
                              <div class="ssmemberul-cont-ka">
                                {{ memberdetails.LEVELNAME }}
                              </div>
                            </div>
                            <div class="ssmemberul-cont-text">
                              <span style="width: 120px; float: left">
                                卡号 : {{ memberdetails.CODE }}
                              </span>
                              <span style="margin-left: 20px">
                                手机号 : {{ memberdetails.MOBILENO }}
                              </span>
                            </div>

                            <div class="ssmemberul-cont-text">
                              <span style="width: 120px; float: left">
                                储值积分 :
                                <i style="color: #409eff">{{ memberdetails.MONEY }}</i>
                              </span>
                              <span style="margin-left: 20px" v-if="splitIntegral">
                                竞技积分 :
                                <i style="color: #409eff">{{ memberdetails.INTEGRAL }}</i>
                              </span>
                            </div>
                          </div>
                          <i class="el-icon-delete" @click="delClick"></i>
                        </div>
                      </div>

                      <ul class="list-module" v-if="listMember && loadingMember == false">
                        <li
                          v-for="(item, index) in datalist"
                          @click="appClick(item)"
                          :key="index"
                          style="margin-top: 0; padding: 10px"
                        >
                          <img
                            :src="item.showgoodsimg"
                            onerror="this.src='static/images/merberpic.png'"
                          />
                          <div class="itmeright">
                            <div class="item_dright-left">
                              <div class="name">{{ item.NAME }}</div>
                              <div class="phone">{{ item.MOBILENO }}</div>
                            </div>
                            <div class="item_dright-right" v-if="splitIntegral">
                              <div style="line-height: 24px">储值积分：{{ item.MONEY }}</div>
                              <div>竞技积分：{{ item.INTEGRAL }}</div>
                            </div>

                            <div class="item_dright-right" v-else>
                              <div style="line-height: 48px">储值积分：{{ item.MONEY }}</div>
                            </div>
                          </div>
                        </li>
                      </ul>

                      <ul
                        class="list-module"
                        style="line-height: 60px; width: 100%; color: #888; text-align: center"
                        v-if="loadingMember"
                      >
                        数据加载中...
                      </ul>
                    </div>
                    <div class="timescountc_left overflowscroll" ref="addsockheight">
                      <ul id="addshopList" class="p-bottom-sm" v-if="addobjCountList.length > 0">
                        <li
                          v-for="(item, i) in addobjCountList"
                          :key="i"
                          class="addshopList-cont"
                          @click="editChange(item, i)"
                        >
                          <el-row class="addshopList-cont-list">
                            <el-col :span="16" class="name">{{ item.goodsname }}</el-col>
                          </el-row>
                          <el-row class="addshopList-cont-list">
                            <el-col :span="8">
                              <span class="discountMoney">
                                ¥{{ item.discountMoney.toFixed(2) }}
                              </span>
                              <span v-if="item.Remark != '' && item.Remark != undefined">
                                <el-tooltip
                                  class="item"
                                  effect="dark"
                                  :content="item.Remark"
                                  placement="right"
                                >
                                  <i class="el-icon-info"></i>
                                </el-tooltip>
                              </span>
                              <span
                                v-if="item.Remark != '' && item.Remark != undefined"
                                class="discountMoney-dazhe"
                              >
                                ¥{{ item.PRICE }}
                              </span>
                            </el-col>
                            <el-col :span="8" style="text-align: center">
                              <div class="sumchange">
                                <el-input-number
                                  style="width: 100px"
                                  @click.native.stop
                                  @change="addjiajianhao1(i, item.Qty)"
                                  size="mini"
                                  v-model.number="item.Qty"
                                ></el-input-number>
                              </div>
                            </el-col>
                            <el-col :span="8" class="shopMoney">
                              <span style="margin-right: 5px">
                                ¥ {{ (item.discountMoney * item.Qty).toFixed(2) }}
                              </span>
                            </el-col>
                          </el-row>
                          <i class="el-icon-delete" @click.stop="delgoods(i)"></i>
                        </li>
                      </ul>
                      <div v-else class="show-goodImg">
                        <div>
                          <img :src="goodImg" class="goodImg" />
                        </div>
                        <div class="goodImg-text">没有消费信息</div>
                      </div>
                    </div>
                    <div class="timescountc_left_footer" ref="footer">
                      <div style="">
                        <el-row style="width: 100%; margin-top: 5px">
                          <div v-show="showOptions">
                            <el-select
                              class="g-public-multi-select"
                              @change="seletSale"
                              v-model="value"
                              placeholder="请选择销售员"
                              style="width: 100%"
                            >
                              <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              ></el-option>
                            </el-select>
                          </div>
                          <div v-show="showRarmark" style="margin-top: 5px">
                            <el-input
                              v-model="remark"
                              :rows="2"
                              placeholder="请输入备注信息"
                            ></el-input>
                          </div>
                          <div>
                            <el-row
                              style="height: 40px; width: 100%; line-height: 40px; margin-top: 5px"
                            >
                              <el-col :span="7" class="discount">
                                <div class="discount-title">折</div>
                                <el-select
                                  v-model="value1"
                                  placeholder="请选择"
                                  style="width: 100px"
                                  @change="handleCommand"
                                >
                                  <el-option
                                    v-for="item in disoptions"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value"
                                  ></el-option>
                                </el-select>
                              </el-col>

                              <el-col :span="1">
                                <div style="height: 20px; width: 100%"></div>
                              </el-col>
                              <el-col :span="7" style="text-align: center" class="discount">
                                <div class="discount-title">券</div>
                                <el-popover
                                  placement="top"
                                  width="420"
                                  v-model="visible"
                                  trigger="click"
                                >
                                  <el-row class="coupon">
                                    <div class="coupon-title">
                                      <span style="font-size: 14px">优惠券</span>
                                      <i class="el-icon-close" @click="visible = false"></i>
                                    </div>
                                    <div class="selectList">
                                      <el-row>
                                        <el-col :span="12" style="text-align: center">
                                          <div
                                            @click="selectCoupont(1)"
                                            :class="this.indexs == 1 ? 'selectList-fists' : ''"
                                          >
                                            <span>可使用({{ couponList.length }})</span>
                                          </div>
                                        </el-col>
                                        <el-col :span="12" style="text-align: center">
                                          <div
                                            @click="selectCoupont(2)"
                                            :class="this.indexs == 2 ? 'selectList-fists' : ''"
                                          >
                                            不可用(0)
                                          </div>
                                        </el-col>
                                      </el-row>
                                    </div>

                                    <div class="select-list" v-show="showCoupont1">
                                      <div class="select-list-cont" v-if="dataLists.length > 0">
                                        <ul>
                                          <li v-for="(item, index) in dataLists" :key="index">
                                            <div
                                              class="coupont-list"
                                              @click="selectCouponList(index, item)"
                                              :class="item.isSelect == true ? 'secect-border' : ''"
                                            >
                                              <div class="coupont-list-top">
                                                <div
                                                  style="
                                                    height: 20px;
                                                    width: 100%;
                                                    line-height: 20px;
                                                    text-align: right;
                                                  "
                                                ></div>
                                                <div
                                                  style="
                                                    height: 20px;
                                                    width: 100%;
                                                    line-height: 15px;
                                                  "
                                                >
                                                  <span class="coupont-list-top-money">
                                                    ￥{{ item.MONEY }}
                                                  </span>
                                                  <span class="coupont-list-top-allmoney">
                                                    满{{ item.LIMITMONEY }}元可用
                                                  </span>
                                                </div>
                                                <div
                                                  style="
                                                    height: 20px;
                                                    width: 100%;
                                                    line-height: 20px;
                                                    font-size: 5px;
                                                  "
                                                >
                                                  <span style="margin-left: 5px">
                                                    有效期至{{ item.BEGINDATE }}
                                                  </span>
                                                </div>
                                              </div>
                                              <div class="coupont-list-bottom">
                                                <span>【商品券】{{item.REMARK}}</span>
                                              </div>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                      <div v-else class="show-goodImgCoupont">
                                        <div>
                                          <img :src="goodImg" class="goodImgCoupont" />
                                        </div>
                                        <div class="goodImg-textCoupont">无可用优惠券</div>
                                      </div>
                                    </div>
                                    <div class="select-list" v-show="showCoupont2"></div>
                                  </el-row>
                                  <div
                                    slot="reference"
                                    @click="selctCoupon"
                                    style="margin-left: 5px; width: 60px"
                                  >
                                    <div class="coupon-ts">
                                      <span
                                        v-if="showCoupn"
                                        style="color: #c0c4cc; font-size: 12px"
                                      >
                                        优惠券
                                      </span>
                                      <span style="color: #444444; font-size: 12px" v-else>
                                        减{{ coupon }}元
                                      </span>
                                      <i class="el-icon-arrow-down el-icon--right gright"></i>
                                    </div>
                                  </div>
                                </el-popover>
                              </el-col>
                              <el-col :span="1">
                                <div style="height: 20px; width: 100%"></div>
                              </el-col>
                              <el-col :span="8" class="discount" style="height: 40px">
                                <div>
                                  <div class="discount-title">￥</div>
                                </div>
                                <div>
                                  <input
                                    class="showEit-input1"
                                    placeholder="输入优惠金额"
                                    @input="inputCouponMoneyChange()"
                                    v-model="inputCouponMoney"
                                  />
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div
                            class="footer_top"
                            style="
                              margin: 6px 0;
                              background-color: #fff;
                              height: 60px;
                              line-height: 60px;
                            "
                          >
                            <el-row>
                              <el-col :span="12">
                                <div v-if="(totalTotal.price.toFixed(1) + '').length > 6">
                                  <div style="line-height: 20px !important; margin-top: 8px">
                                    <span style="margin-left: 5px">
                                      数量&nbsp;&nbsp;{{ totalTotal.num }}
                                    </span>
                                  </div>
                                  <div style="line-height: 20px !important">
                                    <span style="margin-left: 5px">
                                      金额&nbsp;&nbsp;
                                      <span class="priceTol">
                                        ￥{{
                                          (totalTotal.price - coupon - inputCouponMoney).toFixed(2)
                                        }}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                <div v-else>
                                  <span style="display: inline-block; margin-left: 10px">
                                    数量&nbsp;&nbsp;{{ totalTotal.num }}
                                  </span>
                                  ,
                                  <span style="display: inline-block; margin-left: 5px">
                                    金额&nbsp;&nbsp;
                                    <span class="priceTol">
                                      ￥{{
                                        (totalTotal.price - coupon - inputCouponMoney).toFixed(2)
                                      }}
                                    </span>
                                  </span>
                                </div>
                              </el-col>

                              <el-col :span="12" style="text-align: right">
                                <el-button
                                  type="primary"
                                  style="margin-right: 10px"
                                  @click="co_reckoning"
                                  :loading="submitLoading"
                                >
                                  收款
                                </el-button>
                              </el-col>
                            </el-row>
                          </div>
                        </el-row>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="16" style="padding-left: 0px; padding-right: 0px">
                  <div class="commodity-right">
                    <div class="search_sock">
                      <el-row>
                        <el-col :span="16" class="member-header">
                          <div class="search_sock-input">
                            <el-input
                              type="default"
                              v-model="searchText"
                              placeholder="输入商品名称/商品编码/条码"
                              size="small"
                              style="width: 100%; margin-left: 5%; margin-right: 5%"
                              @keyup.enter.native="searchGoods()"
                            ></el-input>
                          </div>
                        </el-col>
                        <el-col :span="8" class="shop">
                          <span class="name">{{ shopInfo.SHOPNAME }}</span>
                          <span class="">
                            <el-popover
                              placement="bottom"
                              width="140"
                              trigger="hover"
                              popper-class="no-padding"
                            >
                              <el-button
                                style="border: none !important"
                                @click="changeShop()"
                                class="full-width"
                                icon="icon-exchange"
                              >
                                &nbsp;&nbsp;切换店铺
                              </el-button>
                              <el-button
                                style="border: none !important"
                                class="full-width no-m-left border-top"
                                icon="icon-user"
                              >
                                &nbsp;&nbsp; 账号信息
                              </el-button>
                              <el-button
                                style="border: none !important"
                                @click="logout()"
                                class="full-width no-m-left border-top"
                                icon="icon-signout"
                              >
                                &nbsp;&nbsp;退出账号
                              </el-button>
                              <a slot="reference" class="hitem">
                                <i class="icon-reorder"></i>
                              </a>
                            </el-popover>
                          </span>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="commodity-right-good-list">
                      <div class="classification_List" ref="fenleiWidthsock">
                        <div class="swiper-container">
                          <ul class="swiper-wrapper" id="activityList" v-if="goodType.length > 0">
                            <li
                              class="swiper-slide"
                              v-for="(item, index) in goodType"
                              :key="index"
                              @click="ck_commoditycflList(item.ID, index)"
                              :class="{ selected: index == current }"
                            >
                              {{ item.NAME }}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div
                        class="commodityc_rightsock p-left-sm p-right-sm"
                        :style="{ height: tableHeight + 'px' }"
                      >
                        <div
                          v-if="pagelist.length != 0"
                          class="tablelist scrollstyle font-12"
                          v-loading="loading"
                          element-loading-text="拼命加载中"
                        >
                          <el-row :gutter="20" class="timescountc_right m-top-sm">
                            <el-col
                              :span="6"
                              style="margin-bottom: 10px; padding-right: 0"
                              v-for="(item, i) in pagelist"
                              :key="i"
                              v-show="item.GIFTINTEGRAL == 0 || item.GIFTINTEGRAL > 0"
                            >
                              <div class="tablelcenter" @click="addcommodityc(item)">
                                <div class="img">
                                  <div style="width: 60px; height: 60px">
                                    <img
                                      :src="item.showgoodsimg"
                                      onerror="this.src='static/images/shopzj.png'"
                                      style="width: 100%; height: 100%"
                                    />
                                  </div>
                                  <div style="margin-left: 7px; width: 70%">
                                    <div
                                      style="
                                        height: 30px;
                                        width: 96%;
                                        line-height: 35px;
                                        text-overflow: ellipsis;
                                        overflow: hidden;
                                        white-space: nowrap;
                                      "
                                    >
                                      {{ item.NAME }}
                                    </div>
                                    <div style="height: 30px; width: 110px; line-height: 25px">
                                      <el-row>
                                        <el-col :span="10">
                                          <span class="font-600 text-theme2" style="width: 60%">
                                            <span>&yen;{{ item.PRICE }}</span>
                                          </span>
                                        </el-col>
                                        <el-col :span="14">
                                          <span style="color: #a3a3a3">
                                            <i style="color: rgb(25, 23, 23)">库</i>
                                            <!-- <el-tooltip  class="item" effect="dark" :content="item.STOCKQTY" placement="right"> -->
                                            <i>{{ item.STOCKQTY }}</i>
                                            <!-- </el-tooltip> -->
                                          </span>
                                        </el-col>
                                      </el-row>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>

                        <div
                          v-if="pagelist.length == 0 && loading == false"
                          :style="`text-align:center; display: table; width: 100%; height: ${clientHeight}px`"
                        >
                          <span style="display: table-cell; padding-top: 160px">
                            <img
                              src="static/images/delf.png"
                              style="width: 180px; height: 170px; display: inline-block"
                              alt=""
                            />
                            <div style="color: #868686; margin-top: 20px">
                              暂无商品 ，点击立即添加
                              <el-button type="primary" size="small" @click="showAddNewChange">
                                添加商品
                              </el-button>
                            </div>
                          </span>
                        </div>
                      </div>

                      <div v-show="pagelist.length > 0" class="m-top-sm clearfix elpagination">
                        <el-pagination
                          background
                          @size-change="handlePageChange"
                          @current-change="handlePageChange"
                          :current-page.sync="pagination.PN"
                          :page-size="pagination.PageSize"
                          layout="total,prev, pager, next, jumper"
                          :total="pagination.TotalNumber"
                          class="text-right"
                        ></el-pagination>
                      </div>
                    </div>
                    <div class="eitcontant" v-show="eitcontant">
                      <el-row>
                        <el-col class="eitcontant-title">修改选择的商品</el-col>
                      </el-row>
                      <div class="eitcontant-shop">
                        <el-row class="showEit-top">
                          <el-col :span="6">
                            <img
                              :src="eitDatashop.showgoodsimg"
                              onerror="this.src='static/images/shopmore.png'"
                            />
                          </el-col>
                          <el-col :span="9" class="showEit-title">
                            <div>{{ eitDatashop.goodsname }}</div>
                            <div>{{ eitDatashop.CODE }}</div>
                          </el-col>
                          <el-col
                            :span="8"
                            style="text-align: right; margin-top: 40px; color: #db4a41"
                          >
                            <span>￥{{ eitDatashop.PRICE }}</span>
                          </el-col>
                        </el-row>
                        <el-row class="showEit-center">
                          <div class="showEit-center-money">
                            <div class="showEit-center-money-tt">
                              <span>本次售价</span>
                              <input
                                class="showEit-input"
                                v-model="eitprice"
                                @input="eitpriceChange"
                              />
                            </div>
                          </div>
                          <div class="showEit-center-money">
                            <div class="showEit-center-money-tt">
                              <span>本次折扣</span>
                              <input
                                class="showEit-input"
                                v-model="eitdiscount"
                                @change="discountChange"
                              />
                            </div>
                          </div>
                          <div class="showEit-center-money">
                            <el-row class="showEit-center-money-tt">
                              <el-col style="display: flex">
                                <div>销售数量</div>
                                <div class="sumchange" style="margin-left: 30px">
                                  <el-input-number
                                    style="width: 100px"
                                    @click.native.stop
                                    @change="addjiajianhao1(eitDatashop.i, eitDatashop.Qty)"
                                    size="mini"
                                    v-model.number="eitDatashop.Qty"
                                    :min="1"
                                  ></el-input-number>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <el-row class="showEit-bottom">
                            <el-col :span="13">
                              <el-button type="info" size="medium" @click="delgoods(eitDatashop.i)">
                                删除商品
                              </el-button>
                            </el-col>
                            <el-col :span="7" style="text-align: center">
                              <el-button plain size="medium" @click="eitcontant = false">
                                取消
                              </el-button>
                            </el-col>
                            <el-col :span="4" style="text-align: right">
                              <el-button
                                type="primary"
                                size="medium"
                                @click="saveShop(eitDatashop.i)"
                              >
                                确定
                              </el-button>
                            </el-col>
                          </el-row>
                        </el-row>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <el-dialog
          v-if="showRecharge"
          title="收银"
          :visible.sync="showRecharge"
          class="recharge1"
          width="800px"
        >
          <recharge
            @closeModalrecharge="showRecharge = false"
            :totalprice="totalPrice"
            :isselectvip="VipIds"
            @CashRecharge="CashRecharge"
            ref="SurveyForm"
          ></recharge>
        </el-dialog>
        <el-dialog
          title="请选择门店"
          :visible.sync="isShowShop"
          width="300px"
          :before-close="handleClose"
        >
          <div class="shopListClass">
            <ul>
              <li v-for="(item, index) in theshopList" :key="index" @click="setShop(item)">
                {{ item.SHOPNAME }}
              </li>
            </ul>
          </div>
        </el-dialog>
      </el-container>
    </el-container>

    <el-dialog title="添加商品" :visible.sync="showAddNew" width="55%">
      <add-new-goods
        @closeModal="showAddNew = false"
        @resetList="
          showAddNew = false;
          getNewData();
        "
        :dataType="{ value: 2, dealState: 'add' }"
      ></add-new-goods>
    </el-dialog>
  </el-container>
</template>
<script>
import Vue from "vue";
import { GOODS_IMGURL } from "@/util/define";
import { nscreenexCodeFun } from "@/util/objectivity";
import { getparametersetup } from "@/util/com/index";
import { getDayindate } from "@/util/Printing";
import { getOpenMoneyBox } from "@/util/Printing";
import { mapState, mapGetters } from "vuex";
import { getUserInfo, getHomeData } from "@/api/index";

import yjemployee from "@/components/employee/YJemployee";
import recharge from "@/components/Recharge/Recharge";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
const settheVipPrice_Fun = function (goodsItem, selmember, type, value) {
  let gPrice = 0;
  let price = parseFloat(goodsItem.PRICE),
    discount = 1,
    remark = "";
  return {
    Price: price,
    Discount: discount,
    priceremark: remark,
    retailprice: gPrice
  };
};
let _ = require("lodash");
import MIXINS_MONEY from "@/mixins/money";
import MIXINS_CHECKOUT from "@/mixins/checkout";
import { VIPIMAGESIMG } from "@/util/define";
import MIXINS_CLEAR from "@/mixins/clearAllData";
var QRCode = require("qrcode");
import { SYSTEM_INFO } from "@/util/define.js";
import dayjs from "dayjs";
import { getDayindata } from "@/util/testPrinting";

export default {
  mixins: [MIXINS_CHECKOUT.CHOOSE_MEMBER, MIXINS_MONEY.MONEY_MENU, MIXINS_CLEAR.LOGOUT],
  data() {
    return {
      showAddNew: false,
      Goodscode: getUserInfo().CompanyConfig.AUTOGENGOODSCODE,
      isSelectGoods: false,
      listMember: false,
      loading: true,
      searchText1: "",
      VipIds: {},
      tableHeight: document.body.clientHeight - 175,
      clientHeight: document.body.clientHeight - 50,
      inputShow: true,
      datalist: [],
      pageData: {
        PN: 1,
        Filter: ""
      },
      memberdetails: this.details || {},
      isshowtatus: false,
      goodImg: "static/images/noneGoods.png",
      showCoupont1: true,
      showCoupont2: false,
      showOptions: false,
      showRarmark: false,
      eitdiscount: "",
      inputCouponMoney: "",
      visible: false,
      eitcontant: false,
      options: [],
      value: "",
      value1: "",
      disoptions: [],
      getgoodsIMGURL: "",
      eitprice: "",
      eitDatashop: [],
      current: 0,
      index: "ok",
      indexs: 1,
      searchText: "",
      VipId: "",
      VipIdrows: "",
      BillId: "",
      objCount: [],
      addobjCountList: [],
      totalTotal: {
        num: 0,
        price: 0
      },
      totalPrice: {
        num: 0,
        price: 0,
        integral: "",
        title: "销售日期"
      },
      checkedmessage: false,
      pagelist: [],
      pagelist1: [],
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      pageData: {
        PN: 1,
        Filter: "",
        Status: 1,
        Mode: -1,
        TypeID: "", //商品类别ID
        DescType: 0
      },
      pageDataMember: {
        PN: 1,
        Filter: ""
      },
      showyjemployee: false,
      showRecharge: false,
      shopitemList: {},
      showTishi: "",
      pageCouponList: {
        CouponType: 0,
        VipId: "",
        Type: "",
        PN: 1
      },
      dataLists: [],
      selectlist: [],
      coupon: "",
      showCoupn: true,
      tate: 1,
      id: "",
      member: "",
      goodType: "",
      height: window.innerHeight - 80,
      isneedsaler: "",
      shopInfo: getHomeData().shop,
      isShowShop: false,
      theshopList: [],
      activePath: "",
      remark: "",
      shopName: getUserInfo().CompanyName,
      couponCode: "",
      splitIntegral: getUserInfo().CompanyConfig.INTEGRALTYPE,
      cashRechargeData: {},
      checkedreceipt: true,
      submitLoading: false,
      loadingMember: false
    };
  },
  //取单返回来的数据渲染到商品销售页面
  created() {
    //生命周期里接收参数
    let getInfo = getUserInfo();
    this.isneedsaler = getInfo.CompanyConfig.ISNEEDSALER;
    this.id = this.$route.query.id; //接受参数关键代码
    if (this.id == 1) {
      let Obj = Object.assign({}, this.$store.state.guadanc.guadancdlState);
      this.BillId = Obj.data.Obj.BILLID;
      let member = Obj.data.Obj;
      console.log("有会员id传过来吗", member.VIPID);
      this.VipId = member.VIPID;
      this.VipIds = member;
      this.showOptions = true;
      this.showRarmark = true;
      let mbmberObj = {
        IMAGEURL: member.IMAGEURL,
        ID: member.VIPID,
        NAME: member.VIPNAME,
        MOBILENO: member.VIPTEL,
        MONEY: member.VIPMONEY,
        INTEGRAL: member.VIPINTEGRAL,
        LEVELNAME: member.DISCOUNTNAME
      };
      this.memberdetails = mbmberObj;

      if (member.VIPID == undefined) {
        this.inputShow = true;
      } else {
        this.inputShow = false;
      }
      let goods = Obj.data.GoodsObj;
      this.addobjCountList = [];
      this.getgoodsIMGURL = GOODS_IMGURL;
      for (var i in goods) {
        let Obj = {
          goodsname: goods[i].GOODSNAME,
          Qty: goods[i].QTY,
          GoodsId: goods[i].GOODSID,
          shopMoney: goods[i].PRICE,
          discountMoney: goods[i].PRICE,
          showgoodsimg: this.getgoodsIMGURL + goods[i].GOODSID + ".png",
          Remark: goods[i].REMARK,
          eitGoods: false,
          PRICE: goods[i].PRICE,
          Discount: 1
        };
        this.addobjCountList.push(Obj);
      }
      this.dealTotalData();
    }
    let that = this;
    document.onkeydown = function (e) {
      var key = window.event.keyCode;
      console.log("key", key);
      if (key == 121) {
        // F10 : 打开钱箱
        that.openMoneyBox();
      }
    };
  },
  computed: {
    ...mapGetters({
      memberState: "memberState",
      employeeList: "employeeList",
      commoditycflDiscountList: "commoditycflDiscountList",
      commoditycflListState: "commoditycflListState",
      commoditycflList: "commoditycflList",
      dataList: "goodsListNew",
      dataListState: "goodsListNewState",
      commoditycconsumption: "commoditycconsumption",
      goodsState: "goodsState",
      goodsItem: "goodsItem",
      couponList: "couponList",
      getssmemberdListState: "ssmemberdListState",
      shopList: "shopList",
      shopListState: "shopListState",
      datagListState3: "goodsListNew",
      datagList3: "goodsListNew"
    })
  },
  watch: {
    datagListState3(data) {
      if (this.isSelectGoods) {
        let info = [...this.datagList3];
        if (info.length == 0) {
          this.$message.error(this.searchText + ", 查无此商品 ！");

          this.searchText = "";
        } else if (info.length == 1) {
          let Obj = {};
          for (var i in info) {
            Obj = info[i];
          }
          this.addcommodityc(Obj);
          this.searchText = "";
        }
      }
    },
    getssmemberdListState(data) {
      this.loadingMember = false;
      this.loading = false;
      if (data.success) {
        if (this.isshowtatus) {
          this.datalist = [...data.data.PageData.DataArr];
          for (let i = 0; i < this.datalist.length; i++) {
            if (this.datalist[i].IMAGEURL == undefined || this.datalist[i].IMAGEURL == "") {
              this.datalist[i].showgoodsimg = VIPIMAGESIMG + this.datalist[i].ID + ".png";
            } else {
              this.datalist[i].showgoodsimg = this.datalist[i].IMAGEURL;
            }
          }
        } else {
          this.datalist = [];
        }
      }
    },
    couponList(data) {
      let msl = [];
      msl = data;
      this.dataLists = [];
      msl.forEach((item) => {
        this.$set(item, "isSelect", false);
        this.dataLists.push(item);
      });
    },
    employeeList(data) {
      this.options = [];
      let employeemen = data;
      for (var i in employeemen) {
        let Obj = {
          value: employeemen[i].ID,
          label: employeemen[i].NAME
        };
        this.options.push(Obj);
      }
    },
    commoditycflDiscountList(data) {
      this.disoptions = [];
      let discount = data;
      for (var i in discount) {
        let Obj = {
          value: discount[i].RATE,
          label: discount[i].NAME,
          id: i
        };
        this.disoptions.push(Obj);
      }
    },
    searchText() {
      this.searchfun();
    },
    commoditycflList(data) {
      let good = [];
      for (var i in data) {
        good.push(data[i]);
      }
      good.unshift({
        ID: "0",
        NAME: "全部"
      });
      this.goodType = good;
      this.fenleiscrollwidth();
    },
    memberState(data) {
      if (data.success) {
        this.objCount = data.data.objCount;
      }
    },
    dataListState(data) {
      this.loading = false;
      this.isFilter = false;
      this.pagelist = [...this.dataList];
      this.getgoodsIMGURL = GOODS_IMGURL;
      for (let i = 0; i < this.pagelist.length; i++) {
        this.pagelist[i].showgoodsimg = this.getgoodsIMGURL + this.pagelist[i].ID + ".png";
      }
      if (data.success) {
        this.pagination = {
          TotalNumber: data.paying.TotalNumber,
          PageNumber: data.paying.PageNumber,
          PageSize: data.paying.PageSize,
          PN: data.paying.PN
        };
      }
    },
    commoditycconsumption(data) {
      if (data.success) {
        this.submitLoading = false;
        this.$message({
          message: this.showTishi,
          type: "success"
        });

        let printRules = localStorage.getItem(SYSTEM_INFO.PREFIX + "Print2");
        let jsonPrintData = JSON.parse(printRules);
        if (jsonPrintData.autoPrint || this.checkedreceipt) {
          jsonPrintData.autoPrint = true;
          localStorage.setItem(SYSTEM_INFO.PREFIX + "Print2", JSON.stringify(jsonPrintData));

          this.testPrint(data.data.BillId, jsonPrintData);
        } else {
          this.clearData();
        }
      } else {
        this.$message.error(data.message);
      }
    },
    goodsState(data) {
      if (data.success && !this.showyjemployee) {
        this.shopitemList.itemObj = Object.assign({}, this.goodsItem, this.shopitemList.itemObj);
        this.showyjemployee = true;
      }
    }
  },
  methods: {
    handleCloseMember() {
      this.searchText1 = "";
      this.listMember = false;
    },
    showAddNewChange() {
      this.showAddNew = true;
      if (this.Goodscode == true) {
        this.$store.dispatch("getGoodsCode").then(() => {});
      }
    },
    testPrint(billid, jsonPrintData) {
      let billInfo = [
        {
          label: "结账单号：",
          value: billid
        },
        {
          label: "结账日期：",
          value: dayjs().format("YYYY-MM-DD hh:mm")
        }
      ];

      let GoodsDetaila = this.addobjCountList,
        newGoodsList = [],
        totalPrice = 0;
      for (var i in GoodsDetaila) {
        newGoodsList.push({
          name: GoodsDetaila[i].goodsname,
          purPrice: GoodsDetaila[i].discountMoney,
          qty: GoodsDetaila[i].Qty,
          price: GoodsDetaila[i].discountMoney * GoodsDetaila[i].Qty
        });
        totalPrice += GoodsDetaila[i].discountMoney * GoodsDetaila[i].Qty;
      }

      let payMoney = (
        Number(this.totalTotal.price) -
        Number(this.coupon) -
        Number(this.inputCouponMoney)
      ).toFixed(2);

      let saleInfo = [
        {
          label: "商品总数：",
          value: newGoodsList.length
        },
        {
          label: "金额合计：",
          value: totalPrice.toFixed(2)
        },
        {
          label: "优惠金额：",
          value: Number(this.inputCouponMoney)
        },
        {
          label: "实付金额：",
          value: payMoney
        }
      ];

      if (this.cashRechargeData.payName == "积分支付") {
        saleInfo.push({
          label: "储值积分：",
          value: this.cashRechargeData.payMoney
        });

        if (this.splitIntegral) {
          saleInfo.push({
            label: "竞技积分：",
            value: this.cashRechargeData.PayIntegral
          });
        }
      } else {
        saleInfo.push({
          label: "支付方式：",
          value: this.cashRechargeData.payName
        });
      }

      let vipInfo = jsonPrintData.vipInfo;
      if (this.VipId == undefined || this.VipId == "") {
        vipInfo[0].isShow = false;
        vipInfo[1].value = "散客";
        vipInfo[2].isShow = false;
      } else {
        vipInfo[0].value = this.memberdetails.CODE;
        vipInfo[1].value = this.memberdetails.NAME;
        vipInfo[2].value = this.memberdetails.MONEY - Number(this.cashRechargeData.payMoney);
        if (this.splitIntegral) {
          vipInfo.push({
            label: "竞技积分",
            value: this.memberdetails.INTEGRAL - Number(this.cashRechargeData.PayIntegral),
            isShow: vipInfo[2].isShow
          });
        }
      }

      jsonPrintData.remark.value = this.remark;
      if (this.SaleEmpList != undefined && this.SaleEmpList != "") {
        let saleEmployName = this.options.filter((item) => item.value == this.SaleEmpList);
        console.log(saleEmployName);
        jsonPrintData.saleEmploy.value = saleEmployName[0].label;
      }

      let printData = Object.assign(
        {},
        jsonPrintData,
        { billInfo: billInfo },
        { saleInfo: saleInfo },
        { goodsList: newGoodsList }
      );
      let qresurl = this.$store.state.commodityc.saveQRcodeIMG;
      console.log(qresurl);
      getDayindata(printData, "Print2", qresurl);

      this.clearData();
    },
    searchGoods() {
      this.pageData.Filter = this.searchText;
      this.isSelectGoods = true;
      this.$store.dispatch("getGoodsListNew", this.pageData);
      this.searchText = "";
    },
    inputCouponMoneyChange() {
      this.totalPrice.price = this.totalTotal.price - this.coupon - this.inputCouponMoney;
    },
    handleClose(done) {
      this.isShowShop = false;
    },
    logout: function () {
      //退出登录
      var _this = this;
      this.$confirm("确认退出吗?", "提示")
        .then(() => {
          _this.$store.dispatch("toLogOut").then(() => {
            _this.clearAllData();
            _this.$router.push("/login");
          });
        })
        .catch(() => {});
    },
    setShop(item) {
      //切换店铺
      this.$store.dispatch("choosingShop", item).then(() => {
        this.isShowShop = false;
        this.clearAllData();
        this.defaultData();
        this.$router.push({
          path: "/home"
        });
      });
    },
    defaultData() {
      let homeData = getHomeData();
      if (homeData.shop) {
        this.shopInfo = Object.assign({}, homeData.shop);
      }
      this.UserName = getUserInfo().UserName;
      if (this.shopList.length == 0) {
        this.$store.dispatch("getShopList", {});
      }
    },
    changeShop() {
      let userInfo = getUserInfo();
      if (userInfo.CODE2 == "boss") {
        this.theshopList = [...this.shopList];
      } else {
        this.theshopList = [];
        for (let i = 0; i < userInfo.ShopList.length; i++) {
          if (userInfo.ShopList[i].ISPURVIEW == 1) {
            this.theshopList.push({
              ID: userInfo.ShopList[i].SHOPID,
              NAME: userInfo.ShopList[i].SHOPNAME
            });
          }
        }
      }
      this.isShowShop = true;
    },
    //触发分类
    ck_commoditycflList(flID, index) {
      this.current = index;
      this.pageData.PN = 1;
      this.pageData.TypeID = this.current == 0 ? "" : flID;
      this.isSelectGoods = false;
      this.getNewData();
    },
    //选择编辑商品的方法
    editChange(e, i) {
      this.eitcontant = true;
      this.eitprice = parseInt(e.discountMoney * 100) / 100;
      this.eitDatashop = e;
      this.$set(this.eitDatashop, "i", i);
      let n = e.discountMoney / e.PRICE;
      this.eitdiscount = parseInt(n * 100) / 100;
    },
    // 选择商品
    addcommodityc(item) {
      console.log("选择中的商品", item);
      this.showOptions = true;
      this.showRarmark = true;
      let count = 1;
      let dd = this.settheVipPrice(item, 0);
      if (this.addobjCountList.length > 0) {
        for (let i = 0; i < this.addobjCountList.length; i++) {
          if (this.addobjCountList[i].GoodsId == item.ID) {
            this.addobjCountList[i].Qty = this.addobjCountList[i].Qty + 1;
            break;
          } else {
            if (i + 1 < this.addobjCountList.length) {
              continue;
            } else {
              let Remark, discountMoney, Discount;
              if (item.DISPRICE != undefined) {
                if (item.ISVIPDISCOUNT == true) {
                  if (this.memberdetails.RATE != null && this.memberdetails.RATE != 1) {
                    discountMoney = parseFloat(item.DISPRICE * this.memberdetails.RATE * 100) / 100;
                    Remark =
                      "（限时特价" + item.DISPRICE + "元, 会员折扣" + this.memberdetails.RATE + ")";
                  } else {
                    discountMoney = item.DISPRICE;
                    Remark = "（限时特价" + item.DISPRICE + "元)";
                  }
                } else {
                  discountMoney = item.DISPRICE;
                  Remark = "（限时特价" + item.DISPRICE + "元)";
                }
                if (
                  item.VIPPRICE != undefined &&
                  item.VIPPRICE != 0 &&
                  this.VipId != "" &&
                  this.VipId != undefined
                ) {
                  if (item.VIPPRICE < discountMoney) {
                    discountMoney = item.VIPPRICE;
                    Remark = "（会员价" + item.VIPPRICE + "元)";
                  }
                }
              } else {
                if (
                  item.VIPPRICE != undefined &&
                  item.VIPPRICE != 0 &&
                  this.VipId != "" &&
                  this.VipId != undefined
                ) {
                  discountMoney = item.VIPPRICE;
                  Remark = "（会员价" + item.VIPPRICE + "元)";
                } else {
                  if (this.memberdetails.RATE != null && this.memberdetails.RATE != 1) {
                    discountMoney = parseFloat(item.PRICE * this.memberdetails.RATE * 100) / 100;
                    Remark = "（会员折扣" + this.memberdetails.RATE + ")";
                  } else {
                    Remark = "";
                    discountMoney = item.PRICE;
                  }
                }
              }
              let newItem = Object.assign(
                {
                  goodsname: item.NAME,
                  Qty: count,
                  GoodsId: item.ID,
                  itemObj: item,
                  shopMoney: item.PRICE,
                  discountMoney: discountMoney,
                  Remark: Remark,
                  eitGoods: false
                },
                item,
                dd
              );
              this.addobjCountList.unshift(newItem);
              break;
            }
          }
        }
      } else {
        let Remark, discountMoney;
        if (item.DISPRICE != undefined) {
          if (item.ISVIPDISCOUNT == true) {
            if (this.memberdetails.RATE != null && this.memberdetails.RATE != 1) {
              discountMoney = parseFloat(item.DISPRICE * this.memberdetails.RATE * 100) / 100;
              Remark =
                "（限时特价" + item.DISPRICE + "元, 会员折扣" + this.memberdetails.RATE + ")";
            } else {
              discountMoney = item.DISPRICE;
              Remark = "（限时特价" + item.DISPRICE + "元)";
            }
          } else {
            discountMoney = item.DISPRICE;
            Remark = "（限时特价" + item.DISPRICE + "元)";
          }
          if (
            item.VIPPRICE != undefined &&
            item.VIPPRICE != 0 &&
            this.VipId != "" &&
            this.VipId != undefined
          ) {
            if (item.VIPPRICE < discountMoney) {
              discountMoney = item.VIPPRICE;
              Remark = "（会员价" + item.VIPPRICE + "元)";
            }
          }
        } else {
          if (
            item.VIPPRICE != undefined &&
            item.VIPPRICE != 0 &&
            this.VipId != "" &&
            this.VipId != undefined
          ) {
            discountMoney = item.VIPPRICE;
            Remark = "（会员价" + item.VIPPRICE + "元)";
          } else {
            if (this.memberdetails.RATE != null && this.memberdetails.RATE != 1) {
              discountMoney = parseFloat(item.PRICE * this.memberdetails.RATE * 100) / 100;
              Remark = "（会员折扣" + this.memberdetails.RATE + ")";
            } else {
              Remark = "";
              discountMoney = item.PRICE;
            }
          }
        }
        let newItem = Object.assign(
          {
            goodsname: item.NAME,
            Qty: count,
            GoodsId: item.ID,
            itemObj: item,
            shopMoney: item.PRICE,
            discountMoney: discountMoney,
            Remark: Remark,
            eitGoods: false
          },
          item,
          dd
        );
        this.addobjCountList.unshift(newItem);
      }
      this.dealTotalData();
    },
    delClick() {
      this.listMember = false;
      this.$store.dispatch("selectingMember", {});
      this.memberdetails = {};
      this.inputShow = true;
      this.showOptions = false;
      this.showRarmark = false;
      let Remark, discountMoney;
      this.VipIds = {};
      let list = this.addobjCountList;
      if (list.length != 0) {
        for (let i in list) {
          if (list[i].eitGoods == false) {
            if (list[i].DISPRICE != undefined) {
              if (list[i].ISVIPDISCOUNT == true) {
                if (this.memberdetails.RATE != null && this.memberdetails.RATE != 1) {
                  discountMoney =
                    parseFloat(list[i].DISPRICE * this.memberdetails.RATE * 100) / 100;
                  Remark =
                    "（限时特价" +
                    list[i].DISPRICE +
                    "元, 会员折扣" +
                    this.memberdetails.RATE +
                    ")";
                } else {
                  discountMoney = list[i].DISPRICE;
                  Remark = "（限时特价" + list[i].DISPRICE + "元)";
                }
              } else {
                discountMoney = list[i].DISPRICE;
                Remark = "（限时特价" + list[i].DISPRICE + "元)";
              }
            } else {
              if (this.memberdetails.RATE != null && this.memberdetails.RATE != 1) {
                discountMoney = parseFloat(list[i].PRICE * this.memberdetails.RATE * 100) / 100;
                Remark = "（会员折扣" + this.memberdetails.RATE + ")";
              } else {
                Remark = "";
                discountMoney = list[i].PRICE;
              }
            }
            list[i].Remark = Remark;
            list[i].discountMoney = discountMoney;
          }
        }
      }
      this.dealTotalData();
    },
    search_mb() {
      this.listMember = this.searchText1 == "" ? false : true;
      this.isshowtatus = true;

      this.searchfun3();
    },
    getNewData1() {
      this.$store.dispatch("getSsmemberdList", this.pageDataMember);
    },
    searchfun3() {
      if (!this.searchText1) {
        return;
      }
      this.loadingMember = true;
      this.pageDataMember.Filter = this.searchText1;
      this.getNewData1();
    },
    appClick(data) {
      this.listMember = false;
      this.totalPrice.integral = data.INTEGRAL;
      this.VipId = data.ID;
      this.VipIds = data;
      console.log(this.VipIds, "vipids");
      this.inputShow = false;
      this.searchText1 = "";
      this.datalist = [];
      this.memberdetails = data;
      if (data.OPENID == undefined || data.OPENID == "" || data.OPENID == "0") {
        this.$store.state.dropdown.ssmemberopenID = "";
      } else {
        this.$store.state.dropdown.ssmemberopenID = data.OPENID;
      }

      let Remark, discountMoney, Discount;
      let list = this.addobjCountList;
      if (list.length != 0) {
        for (let i in list) {
          if (list[i].eitGoods == false) {
            if (list[i].DISPRICE != undefined) {
              if (list[i].ISVIPDISCOUNT == true) {
                if (this.memberdetails.RATE != null && this.memberdetails.RATE != 1) {
                  discountMoney =
                    parseFloat(list[i].DISPRICE * this.memberdetails.RATE * 100) / 100;
                  Remark =
                    "（限时特价" +
                    list[i].DISPRICE +
                    "元, 会员折扣" +
                    this.memberdetails.RATE +
                    ")";
                } else {
                  discountMoney = list[i].DISPRICE;
                  Remark = "（限时特价" + list[i].DISPRICE + "元)";
                }
              } else {
                discountMoney = list[i].DISPRICE;
                Remark = "（限时特价" + list[i].DISPRICE + "元)";
              }
              if (
                list[i].VIPPRICE != undefined &&
                list[i].VIPPRICE != 0 &&
                this.VipId != "" &&
                this.VipId != undefined
              ) {
                if (list[i].VIPPRICE < discountMoney) {
                  discountMoney = list[i].VIPPRICE;
                  Discount = 1;
                  Remark = "（会员价" + list[i].VIPPRICE + "元)";
                }
              }
            } else {
              if (
                list[i].VIPPRICE != undefined &&
                list[i].VIPPRICE != 0 &&
                this.VipId != "" &&
                this.VipId != undefined
              ) {
                discountMoney = list[i].VIPPRICE;
                Discount = 1;
                Remark = "（会员价" + list[i].VIPPRICE + "元)";
              } else {
                if (this.memberdetails.RATE != null && this.memberdetails.RATE != 1) {
                  discountMoney = parseFloat(list[i].PRICE * this.memberdetails.RATE * 100) / 100;
                  Remark = "（会员折扣" + this.memberdetails.RATE + ")";
                } else {
                  Remark = "";
                  discountMoney = list[i].PRICE;
                }
              }
            }
            list[i].Remark = Remark;
            list[i].discountMoney = discountMoney;
          }
        }
      }
      this.dealTotalData();
    },
    handlePageChange: function (currentPage) {
      this.isshowtatus = false;
      this.pageData.PN = currentPage;
      this.getNewData1();
    },
    //选择优惠卡
    handleCommand(event) {
      this.tate = event;
      this.inputCouponMoney = (this.totalTotal.price - this.totalTotal.price * this.tate).toFixed(
        2
      );
    },
    getNewData() {
      this.$store.dispatch("getGoodsListNew", this.pageData).then(() => {
        this.loading = true;
      });
    },
    //点击商品页面请求商品数据方法
    handlePageChange: function (currentPage) {
      if (this.pageData.PN == currentPage || this.loading) {
        return;
      }
      this.pageData.PN = parseInt(currentPage);
      this.isSelectGoods = false;
      this.getNewData();
    },
    searchfun: _.debounce(function () {
      this.searchfun2(0);
    }, 1000),
    searchfun2(type) {
      if (type == 1 && !this.searchText) {
        return;
      }
      this.pageData.Filter = this.searchText;
      this.isSelectGoods = true;
      this.getNewData();
    },
    settheVipPrice(goodsItem, type, value) {
      return settheVipPrice_Fun(goodsItem, this.VipIdrows, type, value);
    },
    //输入本次售价改变商品价格的方法
    eitpriceChange() {
      this.eitdiscount = parseFloat(this.eitprice) / parseFloat(this.eitDatashop.PRICE);
    },
    //输入折扣改变商品价格的方法
    discountChange() {
      let m;
      m = this.eitdiscount * this.eitprice;
      this.eitprice = parseInt(m * 100) / 100;
    },
    //保存编辑商品的事件
    saveShop(i) {
      let Remark;
      Remark = "（本次折扣" + parseInt(this.eitdiscount * 100) / 100 + ")";
      this.addobjCountList[i].eitGoods = true;
      this.addobjCountList[i].Remark = Remark;
      // this.addobjCountList[i].discountMoney = parseFloat(this.eitprice)
      this.addobjCountList[i].discountMoney = parseFloat(
        this.eitdiscount * this.addobjCountList[i].PRICE
      );

      this.addobjCountList[i].shopMoney = parseFloat(this.eitprice) * this.addobjCountList[i].Qty;

      this.addobjCountList[i].retailprice = parseInt(this.eitprice * 100) / 100;
      this.eitcontant = false;
      this.dealTotalData();
      console.log("折扣价格有变化吗", this.addobjCountList[i].discountMoney);
    },
    //根据会员ID调优惠卷接口的方法
    selctCoupon() {
       console.log(this.pageCouponList)
      if (this.memberdetails.ID == null) {
        this.$message("请选择会员");
        return;
      } else {
        this.pageCouponList.VipId = this.VipId;
        this.pageCouponList.Type = 0;
        this.pageCouponList.CouponType = 0;

        this.$store.dispatch("getcouponListState", this.pageCouponList);
      }
    },
    //选择优惠卷
    selectCouponList(e, items) {
      this.selectlist = [];
      for (var i in this.dataLists) {
        if (e == i) {
          this.dataLists[i].isSelect = !this.dataLists[i].isSelect;
          if (this.dataLists[i].isSelect == true) {
            this.selectlist = items;
          }
        } else {
          this.dataLists[i].isSelect = false;
        }
      }
      if (this.selectlist.MONEY != undefined) {
        this.coupon = this.selectlist.MONEY;
        this.couponCode = this.selectlist.COUPONCODE;
        this.showCoupn = false;
      }
      if (this.selectlist.MONEY == undefined) {
        this.showCoupn = true;
        this.coupon = 0;
      }
    },
    //切换有用或者无用优惠卷列表方法
    selectCoupont(items) {
      this.indexs = items;
      if (items == 1) {
        this.showCoupont1 = true;
        this.showCoupont2 = false;
      } else {
        this.showCoupont2 = true;
        this.showCoupont1 = false;
      }
    },
    //清空页面方法
    clearData() {
      this.addobjCountList = [];
      this.cashRechargeData = {};
      this.VipId = "";
      this.BillId = "";
      this.totalTotal = {
        num: 0,
        price: 0
      };
      this.inputShow = true;
      this.memberdetails.ID = null;
      this.showOptions = false;
      this.showRarmark = false;
      this.inputCouponMoney = "";
      this.coupon = "";
      this.couponCode = "";
    },
    //  移除商品
    delgoods(i) {
      this.addobjCountList.splice(i, 1);
      this.dealTotalData();
      this.eitcontant = false;
      if (this.addobjCountList.length == 0) {
        this.showOptions = false;
        this.showRarmark = false;
      }
    },
    //统计总价钱的方法
    dealTotalData() {
      let tnum = 0,
        tprice = 0,
        tdiscount = 0;
      for (let i = 0; i < this.addobjCountList.length; i++) {
        let tt =
          parseFloat(this.addobjCountList[i].discountMoney) *
          parseFloat(this.addobjCountList[i].Qty);
        tnum += parseFloat(this.addobjCountList[i].Qty);
        tprice += tt;
      }
      this.totalTotal = {
        num: tnum,
        price: tprice
      };
      this.inputCouponMoney = (this.totalTotal.price - this.totalTotal.price * this.tate).toFixed(
        2
      );
    },
    addjiajianhao1(i, e) {
      this.addobjCountList[i].Qty = e;
      this.dealTotalData();
    },
    //判断有没有选择商品
    co_reckoning() {
      this.$store.dispatch("selectingMember", {});
      let agentPermission = getUserInfo().List;
      let arr = agentPermission.filter((element) => element.MODULECODE == "210040302");
      if (arr.length > 0 && !this.isPurViewFun(arr[0].MODULECODE)) {
        this.$message.warning("您还没有获得相关权限!");
      } else {
        if (this.isneedsaler == true) {
          if (this.value.length > 0) {
          } else {
            this.$message("请选择销售员");
            return;
          }
        }
        if (this.addobjCountList.length == 0) {
          this.$message("请选择商品");
          return;
        }
        this.showRecharge = true;
        // this.dealTotalData();
        this.totalPrice.price = this.totalTotal.price - this.coupon - this.inputCouponMoney;
      }
    },
    // 结账
    CashRecharge(data) {
      this.submitLoading = true;
      this.totalPrice.price = 0;
      let GoodsDetaila = [];
      this.cashRechargeData = data;
      this.checkedreceipt = data.checkedreceipt;

      let { checkedreceipt, payName, payMoney, ...newData } = data;

      for (let i = 0; i < this.addobjCountList.length; i++) {
        let Obj = {
          GoodsId: this.addobjCountList[i].GoodsId,
          Qty: this.addobjCountList[i].Qty,
          PayPrice: this.addobjCountList[i].discountMoney * this.addobjCountList[i].Qty,
          Price: this.addobjCountList[i].discountMoney,
          Discount: this.addobjCountList[i].Discount
        };
        GoodsDetaila.push(Obj);
      }
      this.showRecharge = false;
      this.showTishi = "结账成功";
      let otherdata = {
        GoodsDetail: JSON.stringify(GoodsDetaila),
        FavorMoney: Number(this.inputCouponMoney),
        VipId: this.VipId == undefined ? "" : this.VipId,
        CouponNo: this.couponCode, //优惠卷号
        PaytypeId: "", //付款方式
        GetIntegral: "", //获得积分
        IntegralMoney: newData.PayIntegral,
        Remark: this.remark,
        BillId: this.BillId,
        SaleEmpList: this.SaleEmpList //销售员,
      };
      let AllsendData = Object.assign({}, otherdata, newData);
      if (AllsendData.PayMoney) {
        AllsendData.PayMoney = parseFloat(AllsendData.PayMoney).toFixed(2);
      }

      console.log(newData);

      this.$store.dispatch("getcommoditycconsumption", AllsendData);
    },
    setcommonHeight() {
      let elememtheight = this.$refs.elememt.offsetHeight;
      let footerheight = this.$refs.footer.offsetHeight;
      this.$refs.addsockheight.style.height = elememtheight - footerheight - 200 + "px";
    },
    setfenleiWidth() {
      let elefenleiWidthsock = this.$refs.fenleiWidthsock.offsetWidth;
      this.$refs.swipercontainersock.style.width = elefenleiWidthsock - 179 + "px";
    },
    fenleiscrollwidth() {
      this.$nextTick(function () {
        var mySwiper = new Swiper(".swiper-container", {
          slidesPerView: 12,
          paginationClickable: !0,
          spaceBetween: 4,
          freeMode: !0
        });
      });
    },
    seletSale(event) {
      this.SaleEmpList = event;
    }
  },
  components: {
    yjemployee,
    recharge,
    addNewGoods: () => import("@/components/goods/add")
  },
  beforeCreate() {
    let list = this.$store.state.commodityc.commoditycflList;
    if (list.length == 0) {
      this.$store.dispatch("getcommoditycflList", {});
    }
    this.$store
      .dispatch("getGoodsListNew", {
        Status: 1,
        Mode: 0,
        Filter: "",
        PN: 1
      })
      .then(() => {
        this.isSelectGoods = false;
      });
    let list1 = this.$store.state.employee.employeeList;
    if (list1.length == 0) {
      this.$store.dispatch("getEmployeeList", { ShopId: getHomeData().shop.ID });
    }
    let list2 = this.$store.state.commodityc.commoditycflDiscountList;
    if (list2.length == 0) {
      this.$store.dispatch("getcommoditycDiscountList", {});
    }
  },
  mounted() {
    this.$store.dispatch("getcommoditycflList", {});
    this.pagination = {
      TotalNumber: this.dataListState.paying.TotalNumber,
      PageNumber: this.dataListState.paying.PageNumber,
      PageSize: this.dataListState.paying.PageSize,
      PN: this.dataListState.paying.PN
    };
    this.pagelist = [...this.dataList];

    this.$store.dispatch("getEmployeeList", { ShopId: getHomeData().shop.ID });
    this.$store.dispatch("getcommoditycDiscountList", {});
    this.setcommonHeight();
    // this.setfenleiWidth();
    this.fenleiscrollwidth();
  }
};
</script>

<style lang="scss" scoped>
.list-module {
  max-height: 260px;
  overflow-y: auto;
  background: #fff;
  width: 100%;
  z-index: 999;
  border-top: 1px solid #f2f2f2;
  box-shadow: 0 8px 15px #aaa;
  li {
    border-bottom: 1px dotted #ddd;
    overflow: hidden;
    position: relative;
    img {
      width: 40px;
      height: 40px;
      float: left;
      margin-right: 6px;
      border-radius: 4px;
    }
    .itmeright {
      align-items: center;
      display: flex;
      width: 90%;
      position: absolute;
      left: 0;
      box-sizing: border-box;
      padding-left: 50px;
      padding-right: 6px;
    }

    &._self-hide {
      display: none;
    }
    margin-top: 0.5em;
    padding: 0.5em;
    &:hover {
      cursor: pointer;
      background: #f5f7fa;
    }
    &:last-child {
      border-bottom: 0;
    }
  }
}
.search-text {
  width: 100%;
  height: 60px;
  padding-right: 2em;
  padding-left: 0.5em;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  font-size: 12px;
  border: 1px solid #ccc;
  border: none !important;
}
.ssmemberul {
  position: relative;
  //   height: 60px;
  width: 100%;
  background: #fff;
  padding: 10px 0;
  /* border: solid 1px #00a0e9; */
}
.ssmemberul-cont {
  width: 92%;
  margin-left: 4%;
  margin-right: 4%;
  display: flex;
  align-items: center;
  height: 60px;
}
.ssmemberul-cont-name {
  font-size: 14px;
  color: rgba(51, 51, 51, 1);
}
.ssmemberul-cont-ka {
  margin-left: 15px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  background: rgba(37, 137, 255, 1);
  border-radius: 4px;
  padding: 2px 4px;
}
.ssmemberul-massge-ncp {
  display: flex;
}
.ssmemberul-cont-text {
  font-size: 12px;
  color: rgba(153, 153, 153, 1);
  margin-top: 5px;
}
.ssmemberul-cont-phone {
  color: rgba(153, 153, 153, 1);
  font-size: 12px;
}
.ssmemberul-imgUrl img {
  height: 35px;
  width: 35px;
  border-radius: 100%;
}
.ssmemberul-massge {
  margin-left: 10px;
  font-size: 12px;
}
.eitcontant-shop {
  width: 88%;
  margin-left: 6%;
  margin-right: 6%;
  margin-top: 20px;
}
.eitcontant-title {
  height: 50px;
  width: 100%;
  line-height: 50px;
  text-align: center;
  border-bottom: solid 1px #ededed;
}
.eitcontant {
  width: 510px;
  height: 500px;
  position: absolute;
  top: 112px;
  left: 0px;
  background: #fff;
  z-index: 9999;
  border-radius: 6px;
  border: solid 1px #ededed;
}
.coupont-list-top-money {
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  margin-left: 5px;
}
.coupont-list-top-allmoney {
  margin-left: 5px;
  font-size: 5px !important;
  font-family: Microsoft YaHei;
  color: rgba(255, 255, 255, 1);
}
.coupon-title {
  position: relative;
  height: 40px;
  width: 100%;
  line-height: 30px;
  text-align: center;
  border-bottom: solid 1px rgba(242, 242, 242, 1);
  font-size: 8px;
  color: #c0c4cc;
}
.el-icon-close {
  position: absolute;
  right: 0;
  font-size: 20px;
  margin-top: 10px;
}
.discount-title {
  margin-left: 5px;
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
  background: #3399ff;
  color: #fff;
  border-radius: 100%;
  font-size: 4px;
}
.el-dropdown-link {
  width: 100%;
  height: 20px;
}
.commodity-right {
  position: relative;
  width: 100%;
  height: 100%;
}
.discount {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
}
.gright {
  position: absolute;
  right: 5px;
}
.goodsName {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 36px;
  line-height: 36px;
}
.classification_List {
  overflow: hidden;
  //   margin-right: 10px;
  margin-left: 10px;
}

.classification_List ul li {
  float: left;
  width: 58px;
  text-align: center;
  cursor: pointer;
  line-height: 38px;
  overflow: hidden;
  white-space: nowrap;
  margin-right: 15px;
  text-overflow: ellipsis;
  font-size: 12px;
  color: #333333;
}

.classification_List ul li.selected {
  color: #2589ff;
  border-bottom: 2px solid #2589ff;
}

.commodityc_rightsock {
  width: 100%;
  margin-top: 12px;
}

.employee_ms .el-form-item__content {
  width: 70%;
}

.f-botton-fs .el-form-item__label {
  text-align: left !important;
}

.f-botton-fs .fastc_top {
  margin-top: 50px;
}

.f-botton-fssock .el-dialog__body {
  padding: 5px 20px;
}

.employeetitle {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 12px;
  overflow: hidden;
  color: #130606;
  text-align: center;
}

.timescountc_left ul.productNav {
  /*padding: 0 12px;*/
  overflow: hidden;
  height: 26px;
  line-height: 26px;
  color: #795548;
  background-color: rgba(251, 120, 154, 0.3294117);
}

.timescountc_left ul.productNav li {
  float: left;
  text-align: center;
}
.timescountc_left ul#addshopList li {
  margin-top: 6px;
  width: 100%;
  overflow: hidden;
  padding: 4px 0;
}

.timescountc_left ul#addshopList li .cateringProductMoreinfo {
  overflow: hidden;
  width: 100%;
  float: left;
  color: #9e9e9e;
  font-size: 12px;
  margin-top: 5px;
  cursor: pointer;
}

.timescountc_left ul#addshopList .cateringProductNamebox {
  width: 15%;
  float: left;
  text-align: center;
}

.timescountc_left_footer {
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  // background: #fff;
}

/*模板样式*/
.tablelcenter {
  // height: 60px;
  overflow: hidden;
  position: relative;
  border: 1px solid #e3e3e3;
  /* padding: 8px; */
  cursor: pointer;
  background: #fff;
}
.menu-img-right {
  height: 56px;
  /* background: #130606 */
}
.menu-img-right .goodsku {
  height: 28px;
  display: flex;
  align-items: center;
  padding-bottom: 5px;
}

.timescountc_right .tablelcenter .menu-txt {
  display: flex;
}
.addshopList-cont {
  position: relative;
  height: 80px;
  width: 548px;
  background: #fff;
}
.ssmemberul-cont .el-icon-delete {
  position: absolute;
  right: 15px;
  top: 19px;
  color: #b6b6b6;
  cursor: pointer;
}
.el-icon-delete {
  position: absolute;
  right: 15px;
  top: 15px;
  color: #b6b6b6;
  cursor: pointer;
}
.addshopList-cont-list {
  display: flex;
  height: 35px;
  align-items: center;
  width: 96%;
  margin-left: 2%;
  margin-right: 2%;
}
.addshopList-cont-list .name {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #444444;
}
.addshopList-cont-list .discountMoney {
  font-size: 14px;
  font-family: HelveticaCyr Upright;
  font-weight: bold;
  color: #838282;
}
.addshopList-cont-list .discountMoney-dazhe {
  font-size: 10px;
  font-family: HelveticaCyr Upright;
  // font-weight:bold;
  color: #838282;
  text-decoration: line-through;
}
.shopMoney {
  text-align: right;
  font-size: 14px;
  font-family: HelveticaCyr Upright;
  font-weight: bold;
  color: rgba(255, 0, 0, 1);
}
.showEit-top {
  width: 100%;
  height: 100px;
  border: solid 1px #dddddd;
}
.showEit-top img {
  height: 50px;
  width: 50px;
  margin-top: 25px;
  margin-left: 25px;
}
.showEit-title {
  margin-top: 30px;
}
.showEit-center {
  margin-top: 15px;
  width: 100%;
  height: 285px;
  border: solid 1px #dddddd;
}
.showEit-center-money {
  position: relative;
  height: 60px;
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
  border-bottom: solid 1px #dddddd;
}
.showEit-center-money-tt {
  position: absolute;
  bottom: 8px;
}
.showEit-bottom {
  margin-top: 30px;
  height: 50px;
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
}
.showEit-input {
  border: none !important;
  margin-left: 30px;
}
.showEit-input1 {
  border: none !important;
  margin-left: 5px;
  font-size: 12px !important;
}
.search_sock {
  height: 50px;
  line-height: 50px;
  background: #fff;
  width: 100%;
  border-left: solid 1px #ebedf0;
  border-bottom: solid 1px #ebedf0;
}
.search_sock-input {
  width: 100%;
}
.search_sock-shop {
  width: 50%;
  text-align: right;
}
.commodity-right-good-list {
  padding-top: 10px;
  // border-left: solid 1px #EBEDF0;
  width: 100%;
  padding-right: 10px;
}
.showCoupon >>> .el-dialog__header {
  border-bottom: solid 1px #eeeeee;
}
.coupon {
  width: 96%;
  margin-left: 2%;
  margin-right: 2%;
  height: 450px;
}
.selectList {
  height: 50px;
  width: 100%;
  line-height: 50px;
  border-bottom: solid 1px #f9fafc;
}
.selectList ul li {
  float: left;
  width: 50%;
  text-align: center;
}
.selectList-fists {
  width: 70px;
  height: 40px;
  text-align: center;
  border-bottom: solid 1px #3ea9ff;
  margin: 0 auto;
}
.select-list {
  width: 100%;
  margin: 0 auto;
}
.select-list ul li {
  float: left;
  margin-right: 7px;
  // margin-left: 12px;
  margin-top: 10px;
}
.secect-border {
  border: solid 2px #f8493b !important;
}
.select-list-cont {
  position: relative;
  height: 350px;
  overflow: auto;
}
.select-list-bottom {
  height: 100px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 100px;
}
.coupont ul li {
  float: left;
  margin-right: 15px;
  margin-top: 8px;
}
.coupont-list {
  height: 100px;
  border: solid 2px #3ea9ff;
  color: #fff;
}
.coupont-list-top {
  height: 64px;
  background: #3ea9ff;
}
.coupont-list-bottom {
  height: 34px;
  width: 160px;
  line-height: 35px;
  margin-left: 15px;
  font-size: 11px;
  color: #666666;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.coupon-ts {
  height: 40px;
  line-height: 40px;
  width: 50px;
}
.coupon-ts .gright {
  top: 15px;
  color: #9e9e9e;
}
.show-goodImg {
  text-align: center;
  margin-top: 200px;
}
.goodImg-text {
  color: #9e9e9e;
  font-size: 11px;
}
.show-goodImgCoupont {
  margin-top: 120px;
  margin-left: 150px;
  width: 100%;
}
.goodImgCoupont {
  width: 100px;
  height: 100px;
}
.goodImg-textCoupont {
  color: #9e9e9e;
}
.swiper-container {
  display: flex;
  align-items: center;
  background: #fff;
  // margin-top: 5px;
}
.swiper-container-left {
  width: 20px;
  text-align: right;
  background: #fff;
  z-index: 99999;
}
.swiper-container-right {
  width: 20px;
  text-align: left;
  z-index: 99999;
}
.item_dright-left {
  width: 60%;
  margin-left: 10px;
}
.item_dright-left .name {
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 50%;
  overflow: hidden;
  display: inline-block;
  font-size: 14px;
}
.item_dright-left .phone {
  color: #a7a7a8;
  font-size: 12px;
}
.item_dright-right {
  text-align: left;
  color: #a7a7a8;
  font-size: 12px;
}
::-webkit-scrollbar {
  width: 3px;
}
::-webkit-scrollbar-track {
  background-color: #e3e3e5;
}
::-webkit-scrollbar-thumb {
  background-color: #979799;
}
input::-webkit-input-placeholder {
  color: #c0c4cc;
  font-size: 12px;
}
.img {
  display: flex;
  align-items: center;
  width: 100%;
  // height: 60px;
}
.img:hover {
  transform: scale(1.03, 1.03);
}
.shop {
  line-height: 50px;
  height: 50px;
  text-align: right;
  padding-right: 20px;
  border-bottom: 1px solid #ebedf0;
  background: #fff;
}
.shop .name {
  margin-right: 8px;
}
.icon-reorder {
  color: #2589ff;
  cursor: pointer;
}
.el-icon-info {
  color: #2589ff;
  font-size: 12px;
}
</style >
<style scoped>
.timescountc_left_footer >>> .el-input__inner {
  border: 1px solid #fff !important;
  background: #fff;
  font-size: 12px;
  color: #444444;
}
.timescountc_left_footer >>> .el-textarea__inner {
  border: 1px solid #fff !important;
  background: #fff;
  font-size: 12px;
  padding: 0 15px !important;
  min-height: 40px !important;
  line-height: 3 !important;
}
.priceTol {
  color: #dc2823;
  font-weight: bold;
  font-size: 20px;
}
</style>
