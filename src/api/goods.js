import axios from '@/api/gongGong.js'
export const getAllGoods = function (params) {
  return axios({
    url: 'goods',
    params
  })
}
