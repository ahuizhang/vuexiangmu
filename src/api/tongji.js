import axios from '@/api/gongGong.js'
export const tongji = function () {
  return axios({
    url: 'reports/type/1'
  })
}
