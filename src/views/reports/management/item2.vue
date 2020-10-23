<template>
	<div>
		<!-- 收支结余 -->
		<div>
			<el-table
				border
				:data="tableList"
				v-loading="loading"
				:height="tHeight"
				header-row-class-name="bg-F1F2F3"
			>
				<el-table-column
					v-for="(item, i) in tableColumn"
					:key="i"
					:prop="item.prop"
					:label="item.label"
				></el-table-column>
				<!-- <el-table-column label="操作" align="right">
					<template slot-scope="scope">
						<el-button-group>
							<el-button
								size="small"
								type="text"
								@click="handleDel(scope.$index, scope.row)"
								icon="el-icon-delete"
							>
								删除
							</el-button>
						</el-button-group>
						<div class="hide">{{ scope.row }}</div>
					</template>
				</el-table-column> -->
			</el-table>
		</div>
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
						BeginDate: "",
						EndDate: "",
						PN: 1
					}
				};
			}
		}
	},
	data() {
		return {
			loading: false,
			formData: { ShopId: "", BeginDate: "", EndDate: "", PN: 1 },
			methodName: "",
			tableList: [],
			tableColumn: [],
			pagination: {
				TotalNumber: 0,
				PageNumber: 0,
				PageSize: 20,
				PN: 0
			},
			tHeight: 450
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
					console.log(111, this.tableList);
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
			indexQuery.balance(this, this.methodName, this.formData);
			this.loading = true;
		},
		handlePageChange: function (currentPage) {
			if (this.formData.PN == currentPage || this.loading) {
				return;
			}
			this.formData.PN = parseInt(currentPage);
			this.getNewData();
		},
		defaultData() {
			this.methodName = this.typeData.methodName;

			// 收支结余
			if (!this.methodName) {
				this.$message.error("参数有误");
				return;
			}
			this.formData = Object.assign({}, this.typeData.data);
			this.tableColumn = columnData.balance[this.methodName];
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
