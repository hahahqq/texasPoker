<template>
	<!--列表-->
	<div class="addserversgoods">
		<el-table
			border
			:data="serversdataList"
			header-row-class-name="bg-theme2 text-white"
			v-loading="loading"
			style="width: 100%"
			@selection-change="changeFun"
			:height="height"
		>
			<el-table-column type="selection" width="60" fixed="left"></el-table-column>
			<el-table-column prop="NAME" label="商品名称" align="center"></el-table-column>
			<el-table-column prop="CODE" label="商品编码" align="center"></el-table-column>
			<el-table-column prop="STOCKQTY" label="库存" align="center"></el-table-column>
			<el-table-column prop="PRICE" label="价格" align="center"></el-table-column>
			<el-table-column
				prop="TYPENAME"
				label="商品类型"
				align="center"
				width="140"
			></el-table-column>
		</el-table>
		<div v-show="serversdataList.length > 0" class="m-top-sm clearfix elpagination">
			<el-pagination
				@size-change="handlePageChange"
				@current-change="handlePageChange"
				:current-page.sync="pagination.PN"
				:page-size="pagination.PageSize"
				layout="total,prev, pager, next, jumper"
				:total="pagination.TotalNumber"
				class="text-right"
			></el-pagination>
			<!-- <div class="text-center clearfix">
				<span class="inline-block">
					共{{ pagination.TotalNumber }}条，每页{{ pagination.PageSize }}条
				</span>
			</div> -->
		</div>
		<el-form label-width="80px">
			<el-form-item>
				<el-button type="primary" @click="saveaddSelectgoods">确 定</el-button>
				<el-button @click="closeModal">取 消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
	data() {
		return {
			loading: false,
			serversdataList: [],
			multipleSelection: [],
			pagination: {
				TotalNumber: 0,
				PageNumber: 0,
				PageSize: 20,
				PN: 0
			},
			pageData: {
				PN: 1,
				Filter: "",
				Status: -1,
				Mode: -1, // -1=all  0=商品 1=服务
				TypeID: "", //商品类别ID
				DescType: 0
			},
			height: window.innerHeight / 2 + 50
		};
	},
	computed: {
		...mapGetters({
			dataList: "goodsList",
			dataListStates: "goodsListState"
		})
	},
	watch: {
		dataListStates(data) {
			console.log(data);
			this.loading = false;
			this.isFilter = false;
			this.serversdataList = [...this.dataList];
			if (data.success) {
				this.pagination = {
					TotalNumber: data.paying.TotalNumber,
					PageNumber: data.paying.PageNumber,
					PageSize: data.paying.PageSize,
					PN: data.paying.PN
				};
			}
		}
	},
	methods: {
		closeModal(type) {
			this.$emit("closeModal");
		},
		changeFun(val) {
			this.multipleSelection = val;
		},
		saveaddSelectgoods(val) {
			this.$emit("handlerClickadd", this.multipleSelection);
		},
		getNewData() {
			this.$store.dispatch("getGoodsList", this.pageData).then(() => {
				this.loading = true;
			});
		},
		handlePageChange: function (currentPage) {
			if (this.pageData.PN == currentPage || this.loading) {
				return;
			}
			this.pageData.PN = parseInt(currentPage);
			this.getNewData();
		}
	},
	created() {
		this.getNewData();
	}
};
</script>
