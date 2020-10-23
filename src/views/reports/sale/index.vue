<template>
	<div>
		<!-- 销售分析 -->
		<component :is="componentName" v-if="isShow"></component>
	</div>
</template>
<script>
import page1 from "./list.vue";
import page2 from "@/views/reports/goods/list.vue";
import page3 from "@/views/reports/shop/index.vue";

export default {
	props: {
		activePage: {
			type: Object,
			default: {
				show: false,
				index: 1
			}
		}
	},
	data() {
		return {
			isShow: false,
			componentName: "page1"
		};
	},
	watch: {
		activePage(data) {
			if (data.show) {
				this.componentName = "page" + data.index;
				this.isShow = true;
			}
		}
	},

	components: {
		page1,
		page2,
		page3
	}
};
</script>
