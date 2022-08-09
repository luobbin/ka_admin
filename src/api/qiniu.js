import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/get_qiniu_token', // 从服务端获取七牛token
    method: 'get'
  })
}

/**
 * 单个文件上传
 * @param data
 * @returns {*}
 */
export function singleLocalUpload(data) {
  return request({
    url: '/single_upload',
    method: 'post',
    data:data,
    headers:{
      "Content-Type": "multipart/form-data"
    }
  })
}

/**
 * 多个文件上传
 * @param data
 * @returns {*}
 */
export function mutiLocalUpload(data) {
  return request({
    url: '/muti_upload',
    method: 'post',
    data:data,
    headers:{
      "Content-Type": "multipart/form-data"
    }
  })
}


