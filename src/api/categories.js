import axios from '@/api/gongGong.js'
export const getCategories = function (type) {
  return axios({
    url: 'categories',
    params: { type }
  })
}
export const addGoods = function (data) {
  return axios({
    method: 'post',
    url: 'goods',
    data
  })
}
