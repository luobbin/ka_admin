import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const NavsKey = 'Admin-Navs'
const AvatarKey = 'Admin-Avatar'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getNavs() {
  return Cookies.get(NavsKey)
}

export function setNavs(navs) {
  return Cookies.set(NavsKey, navs)
}

export function removeNavs() {
  return Cookies.remove(NavsKey)
}

export function getAvatar() {
  return Cookies.get(AvatarKey)
}

export function setAvatar(avatar) {
  return Cookies.set(AvatarKey, avatar)
}

export function removeAvatar() {
  return Cookies.remove(AvatarKey)
}
