export default {
    namespaced: true,
    actions: {
        add ({state, commit}, data){
            data.id = state['userData'].length + 1
            commit('ADD', data)
        },
        update({commit}, {index, data}) {
            commit('UPDATE', {index, data})
        },
        remove({commit, state}, id){
            const index = state.userData.findIndex(user => user.id === id)

            commit('REMOVE', index)
        }
    },
    mutations: {
        UPDATE (state, {index, data}){
            state.userData[index] = data
        },

        ADD (state, data) {
            state.userData.push(data)
        },

        REMOVE (state, id) {
            state.userData.splice(id, 1)
        }
    },
    state: {
        userData: [
            {
                "id": 1,
                "name": "Виктор",
                "gender": "male",
                "sub": "2020-03-04T13:40Z"
            },
            {
                "id": 2,
                "name": "Павел",
                "gender": "male",
                "sub": "2020-03-04T13:40Z"
            },
            {
                "id": 3,
                "name": "Евгений",
                "gender": "femele",
                "sub": "2020-03-04T13:40Z"
            }
        ]
    },
    getters: {
        getById: state => id => {
            return state.userData.find(user => user.id === id)
        }
    }
}