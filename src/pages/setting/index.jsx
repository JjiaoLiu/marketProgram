import Taro, {Component} from '@tarojs/taro'
import {View, Button} from '@tarojs/components'
import {connect} from "@tarojs/redux";
import './index.scss'
import './../../app.scss'
import {loginOut} from "../../actions/user";

@connect(({}) => ({}), (dispatch) => ({
    loginOut() {
        dispatch(loginOut());
    },
}))

class Home extends Component {
    config = {
        navigationBarTitleText: '小豆商家',
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View className='setting'>
                <Button onClick={this.props.loginOut.bind(this)} className='login-out_btn' type='button'>退出</Button>
            </View>
        )
    }
}

export default Home
