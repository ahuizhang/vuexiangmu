import axios from '@/api/gongGong.js'
export const getRolesAll = function () {
  return axios({
    url: 'roles'
  })
}
export const getAllQuanXian = function (type) {
  return axios({
    url: `rights/${type}`
  })
}
export const getAllJueSe = function () {
  return axios({
    url: 'roles'
  })
}
export const deleteQuanXian = function (roleId, rightId) {
  return axios({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}
export const shouQuan = function (roleId, rids) {
  return axios({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data: { rids }
  })
}
export const deleteRoles = function (id) {
  return axios({
    method: 'delete',
    url: `roles/${id}`
  })
}
export const addRoles = function (data) {
  return axios({
    method: 'post',
    url: 'roles',
    data
  })
}
export const editJueSe = function (id, roleName, roleDesc) {
  return axios({
    method: 'put',
    url: `roles/${id}`,
    data: { roleName, roleDesc }
  })
}
export const getMenus = function () {
  return axios({
    url: 'menus'
  })
}
