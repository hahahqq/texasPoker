<template>
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
							<el-row>
								<el-col :span="12">
									<el-button size="small" @click="handleNew" type="primary">
										新增{{ buttonGroup[1].title }}
									</el-button>
								</el-col>
								<el-col :span="12" style="text-align: right">
									<span class="overall-font">状态&nbsp;&nbsp;</span>
									<el-select
										v-model="value"
										placeholder="请选择"
										size="small"
										@change="handleCommand"
									>
										<el-option
											v-for="item in options"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										></el-option>
									</el-select>
								</el-col>
							</el-row>
						</div>
					</div>
					<div class="content-table4">
						<div class="content-table-center">
							<!-- 列表 -->
							<component
								:is="componentName"
								:dataList="dataList"
								@handleStop="handleStop_fun"
								@handleEdit="handleEdit_fun"
							></component>
							<!-- 分页 -->
							<div
								v-show="dataList.length > 0"
								class="m-top-smts clearfix elpagination"
							>
								<el-pagination
									@size-change="handlePageChange"
									@current-change="handlePageChange"
									:current-page.sync="pagination.PN"
									:page-size="pagination.PageSize"
									:pager-count="5"
									layout="total, prev, pager, next, jumper"
									:total="pagination.TotalNumber"
									class="text-right"
								></el-pagination>
							</div>
						</div>
					</div>
					<!-- item -->
					<el-dialog
						:title="dealType == 'add' ? '新增' + title : '编辑' + title"
						:visible.sync="showItem"
						width="600px"
						style="max-width: 100%"
					>
						<component
							:is="componentName2"
							@closeModal="showItem = false"
							@resetList="
								showItem = false;
								getNewData(1);
							"
							:dealType="{ type: dealType, state: showItem }"
						></component>
					</el-dialog>
				</div>
			</el-container>
		</el-container>
	</el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_MARKETING from "@/mixins/marketing.js";
export default {
	mixins: [MIXINS_MARKETING.MARKETING_MENU],
	data() {
		return {
			componentName: "",
			componentName2: "",
			obj: "",
			title: "",
			dealType: "add",
			loading: false,
			loadingShop: false,
			loadingItem: false,
			showItem: false,
			pagination: {
				TotalNumber: 0,
				PageNumber: 0,
				PageSize: 20,
				PN: 0
			},
			pageData: {
				PN: 1,
				IsValid: "-1" // -1=全部，0=有效，1=失效。APP后台传入-1，微信公从号传入0,
			},
			options: [
				{
					value: "-1",
					label: "全部"
				},
				{
					value: "0",
					label: "有效"
				},
				{
					value: "1",
					label: "失效"
				}
			],
			value: "",
			buttonGroup: [{ label: "", value: "" }]
		};
	},
	computed: {
		...mapGetters({
			dataArr: "marketingListARR",
			dataListState: "marketingListState",
			dataList: "marketingList",
			dataState: "marketingState",
			dataItem: "marketingItem"
		})
	},
	watch: {
		dataListState(data) {
			this.loading = false;
			if (data.success) {
				this.pagination = {
					TotalNumber: data.paying.TotalNumber,
					PageNumber: data.paying.PageNumber,
					PageSize: data.paying.PageSize,
					PN: data.paying.PN
				};
			}
		},
		dataState(data) {
			if (data.success && this.loadingShop) {
				this.loadingShop = false;
				this.getNewData(1);
			}
			if (data.success && this.loadingItem) {
				this.loadingItem = false;
				this.showItem = true;
			}
		}
	},
	methods: {
		handlePageChange: function (currentPage) {
			if (this.pageData.PN == currentPage || this.loading) {
				return;
			}
			this.pageData.PN = parseInt(currentPage);
			this.loading = true;
			this.getNewData(0);
		},
		handleCommand(command) {
			this.pageData.IsValid = command;
			this.getNewData(1);
		},
		getNewData(type) {
			let data = {
				IsValid: this.pageData.IsValid,
				PN: type == 1 ? 1 : this.pageData.PN
			};
			this.$store.dispatch("getMarketingList", {
				obj: this.obj,
				data: data
			});
		},
		handleNew() {
			this.$store.dispatch("clearMarketingData", 2).then(() => {
				this.dealType = "add";
				this.showItem = true;
			});
		},
		handleStop_fun: function (data) {
			this.$confirm("停止该优惠, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
				.then(() => {
					this.$store
						.dispatch("stopMarketingAction", {
							obj: this.obj,
							data: data
						})
						.then(() => {
							this.loadingShop = true;
						});
				})
				.catch(() => {});
		},
		handleEdit_fun: function (data) {
			this.$store
				.dispatch("getMarketingItem", {
					obj: this.obj,
					data: data
				})
				.then(() => {
					this.dealType = "edit";
					this.loadingItem = true;
				});
		}
	},
	beforeCreate() {
		let obj = this.$route.params.type;
		let list = this.$store.state.marketing.marketingListARR[obj].List;
		if (list.length == 0) {
			this.$store.dispatch("getMarketingList", {
				obj: obj,
				data: {
					IsValid: "-1"
				}
			});
		} else {
			this.$store.dispatch("setMarketingList", obj);
		}
	},
	created() {
		let obj = this.$route.params.type;
		this.obj = obj;
		this.componentName = obj + "Page";
		this.componentName2 = obj + "Item";
		this.buttonGroup = [
			{ label: "拓客工具", value: "/marketing/bespeakList" },
			{ label: "", value: "" }
		];
		switch (obj) {
			case "goods":
				this.buttonGroup[1].label = "微信优惠商品";
				this.buttonGroup[1].title = "优惠商品";
				break;
			case "promotion":
				this.buttonGroup[1].label = "微信活动海报";
				this.buttonGroup[1].title = "活动海报";
				break;
			default:
				// coupon
				this.buttonGroup[1].label = "优惠券";
				this.buttonGroup[1].title = "优惠券";
		}
		// this.title = this.dataArr[this.obj].title;
		this.title = this.buttonGroup[1].title;

		let theData = this.$store.state.marketing.marketingListARR[obj];
		this.pagination = theData.paying;
		console.log(obj, theData);
	},
	components: {
		couponPage: () => import("@/components/marketing/coupon"),
		couponItem: () => import("@/components/marketing/couponItem"),
		goodsPage: () => import("@/components/marketing/goods"),
		goodsItem: () => import("@/components/marketing/goodsItem"),
		promotionPage: () => import("@/components/marketing/promotion"),
		promotionItem: () => import("@/components/marketing/promotionItem"),
		headerPage: () => import("@/components/header/headBC")
	}
};
</script>
