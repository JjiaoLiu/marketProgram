import '@tarojs/async-await'
import Taro, {Component} from '@tarojs/taro'
import {Provider} from '@tarojs/redux'
import {store} from './store'
import Index from "./pages/index";
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

    config = {
        pages: [
            'pages/index/index',
            'pages/login/index',
            'pages/company/index',
            'pages/job-detail/index',
            'pages/job-list/index',
            'pages/home/index',
            'pages/setting/index',
            'pages/company-action/index',
            'pages/job-action/index',
            'pages/action-result/index',
        ],
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#FF9066',
            navigationBarTitleText: 'marketProgram',
            navigationBarTextStyle: 'white',
            backgroundColor: '#ccc',
        }
    };

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render() {
        return (
            <Provider store={store}>
                <Index/>
            </Provider>
        )
    }
}

Taro.render(<App/>, document.getElementById('app'));
