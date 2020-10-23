
import { mapState, mapGetters } from "vuex";
export default {
    CHOOSE_MEMBER: {
        data() {
            return {
                VipId: '',
            }
        },
        computed: {
            ...mapGetters({
                selmember: 'selmember',
            })
        },
        methods: {

        },
        components: {
            dropdown: () => import("@/components/ssmember/dropdown")
        },
    }
}