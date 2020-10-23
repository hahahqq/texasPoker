
import commonSend from '@/api/api'
import {
    GET_LIST,
    ACTIONS_STATE
} from '@/store/mutation-types';
let selected = {}

// init state
const state = {
    actionsDataState: {},
    commonListState: {
        paying: {
            "TotalNumber": 0,
            "PageNumber": 0,
            "PageSize": 20,
            "PN": 0,
        },
        List: []
    },

}

// getters
const getters = {
    actionsDataState: state => state.actionsDataState,
    commonListState: state => state.commonListState,
}


// actions
const actions = {
    getList({ commit }, { type, sendData }) {
        selected.type = type
        commonSend.commonSend('get', data => {
            commit(GET_LIST, { data })
        }, sendData)
    },
    actionsData({ commit }, { type, sendData }) {
        selected.type = type
        commonSend.commonSend('get', data => {
            commit(ACTIONS_STATE, { data })
        }, sendData)
    },
}

// mutations
const mutations = {
    [GET_LIST](state, { data }) {
        let pageData = Object.assign({}, state.commonListState.paying), arr = []
        if (data.success) {
            pageData = Object.assign(pageData, data.data.PageData)
            arr = [...pageData.DataArr];
        }
        state.commonListState = Object.assign({}, data, {
            'paying': pageData, 'List': arr, type: selected.type
        });
        selected = {}
    },
    [ACTIONS_STATE](state, { data }) {
        state.actionsDataState = Object.assign({}, data, selected)
        selected = {}
    },

}

export default {
    state,
    getters,
    actions,
    mutations
}

