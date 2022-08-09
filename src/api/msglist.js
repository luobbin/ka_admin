import request from '@/utils/request'

export function fetchMsgList(pagenumber){
    return  request({
        url: '/msgs' + '?page=' + pagenumber,
        method: 'get'
      })
}
