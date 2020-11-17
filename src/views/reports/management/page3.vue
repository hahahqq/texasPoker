<template>
	<!-- 收银对账 -->
	<section v-loading="loading">
		<div class="bg-white paddingTB-md m-bottom-sm" style="min-height: 73px">
			<div class="marginLR-md">
				<filtePage
					:isAll="true"
					:isExport="true"
					@getNewData="getNewData_fun"
					@exportState="exportState_fun"
				></filtePage>
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
					ref="contentTable"
					:height="tableHeight"
					:summary-method="getSummaries"
					show-summary
				>
					<!-- <el-table-column prop="" label="" width="180"></el-table-column>
					<el-table-column prop="" label="现金" align="right"></el-table-column>
					<el-table-column prop="" label="刷卡" align="right"></el-table-column>
					<el-table-column prop="" label="微信" align="right"></el-table-column>
					<el-table-column prop="" label="支付宝" align="right"></el-table-column>
					<el-table-column prop="" label="扫码支付" align="right"></el-table-column>
					<el-table-column prop="" label="储值积分" align="right"></el-table-column>
					<el-table-column prop="" label="竞技积分" align="right"></el-table-column>
					<el-table-column prop="" label="欠款" align="right"></el-table-column>
					<el-table-column prop="" label="总计" align="right"></el-table-column> -->

					<el-table-column
						v-for="(item, i) in tableHead"
						:key="i"
						:prop="item.prop"
						:label="item.label"
						:width="i > 0 ? '' : '180'"
						:align="i > 0 ? 'right' : 'left'"
					></el-table-column>
					<el-table-column label="操作" align="center" width="70px">
						<template slot-scope="props">
							<el-button
								type="text"
								@click="getNewList(props.row)"
								class="no-padding"
							>
								详情
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
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
			tableList: [],
			exportData: { show: false },
			tableHeight: 300,
			tableHead: []
		};
	},
	computed: {
		...mapGetters({}),
		dataState() {
			return this.$store.getters.cReportDataState.cashier;
		}
	},
	watch: {
		dataState(data) {
			if (this.loading) {
				if (data.success) {
					console.log(11, data.data);
					this.dealTableData(data.data.UserMoneyList);
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
			indexQuery.cashier(this, "cashier", this.formData);
			this.loading = true;
		},
		dealTableData(arr) {
			if (!arr || arr.length == 0) return;
			let newArr = [],
				tArr = [];
			arr.forEach((element) => {
				if (element.USERID && element.USERNAME) {
					let item = { uid: element.USERID, uName: element.USERNAME };
					let marr = element.MONEYS.split(","),
						totolPrice = 0;
					for (let i = 0; i < marr.length; i++) {
						item["value" + i] = parseFloat(marr[i]);
						totolPrice += parseFloat(marr[i]);
					}
					item.totolPrice = totolPrice;
					newArr.push(item);
				} else {
					tArr.push({
						prop: "uName",
						label: ""
					});
					let marr = element.MONEYS.split(",");
					for (let i = 0; i < marr.length; i++) {
						let item = {
							prop: "value" + i,
							label: marr[i]
						};
						tArr.push(item);
					}
					tArr.push({
						prop: "totolPrice",
						label: "总计"
					});
				}
			});
			this.tableHead = tArr;
			this.tableList = newArr;
		},
		getSummaries(param) {
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = "总价";
					return;
				}
				const values = data.map((item) => Number(item[column.property]));
				if (!values.every((value) => isNaN(value))) {
					sums[index] = values.reduce((prev, curr) => {
						const value = Number(curr);
						if (!isNaN(value)) {
							return prev + curr;
						} else {
							return prev;
						}
					}, 0);
					sums[index] += ""; // 元
				} else {
					sums[index] = ""; // N/A
				}
			});

			return sums;
		},
		getNewList(item) {
			console.log(item);
			this.$message({
				type: "info",
				message: "开发中..."
			});
		},
		setHeight() {
			if (this.$refs.contentTable) {
				let top = this.$refs.contentTable.$el.getBoundingClientRect().top;
				let marginSpace = 10 * 3,
					pager = 42;
				this.$nextTick(() => {
					this.tableHeight = window.innerHeight - top - marginSpace;
				});
			}
		},
		defaultData() {}
	},

	mounted() {
		let homeInfo = getHomeData();
		this.formData = Object.assign(
			this.formData,
			{
				ShopId: homeInfo.shop.ID,
				BeginDate: this.getTimeStamp(),
				EndDate: new Date().getTime()
			},
			{ PN: 1 }
		);
		this.getNewData();
		this.setHeight();
	},
	components: {
		filtePage: () => import("@/views/reports/filtePage.vue"),
		exportPage: () => import("@/components/export/common.vue")
	}
};
</script>
<style scoped>
</style>
