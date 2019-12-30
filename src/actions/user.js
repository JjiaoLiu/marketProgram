import {
    SETUSER,
    LOGINOUT,
    SETAUTH
} from '../constants/user'
import Taro from '@tarojs/taro'
import qs from 'qs'

export const setAuth = (payload) => {
    return {
        type: SETAUTH,
        payload
    }
};

export const loginOut = () => {
    Taro.reLaunch({url: '/pages/login/index'});
    Taro.removeStorageSync('access_token');
    Taro.removeStorageSync('Authorization');
    return {
        type: LOGINOUT
    }
};

// 异步的action
export function login(data) {
    return dispatch => {
        Taro.request({
            url: apiUrl + '/oauth/token?' + qs.stringify(data),
            header: {'content-type': 'application/json'},
            method: 'POST'
        }).then(res => {
            if (res.code === undefined || res.code === 0) {
                Taro.setStorageSync('userData', data);
                Taro.setStorageSync('access_token', res.data.access_token);
                dispatch(setAuth(res.data.access_token));
                return Taro.reLaunch({url: '/pages/index/index'})
            } else {
               return  Taro.showToast({
                    title: `请求错误，状态码${statusCode}`,
                    duration: 3000,
                    icon: 'none'
                });
            }
        }).catch(err => {
            console.log(err)
        })
    }
}
