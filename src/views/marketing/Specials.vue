<template>
	<!-- 限时特价 -->
	<el-container>
		<el-header style="height: 50px; padding: 0">
			<headerPage :pageList="buttonGroup"></headerPage>
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
				<div class="content-new-fex">
					<div class="content-eighty">
						<div class="content-center">
							<el-row :gutter="10">
								<el-col :span="8">
									<el-button size="small" type="primary" @click="handleNew">
										新增活动
									</el-button>
								</el-col>
								<el-col :span="10" class="text-right">
									<el-radio-group
										size="small"
										v-model="radioStatus"
										@change="curRadioStatus()"
									>
										<el-radio-button
											v-for="(item, index) in choseList"
											:key="index"
											:label="item.id"
										>
											{{ item.name }}
										</el-radio-button>
									</el-radio-group>
								</el-col>
								<el-col :span="6" style="text-align: right">
									<el-input
										size="small"
										style="width: 260px"
										v-model="Filter"
										prefix-icon="el-icon-search"
										@input="curRadioStatus()"
										placeholder="请输入活动名称"
										clearable
									></el-input>
								</el-col>
							</el-row>
						</div>
					</div>
					<div class="content-table4">
						<div class="content-table-center">
							<el-table
								:data="tableData"
								size="small"
								v-loading="loading"
								element-loading-text="数据加载中..."
								header-row-class-name="bg-theme2 text-white"
								style="width: 100%"
							>
								<el-table-column
									type="index"
									label="序号"
									align="center"
									width="80"
								></el-table-column>
								<el-table-column
									prop="NAME"
									align="center"
									label="活动名称"
								></el-table-column>
								<el-table-column prop="date" align="center" label="活动时间">
									<template slot-scope="scope">
										{{ new Date(scope.row.BEGINDATE) | time }} 至
										{{ new Date(scope.row.ENDDATE) | time }}
									</template>
								</el-table-column>
								<el-table-column align="center" label="活动店铺">
									<template slot-scope="scope">
										{{ scope.row.SHOPLIST.split(",").length }} 家
									</template>
								</el-table-column>
								<el-table-column align="center" label="活动状态">
									<template slot-scope="scope">
										{{
											scope.row.VALIDTYPE == 0
												? "已结束"
												: scope.row.VALIDTYPE == 1
												? "进行中"
												: "未开始"
										}}
									</template>
								</el-table-column>
								<el-table-column label="操作" align="right">
									<template slot-scope="scope">
										<el-button
											size="small"
											type="text"
											@click="viewCurItem(scope.row)"
										>
											详情
										</el-button>
										<el-button
											size="small"
											type="text"
											@click="delCurListItem(scope.row)"
										>
											删除
										</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
					<el-dialog
						title="新增限时特价"
						:visible.sync="showNewForm"
						append-to-body
						width="700px"
					>
						<el-form
							:model="ruleForm"
							:rules="rules"
							ref="ruleForm"
							label-width="100px"
						>
							<el-form-item label="活动名称" prop="Name">
								<el-input
									size="small"
									v-model="ruleForm.Name"
									placeholder="请输入活动名称"
								></el-input>
							</el-form-item>
							<el-form-item label="活动时间" prop="dateBE">
								<el-date-picker
									v-model="ruleForm.dateBE[0]"
									value-format="timestamp"
									align="right"
									type="date"
									size="small"
									placeholder="选择开始日期"
									style="width: 47%; margin-right: -4px"
								></el-date-picker>
								<span class="text-muted inline-block text-center" style="width: 6%">
									至
								</span>
								<el-date-picker
									v-model="ruleForm.dateBE[1]"
									value-format="timestamp"
									align="right"
									type="date"
									size="small"
									placeholder="选择结束日期"
									style="width: 47%; margin-left: -4px"
								></el-date-picker>
							</el-form-item>
							<el-form-item label="参与店铺">
								<el-radio-group
									v-model="ShopNameListState"
									@change="selectShopState"
								>
									<el-radio :label="true">全部店铺</el-radio>
									<el-radio :label="false">部分店铺</el-radio>
								</el-radio-group>
								<div v-if="!ShopNameListState">
									<el-checkbox-group v-model="ShopNameList" size="small">
										<el-checkbox
											border
											v-for="(item, i) in shopList"
											:key="i"
											:label="item.NAME"
										>
											{{ item.NAME }}
										</el-checkbox>
									</el-checkbox-group>
								</div>
							</el-form-item>
							<el-form-item label="">
								<template slot="label">
									<div>
										<span>会员折上折</span>
										<el-tooltip
											class="item"
											effect="dark"
											content="启用之后，商品 会在优惠价的基础上继续执行会员折扣"
											placement="top-start"
										>
											<i class="el-icon-question"></i>
										</el-tooltip>
									</div>
								</template>

								<el-radio-group v-model="ruleForm.IsVipDiscount">
									<el-radio :label="true">启用</el-radio>
									<el-radio :label="false">不启用</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="是否启用">
								<el-radio-group v-model="ruleForm.IsStart">
									<el-radio :label="1">启用</el-radio>
									<el-radio :label="0">停用</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="商品信息">
								<el-button
									size="small"
									type="text"
									@click="showAddserversgoods = true"
								>
									添加商品+
								</el-button>
							</el-form-item>
							<el-form-item>
								<el-table
									border
									size="small"
									v-if="ruleForm.GoodsList.length > 0"
									:data="ruleForm.GoodsList"
									:highlight-current-row="true"
									header-row-class-name="bg-theme2 text-white"
									style="width: 100%"
									height="260px"
								>
									<el-table-column
										prop="GoodsName"
										label="商品"
										align="center"
									></el-table-column>
									<el-table-column label="原价" align="center">
										<template slot-scope="scope">
											{{ `￥${scope.row.GoodsPrice}` }}
										</template>
									</el-table-column>
									<el-table-column
										prop="Discount"
										label="折扣"
										align="center"
										width="130px"
									>
										<template slot-scope="scope">
											<el-input-number
												size="mini"
												style="width: 100px"
												controls-position="right"
												:min="0"
												:max="1"
												v-model.trim="scope.row.Discount"
												@keyup.enter.native="changePr(scope.row)"
												@change="changePr(scope.row)"
											></el-input-number>
										</template>
									</el-table-column>
									<el-table-column
										prop="DisPrice"
										label="优惠价"
										align="center"
										width="140px"
									>
										<template slot-scope="scope">
											<el-input-number
												size="mini"
												style="width: 110px"
												controls-position="right"
												:min="0"
												v-model.trim="scope.row.DisPrice"
												@keyup.enter.native="changeDP(scope.row)"
												@change="changeDP(scope.row)"
											></el-input-number>
										</template>
									</el-table-column>
									<el-table-column
										label="操作"
										width="80px"
										align="center"
										fixed="right"
									>
										<template slot-scope="scope">
											<el-button
												size="small"
												type="text"
												@click="delCurRow(scope.$index, scope.row)"
											>
												删除
											</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="saveAddSpecials">保存</el-button>
								<el-button @click="showNewForm = false">取消</el-button>
							</el-form-item>
						</el-form>
					</el-dialog>
					<el-dialog
						title="选择商品"
						width="70%"
						:visible.sync="showAddserversgoods"
						append-to-body
					>
						<selGoodsPage
							v-if="handlerclickadd"
							@closeModal="showAddserversgoods = false"
							@handlerClickadd="handlerclickadd"
						></selGoodsPage>
					</el-dialog>
				</div>
			</el-container>
		</el-container>
	</el-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData, getUserInfo } from "@/api/index";
