<template>
	<el-row class="headerDiv" :style="{ 'max-width': width + 'px' }">
		<el-col :span="16" class="header-left-area">
			<div v-if="!noParent" class="center-title">{{ $route.meta.title }}</div>

			<div v-if="pageList.length > 0">
				<div class="center-cont">
					<ul class="center-cont-ul">
						<li
							v-for="(item, i) in pageList"
							:key="i"
							:class="{ 'selected font-600 text-theme': i == current }"
						>
							<a class="block item" @click="handleBotton(i)">
								<span :class="'page' + (i + 1)">{{ item.label }}</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div v-else class="p-left-md">
				<span>{{ $route.name }}</span>
			</div>
		</el-col>
		<el-col :span="8" class="header-right-area">
			<header-right-area></header-right-area>
		</el-col>
	</el-row>
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

.center-cont-ul li {
	display: inline-block;
	min-width: 58px;
	text-align: center;
	margin-right: 25px;
	position: relative;
	cursor: pointer;
}

.center-cont-ul li.selected::after {
	content: "";
	position: absolute;
	left: 0;
	bottom: 6px;
	width: 100%;
	height: 2px;
	background-color: currentColor;
}
</style>
