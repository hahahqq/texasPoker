<template>
	<!-- 收支结余 -->
	<section v-loading="loading">
		<div class="bg-white paddingTB-md m-bottom-sm">
			<div class="marginLR-md">
				<filtePage
					:isAll="true"
					:isExport="true"
					@getNewData="getNewData_fun"
					@exportState="exportState_fun"
				></filtePage>
			</div>
		</div>
		<div class="bg-white m-bottom-sm">
			<div class="marginLR-md">
				<!-- page -->
				<div class="row-flex paddingTB-sm flex-items-center">
					<div class style="min-width: 510px">
						<div
							v-for="(item, i) in pageList"
							:key="i"
							v-show="i < 6"
							class="inline-block m-right-md marginTB-sm padding-sm border"
							style="width: 150px"
						>
							<span>{{ item.label }}</span>
							<el-button
								type="text"
								@click="getNewList(item)"
								class="pull-right no-padding"
							>
								详情
							</el-button>
							<div class="text-left p-top-sm">
								<span class="font-600">{{ item.value }}</span>
							</div>
						</div>
					</div>
					<div class="full-width relative">
						<div
							class="inline-block border-top border-right border-bottom paddingTB-lg paddingLR-md"
						>
							<span class="block paddingTB-sm"></span>
						</div>
						<div
							class="inline-block padding-sm border translateY-center marginLR-md"
							style="width: 150px"
						>
							<div class="p-bottom-sm">{{ pageList[6].label }}</div>
							<div>
								<span class="font-600 font-16">{{ pageList[6].value }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="bg-white paddingTB-md">
			<div class="marginLR-md">
				<!-- table-->
				<el-table
					border
					:data="tableList"
					header-row-class-name="bg-F1F2F3"
					class="full-width"
				>
					<el-table-column
						prop="PAYTYPENAME"
						label="支付方式"
						width="180"
					></el-table-column>
					<el-table-column label="金额">
						<template slot-scope="props">
							<span>&yen;{{ props.row.MONEY }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="FCOUNT" label="笔数"></el-table-column>
					<el-table-column label="占比">
						<template slot-scope="props">
							<span>
								{{
									props.row.FRATE == 1
										? "100%"
										: parseInt(props.row.FRATE * 100) + "%"
								}}
							</span>
							<el-progress
								:text-inside="true"
								:stroke-width="18"
								:percentage="
									props.row.FRATE > 0
										? props.row.FRATE < 1
											? props.row.FRATE * 100
											: 100
										: 0
								"
								:color="getColor(props.row.FRATE * 100)"
							></el-progress>
						</template>
					</el-table-column>
					<el-table-column label="更多" width="80">
						<template slot-scope="props">
							<el-button
								type="text"
								@click="getNewList(props.row, 7)"
								class="no-padding"
							>
								详情
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<!-- 详情 -->
		<el-dialog :title="itemData.title + '详情'" :visible.sync="itemData.show" width="980px">
			<itemPage @closeModal="closeModalFun" :typeData="itemData"></itemPage>
		</el-dialog>
		<!-- 数据导出 -->
		<el-dialog
			append-to-body
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:show-close="false"
			title="数据导出"
			:visible.sync="exportData.show"
			width="400px"
		>
			<exportPage
				:dataType="exportData"
				:isPage="true"
				@closeModal="exportData.show = false"
			></exportPage>
		</el-dialog>
	</section>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData } from "@/api/index";
import { indexQuery } from "@/store/modules2/report/indexFun.js";
export default {
	data() {
		return {
			loading: false,
			formData: { ShopId: "", BeginDate: "", EndDate: "", PN: 1 },
			pageList: [
				{
					label: "商品销售",
					value: 0,
					methodName: "balanceA"
				},
				{ label: "充值", value: 0, methodName: "balanceC" },
				{ label: "还款", value: 0, methodName: "balanceE" },
				{
					label: "会员消费",
					value: 0,
					methodName: "balanceB"
				},
				{ label: "支出", value: 0, methodName: "balanceD" },
				{ label: "欠款", value: 0, methodName: "balanceF" },
				{ label: "收支结余", value: 0 }
			],
			dataData: {},
			tableList: [],
			itemData: {
				title: "",
				show: false,
				data: {}
			},
			exportData: { show: false }
		};
	},
	computed: {
		...mapGetters({
			dataState: "actionsDataState",
			dataListState: "commonListState"
		})
	},
	watch: {
		dataState(data) {
			if (this.loading) {
				if (data.success) {
					console.log(11, data.data);
					this.pageList[0].value = data.data.SaleMoney;
					this.pageList[1].value = data.data.AddMoney;
					this.pageList[2].value = data.data.PayOweMoney;
					this.pageList[3].value = data.data.SaleVipMoney;
					this.pageList[4].value = data.data.ExpMoney;
					this.pageList[5].value = data.data.OweMoney;
					this.pageList[6].value = data.data.GainMoney;
					this.tableList = data.data.PayList;
				} else {
					this.$message.error(data.message);
				}
			}
			this.loading = false;
		}
	},
	methods: {
		exportState_fun(data) {
			this.exportData = {
				show: true,
				data: {},
				index: 1
			};
		},
		getNewData_fun(data) {
			this.formData = Object.assign({}, data);
			this.getNewData();
		},
		getNewData() {
			indexQuery.balance(this, "balance", this.formData);
			this.loading = true;
		},
		getNewList(item, index) {
			let methodName = "",
				title = "";
			if (index == 7) {
				methodName = "balanceG";
				title = "支付方式";
			} else {
				methodName = item.methodName;
				title = item.label;
			}
			this.itemData = {
				title: title,
				show: true,
				methodName: methodName,
				data: Object.assign(
					{
						PN: 1
					},
					this.formData
				)
			};
		},
		closeModalFun(v) {
			if (v) {
				this.getNewData();
			}
			this.itemData.show = false;
		},
		getColor: function (v) {
			if (v > 75) {
				return "#67c23a";
			} else if (v > 50) {
				return "rgba(142, 113, 199, 0.7)";
			} else if (v > 25) {
				return "#409eff";
			} else {
				return "#f56c6c";
			}
		},
		defaultData() {}
	},

	mounted() {
		let homeInfo = getHomeData();
		this.formData = {
			ShopId: homeInfo.shop.ID,
			BeginDate: this.getTimeStamp(),
			EndDate: new Date().getTime()
		};
		this.getNewData();
	},
	components: {
		echartLine: () => import("@/components/other/echartLine.vue"),
		filtePage: () => import("@/views/reports/filtePage.vue"),
		itemPage: () => import("./item2.vue"),
		exportPage: () => import("@/components/export/common.vue")
	}
};
</script>
<style scoped>
</style>
