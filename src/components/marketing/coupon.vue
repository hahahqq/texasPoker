<template>
	<div>
		<!-- 优惠券 -->
		<el-table
			size="small"
			v-if="dataList"
			:data="dataList"
			v-loading="loading"
			:height="tableHeight"
			header-row-class-name="bg-theme2 text-white"
			style="width: 100%"
		>
			<el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
			<el-table-column prop="BILLID" label="单号" width="180"></el-table-column>
			<el-table-column prop="MONEY" label="价格"></el-table-column>
			<el-table-column prop="QTY" label="数量"></el-table-column>
			<el-table-column prop="DATENAME" label="有效时间" width="260"></el-table-column>
			<el-table-column prop="ISSTOP" label="状态" :formatter="formatStatus"></el-table-column>
			<el-table-column label="操作" width="170" fixed="right" align="right">
				<template slot-scope="scope">
					<!-- <el-button size="small" @click="handleStop(scope.$index, scope.row)">停止</el-button> -->
					<el-button
						type="text"
						size="small"
						v-if="scope.row.ISSTOP == false"
						@click="handleStop(scope.$index, scope.row)"
					>
						停止
					</el-button>
					<div class="hide">{{ scope.row }}</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
	data() {
		return {
			loading: false,
			loadingShop: false,
			loadingItem: false,
			showItem: false,
			tableHeight: document.body.clientHeight - 280
		};
	},
	computed: {
		...mapGetters({
			dataListState: "marketingListState",
			dataList: "marketingList",
			dataState: "marketingState",
			dataItem: "marketingItem"
		})
	},
	components: {
		headerPage: () => import("@/components/header")
	},
	methods: {
		formatStatus: function (row, column) {
			return row.ISSTOP ? "未启用" : "启用";
		},
		formatTime: function (row, column) {
			return row.BEGINDATE ? this.filterTime(new Date(row.BEGINDATE)) : "";
		},

		handleStop(idx, row) {
			this.$emit("handleStop", row);
		},
		handleEdit(idx, row) {
			this.$emit("handleEdit", row);
		}
	}
};
</script>

