import axios from '@/api/gongGong.js'
export const login = function (data) {
  return axios({
    method: 'post',
    url: 'login',
    data
  })
}
export const getUsers = function (data) {
  return axios({
    url: 'users',
    params: data
  })
}
export const addUser = function (data) {
  return axios({
    method: 'post',
    url: 'users',
    data
  })
}
export const putUser = function (uId, type) {
  return axios({
    method: 'put',
    url: `users/${uId}/state/${type}`
  })
}
export const delUser = function (id) {
  return axios({
    method: 'delete',
    url: `users/${id}`
  })
}
export const roleUsers = function (id, rid) {
  return axios({
    method: 'put',
    url: `users/${id}/role`,
    data: { rid }
  })
}
export const editUser = function (data) {
  return axios({
    method: 'put',
    url: `users/${data.id}`,
    data: { email: data.email, mobile: data.mobile }
  })
}
