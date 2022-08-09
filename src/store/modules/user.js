import { loginByName, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken, getNavs, setNavs, removeNavs, getAvatar, setAvatar, removeAvatar  } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: getAvatar(),
    roles: [],
    navs: getNavs()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_NAVS: (state, navs) => {
      state.navs = navs
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByName(username, userInfo.password).then(response => {
          const data = response.data
          commit('SET_TOKEN', 'Bearer ' + data.access_token)
          setToken('Bearer ' + data.access_token)
          commit('SET_NAVS', data.navs)
          setNavs(data.navs)
          commit('SET_AVATAR', data.lastlogin_at)
          setAvatar(data.lastlogin_at)
          resolve('success')
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          /* if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          } */
          commit('SET_NAME', data.name)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          removeNavs()
          removeAvatar()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        removeNavs()
        removeAvatar()
        resolve()
      })
    }
  }
}

export default user
