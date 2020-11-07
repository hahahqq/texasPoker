<template>
	<div class="headerDiv row-flex" :style="{ 'max-width': width + 'px' }">
		<div class="header-left-area full-width">
			<div v-if="!noParent" class="center-title">{{ $route.meta.title }}</div>

			<div v-if="pageList.length > 0">
				<el-breadcrumb separator="/" class="center-cont">
					<template v-for="(item, i) in pageList">
						<template v-if="item.value">
							<el-breadcrumb-item :key="i" :to="{ path: item.value }">
								<span class="font-600" style="color: #137deb">
									{{ item.label }}
								</span>
							</el-breadcrumb-item>
						</template>
						<template v-else>
							<el-breadcrumb-item :key="i">
								<span>{{ item.label }}</span>
							</el-breadcrumb-item>
						</template>
					</template>
				</el-breadcrumb>
			</div>
			<div v-else class="p-left-md">
				<span>{{ $route.name }}</span>
			</div>
		</div>
		<div class="header-right-area" style="min-width: 100px">
			<header-right-area></header-right-area>
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import headerRightArea from "@/components/header/right.vue";
export default {
	props: {
		// 子类列表，进行选择显示
		pageList: {
			type: Array,
			default: new Array()
		},
		// 父类标题，是否显示
		noParent: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			width: window.innerWidth - 90,
			current: 0
		};
	},
	watch: {
		$route(to, from) {
			let idx = this.$route.query.idx ? parseInt(this.$route.query.idx) : 0;
			this.current = idx;
		}
	},
	methods: {
		handleBotton(idx) {
			let mCode = this.pageList[idx].moduleCode;
			if (mCode && !this.isPurViewFun(mCode)) {
				this.$notify({
					title: "警告",
					message: "没有权限",
					type: "warning"
				});
				return;
			}
			this.current = idx;
			this.$emit("showPageIdx", idx);
		}
	},

	components: {
		headerRightArea
	}
};
</script>

<style scoped>
.headerDiv {
	border-bottom: 1px solid #ebedf0;
	background-color: #fff;
	line-height: 50px;
	height: 50px;
	font-size: 14px;
}
.header-left-area {
	display: flex;
	align-items: center;
	height: 50px;
}
.center-title {
	width: 100px;
	text-align: center;
	height: 50px;
	line-height: 50px;
	font-weight: bold;
	border-right: 1px solid #ebedf0;
}
.center-cont {
	min-width: 300px;
	text-align: left;
	padding-left: 20px;
	height: 50px;
	line-height: 50px;
}

.header-right-area {
	text-align: right;
	padding-right: 20px;
}
</style>
