import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes } from '@/router'
import router from '@/router';

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        routes: [],
        buttons: [],
        roles: [],
        // 存储异步路由
        asyncRoutes: [],
        // 存储合并后最终需要的路由
        routerAll: []
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_USERINFO: (state, userInfo) => {
        // 存储用户名称
        state.name = userInfo.name;
        // 存储用户头像
        state.avatar = userInfo.avatar;
        // 菜单权限标记
        state.routes = userInfo.routes;
        // 按钮权限标记
        state.buttons = userInfo.buttons;
        // 角色
        state.roles = userInfo.roles
    },
    // 合并：将异步路由、常量路由、任意路由合并就是需要展示的路由
    ASYNCROUTE: (state, asyncRoutes) => {
        // 存储异步路由
        state.asyncRoutes = asyncRoutes
            // 合并路由
        state.routerAll = constantRoutes.concat(state.asyncRoutes, anyRoutes)
            //给路由器添加新的路由
        router.addRoutes(state.routerAll)
    }
}

const actions = {
    // user login
    async login({ commit }, userInfo) {
        const { username, password } = userInfo
        const result = await login({ username: username.trim(), password: password })
        if (result.code === 20000) {
            commit('SET_TOKEN', result.data.token)
            setToken(result.data.token)
            return 'ok'
        } else {
            return Promise.reject(new Error())
        }
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response
                if (!data) {
                    return reject('Verification failed, please Login again.')
                }
                commit('SET_USERINFO', data)
                commit('ASYNCROUTE', computedAsyncRoutes(asyncRoutes, data.routes))
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

//定义一个函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
    //过滤出当前用户【超级管理|普通员工】需要展示的异步路由
    return asyncRoutes.filter(item => {
        //数组当中没有这个元素返回索引值-1，如果有这个元素返回的索引值一定不是-1 
        if (routes.indexOf(item.name) != -1) {
            //递归:别忘记还有2、3、4、5、6级路由
            if (item.children && item.children.length) {
                item.children = computedAsyncRoutes(item.children, routes);
            }
            return true;
        }
    })
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}