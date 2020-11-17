<template>
	<div>
		<!-- 微信优惠商品 -->
		<!--列表-->
		<el-table
			:data="dataList"
			v-loading="loading"
			header-row-class-name="bg-theme2 text-white"
			height="500"
			style="width: 100%"
		>
			<el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
			<el-table-column prop="GOODSNAME" label="名称" width="160"></el-table-column>
			<el-table-column prop="DISPRICE" label="优惠价"></el-table-column>
			<el-table-column prop="PRICE" label="价格"></el-table-column>
			<el-table-column prop="" label="有效时间" width="300">
				<template slot-scope="scope">
					<div>
						<span>{{ new Date(scope.row.BEGINDATE) | formatTime }}</span>
						<span>至</span>
						<span>{{ new Date(scope.row.ENDDATE) | formatTime }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="ISSTOP" label="状态" :formatter="formatStatus"></el-table-column>
			<el-table-column label="操作" width="170" fixed="right" align="right">
				<template slot-scope="scope">
					<el-button
						type="text"
						:disabled="scope.row.ISSTOP"
						size="small"
						@click="handleStop(scope.$index, scope.row)"
					>
						停止
					</el-button>
					<el-button
						type="text"
						size="small"
						@click="handleEdit(scope.$index, scope.row)"
					>
						编辑
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
			showItem: false
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