import MIXINS_MARKETING from "@/mixins/marketing.js";
export default {
	mixins: [MIXINS_MARKETING.MARKETING_MENU],
	data() {
		return {
			ShopNameListState: true,
			ShopNameList: [],
			showAddserversgoods: false,
			choseList: [
				{ id: 0, name: "全 部" },
				{ id: 1, name: "未开始" },
				{ id: 2, name: "进行中" },
				{ id: 3, name: "已结束" }
			],
			radioStatus: 0,
			tableData: [],
			showNewForm: false,
			loading: false,
			ruleForm: {
				Name: "",
				dateBE: [],
				IsVipDiscount: false,
				GoodsList: [],
				ShopNameList: "",
				ShopIdList: "",
				BillId: "",
				IsStart: 1
			},
			rules: {
				Name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
				dateBE: [{ required: true, message: "请选择时间", trigger: "change" }]
			},
			PN: 1,
			Filter: "",
			pagination: {
				TotalNumber: 0,
				PageNumber: 0,
				PageSize: 20,
				PN: 1
			},
			DelArr: [],
			buttonGroup: [
				{ label: "拓客工具", value: "/marketing/bespeakList" },
				{ label: "限时特价", value: "" }
			]
		};
	},
	computed: {
		...mapGetters({
			shopList: "shopList",
			specialsDataState: "specialsDataState",
			delSpecialsState: "delSpecialsState",
			specialsItemState: "specialsItemState",
			saveSpecialsState: "saveSpecialsState"
		})
	},
	watch: {
		saveSpecialsState(data) {
			this.ShopNameList = [];
			if (data.success) {
				this.curRadioStatus();
			}
			this.$message({ type: data.success ? "success" : "error", message: data.message });
		},
		specialsItemState(data) {
			let obj = data.data.Obj;
			if (data.success) {
				let arr = data.data.GoodsObj,
					newArr = [];
				if (arr.length != 0) {
					for (var i in arr) {
						newArr.push({
							Id: arr[i].ID,
							GoodsId: arr[i].GOODSID,
							GoodsName: arr[i].GOODSNAME,
							Discount: arr[i].DISCOUNT == undefined ? 1 : arr[i].DISCOUNT,
							GoodsPrice: arr[i].GOODSPRICE,
							DisPrice: arr[i].DISPRICE,
							IsCancel: arr[i].ISCANCEL == false ? 0 : 1
						});
					}
					this.ruleForm.GoodsList = newArr;
				}
				this.ruleForm.Name = obj.NAME;
				this.ruleForm.ShopIdList = obj.SHOPLIST;
				this.ruleForm.ShopNameList = obj.SHOPNAMELIST;
				this.ruleForm.dateBE = [obj.BEGINDATE, obj.ENDDATE];
				this.ruleForm.IsVipDiscount = obj.ISVIPDISCOUNT;
				this.ruleForm.IsStart = obj.ISSTART ? 1 : 0;
				this.ruleForm.BillId = obj.BILLID;
				this.ShopNameList = this.ruleForm.ShopNameList.split(",");
			}
		},
		delSpecialsState(data) {
			if (data.success) {
				this.curRadioStatus();
			}
			this.$message({ type: data.success ? "success" : "error", message: data.message });
		},
		specialsDataState(data) {
			this.loading = false;
			this.tableData = data.DataArr;
			this.pagination = {
				TotalNumber: data.TotalNumber,
				PageNumber: data.PageNumber,
				PageSize: data.PageSize,
				PN: data.PN
			};
			this.PN = data.PN;
		}
	},
	methods: {
		curChoseShop() {
			let arr1 = [],
				arr2 = [];
			if (this.ShopNameListState) {
				// all
				this.shopList.forEach((element) => {
					arr1.push(element.ID);
					arr2.push(element.NAME);
				});
			} else {
				this.shopList.forEach((element) => {
					let idx = this.ShopNameList.findIndex((v) => v == element.NAME);
					if (idx > -1) {
						arr1.push(element.ID);
					}
				});
				arr2 = [...this.ShopNameList];
			}

			this.ruleForm.ShopIdList = arr1.length > 0 ? arr1.join() : "";
			this.ruleForm.ShopNameList = arr2.length > 0 ? arr2.join() : "";
		},
		saveAddSpecials() {
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					this.curChoseShop();
					if (!this.ruleForm.ShopIdList || !this.ruleForm.ShopNameList) {
						this.$message.warning("请选择参与店铺 !");
						return;
					}
					let arr = this.ruleForm.GoodsList,
						newArr = [];
					if (arr.length == 0) {
						this.$message.warning("请选择商品!");
						return;
					}
					for (var i in arr) {
						arr[i].IsCancel == true ? 1 : 0;
						newArr.push(arr[i]);
					}
					newArr = newArr.concat(this.DelArr);
					let sendData = {
						Name: this.ruleForm.Name,
						BeginDate: this.ruleForm.dateBE[0],
						EndDate: this.ruleForm.dateBE[1],
						IsStart: this.ruleForm.IsStart,
						IsVipDiscount: this.ruleForm.IsVipDiscount == false ? 0 : 1,
						Remark: "",
						GoodsList: JSON.stringify(newArr),
						ShopIdList: this.ruleForm.ShopIdList,
						ShopNameList: this.ruleForm.ShopNameList,
						BillId: this.ruleForm.BillId
					};
					this.$store.dispatch("saveSpecials", sendData).then(() => {
						this.showNewForm = false;
					});
				}
			});
		},
		delCurListItem(row) {
			this.$confirm("确认删除该活动", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
				.then(() => {
					this.$store.dispatch("delSpecials", { BillId: row.BILLID });
				})
				.catch(() => {});
		},
		delCurRow(idx, row) {
			row.IsCancel = 1;
			this.DelArr.push(row);
			this.ruleForm.GoodsList.splice(idx, 1);
		},
		changePr(row) {
			row.DisPrice = Math.round(row.Discount * row.GoodsPrice * 100) / 100;
		},
		changeDP(row) {
			row.Discount = Math.round((row.DisPrice / row.GoodsPrice) * 100) / 100;
		},
		handlerclickadd(data) {
			this.ruleForm.GoodsList = [];
			for (let i = 0; i < data.length; i++) {
				this.ruleForm.GoodsList.push({
					Id: "",
					GoodsId: data[i].ID,
					GoodsName: data[i].NAME,
					Discount: 1,
					GoodsPrice: data[i].PRICE,
					DisPrice: data[i].PRICE,
					IsCancel: 0
				});
			}
			this.showAddserversgoods = false;
		},
		curRadioStatus() {
			let IsValid = "";
			if (this.radioStatus == 0) {
				IsValid = -1;
			} else if (this.radioStatus == 1) {
				IsValid = 2;
			} else if (this.radioStatus == 2) {
				IsValid = 1;
			} else {
				IsValid = 0;
			}
			this.$store
				.dispatch("getSpecialsList", { PN: 1, Filter: this.Filter, IsValid: IsValid })
				.then(() => {
					this.loading = true;
				});
		},
		viewCurItem(item) {
			this.$store.dispatch("getSpecialsItem", { BillId: item.BILLID }).then(() => {
				this.showNewForm = true;
			});
		},
		handleNew() {
			this.showNewForm = true;
			this.ruleForm = {
				Name: "",
				dateBE: [],
				IsVipDiscount: false,
				GoodsList: [],
				ShopNameList: "",
				ShopIdList: "",
				BillId: "",
				IsStart: 1
			};
		},
		selectShopState(v) {
			if (!v) {
				this.ShopNameList = [];
			}
		}
	},
	mounted() {
		if (this.shopList.length == 0) {
			this.$store.dispatch("getShopList", {});
		}
		this.$store.dispatch("getSpecialsList", { PN: 1, Filter: "", IsValid: -1 }).then(() => {
			this.loading = true;
		});
	},
	components: {
		selGoodsPage: () => import("@/components/goods/addserversgoods.vue"),
		headerPage: () => import("@/components/header/headBC")
	}
};
</script>

