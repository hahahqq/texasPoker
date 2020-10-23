<template>
	<div>
		<!-- 经营报表 -->
		<component :is="componentName" v-if="isShow"></component>
	</div>
</template>
<script>
import page1 from "./page1.vue";
import page2 from "./page2.vue";
import page3 from "./page3.vue";

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
