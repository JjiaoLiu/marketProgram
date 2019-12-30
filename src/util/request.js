import Taro from "@tarojs/taro";
import '@tarojs/async-await'
import {store} from "../store";
import {setUser} from "../actions/user";

var checkToken = () => {
    return new Promise(function (resolve, reject) {
        Taro.request({
            url: apiUrl + '/oauth/check_token?token=' + Taro.getStorageSync('access_token'),
            method: 'GET',
        }).then(res => {
            if (res.data.code === undefined || res.data.code === 0) {
                resolve(res.data.user_name);
            } else {
                return Taro.redirectTo({url: '/pages/login/index'});
            }
        }).catch(err => {
            return Taro.redirectTo({url: '/pages/login/index'});
        });
    })
};


const ajax = (options) => {
    let token = Taro.getStorageSync('access_token');
    const interceptor = function (chain) {
        const requestParams = chain.requestParams;
        return chain.proceed(requestParams).then(res => {
            const {statusCode} = res;
            if (statusCode === 401 || statusCode === 403 || statusCode >= 500 || (res.data.code && res.data.code !== 0 || res.data.error)) {
                return Taro.showToast({
                    title: res.data.msg || res.data.error,
                    duration: 3000,
                    icon: 'none'
                }).then(() => {
                    return Taro.redirectTo({url: '/pages/login/index'});
                });
            }
            return res
        }).catch(err => {
            console.log('interceptor', err)
        })
    };
    Taro.addInterceptor(interceptor);
    return Taro.request({
        url: apiUrl + options.url,
        method: options.method,
        data: options.data,
        header: {'content-type': 'application/json', 'Authorization': 'Bearer ' + token},
    })
};

export async function request(options) {
    // var user_name = await checkToken();
    // if (user_name) {
    //     store.dispatch(setUser(user_name));
    return ajax(options)
    // }
}