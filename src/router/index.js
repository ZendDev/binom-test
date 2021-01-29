import VueRouter from 'vue-router'

import Users from '../pages/Users'

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/users',
            component: Users
        }
    ]
})