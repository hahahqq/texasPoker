<template>
	<div v-loading="loading">
		<!-- 销售分析 -->
		<div>
			<div class="m-bottom-sm">
				<div
					v-for="(item, i) in pageList"
					:key="i"
					class="inline-block border padding-sm marginTB-sm m-right-sm"
					style="min-width: 150px"
				>
					<p>{{ item.label }}</p>
					<div class="font-16 font-600">{{ item.value }}</div>
				</div>
			</div>

			<div class="m-bottom-sm">
				<el-button-group>
					<el-button
						type="primary"
						size="small"
						:plain="oType"
						@click="chooseStateFun(1)"
					>
						按金额
					</el-button>
					<el-button
						type="primary"
						size="small"
						:plain="!oType"
						@click="chooseStateFun(2)"
					>
						按数量
					</el-button>
				</el-button-group>
			</div>
		</div>
		<div>
			<el-table border :data="tableList" :height="tHeight" header-row-class-name="bg-F1F2F3">
				<el-table-column
					v-for="(item, i) in tableColumn"
					:key="i"
					:prop="item.prop"
					:label="item.label"
				></el-table-column>
			</el-table>

			<!-- 分页 -->
			<div v-if="tableList.length > 0" class="m-top-sm clearfix">
				<el-pagination
					@size-change="handlePageChange"
					@current-change="handlePageChange"
					:current-page.sync="pagination.PN"
					:page-size="pagination.PageSize"
					layout="prev, pager, next, jumper"
					:total="pagination.TotalNumber"
					class="text-center"
				></el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { indexQuery } from "@/store/modules2/report/indexFun.js";
import { columnData } from "@/store/modules2/report/tableColumn.js";
export default {
	props: {
		typeData: {
			type: Object,
			default: function () {
				return {
					show: false,
					methodName: "",
					data: {
						ShopId: "",
						DateStr: "",
						PN: 1
					}
				};
			}
		}
	},
	data() {
		return {
			loading: false,
			formData: { ShopId: "", DateStr: "", PN: 1, OrderType: 0 },
			tableList: [],
			tableColumn: [],
			pagination: {
				TotalNumber: 0,
				PageNumber: 0,
				PageSize: 20,
				PN: 0
			},
			tHeight: 450,
			pageList: [
				{ label: "销售总额", value: 0 },
				{ label: "毛利润", value: 0 },
				{ label: "销售笔数", value: 0 },
				{ label: "销售数量", value: 0 }
			],
			oType: false
		};
	},
	computed: {
		...mapGetters({
			dataState: "actionsDataState",
			dataListState: "commonListState"
		})
	},
	watch: {
		typeData(data) {
			if (data.show) {
				this.defaultData();
			}
		},
		dataListState(data) {
			if (this.loading) {
				if (data.success) {
					this.pagination = Object.assign({}, data.paying);
					this.tableList = [...data.List];

					this.pageList[0].value = data.data.SumInfo.BILLPRICE;
					this.pageList[1].value = data.data.SumInfo.GAINMONEY;
					this.pageList[2].value = data.data.SumInfo.BILLCOUNT;
					this.pageList[3].value = data.data.SumInfo.QTY;
				} else {
					this.$message.error(data.message);
				}
			}
			this.loading = false;
		}
	},
	methods: {
		closeModal(v) {
			this.$emit("closeModal", v);
		},
		getNewData() {
			this.loading = true;
			indexQuery.saleItem(this, "saleItem", this.formData);
		},
		handlePageChange: function (currentPage) {
			if (this.formData.PN == currentPage || this.loading) {
				return;
			}
			this.formData.PN = parseInt(currentPage);
			this.getNewData();
		},
		chooseStateFun(type) {
			this.oType = type == 1 ? false : true;
			this.formData.OrderType = type == 1 ? 0 : 1;
			this.formData.PN = 1;
			this.getNewData();
		},
		defaultData() {
			this.oType = false;
			this.formData = Object.assign({ OrderType: 0 }, this.typeData.data);
			this.tableColumn = columnData.sale.item;
			this.getNewData();
		}
	},
	mounted() {
		if (this.typeData.show) {
			this.defaultData();
		}
	}
};
</script>
