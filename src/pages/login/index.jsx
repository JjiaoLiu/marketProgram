import Taro, {Component} from '@tarojs/taro'
import {View, Form, Checkbox, CheckboxGroup, Button, Label, Image, Text, Input} from '@tarojs/components'
import ImageLogo from './logo_login.png'
import IconAccount from './icon_account.png'
import IconPassword from './icon_password.png'
import './index.scss'
import {connect} from '@tarojs/redux'
import {login} from '../../actions/user'

@connect(({user}) => ({user}), (dispatch) => ({
    login(data) {
        dispatch(login(data))
    },
}))
class Login extends Component {
    config = {
        navigationBarTitleText: '小豆商家',
    };

    constructor(props) {
        super(props);
        let checked = Taro.getStorageSync('userData')['checked'];
        let check = checked && checked.length;
        this.state = {
            form: {
                username: check ? Taro.getStorageSync('userData')['username'] : '',
                password: check ? Taro.getStorageSync('userData')['password'] : '',
                checked: checked,
                auth_type: 'password',
                grant_type: 'password',
                "client_id": client_id,
                "client_secret": client_secret
            }
        }
    }

    formSubmit() {
        setTimeout(() => {
            this.props.login(this.state.form)
        }, 200)
    };

    handleInputChange(name, e) {
        this.setState((prevState) => {
            return {
                form: {...prevState.form, [name]: e.detail.value}
            }
        });
    }

    render() {
        const {form} = this.state;

        return (
            <View className='login'>
                <Form className='form'>
                    <Image src={ImageLogo} className='logo-login'/>
                    <View className='form-body'>
                        <View className='form-item'>
                            <Image src={IconAccount} className='form-icon-fixed icon_account'/>
                            <Input onChange={this.handleInputChange.bind(this, 'username')}
                                   className="form-input"
                                   placeholder='输入用户名' type='text'
                                   value={form.username}/>
                        </View>
                        <View className='form-item'>
                            <Image src={IconPassword} className='form-icon-fixed icon_password'/>
                            <Input className="form-input" onChange={this.handleInputChange.bind(this, 'password')}
                                   placeholder='输入密码' type='password' value={form.password}/>
                        </View>
                        <CheckboxGroup onChange={(e) => this.handleInputChange('checked', e)}>
                            <Label className='form-item'>
                                <Checkbox checked={form.checked[0]} value='checked' className="form-checked"/>
                                <Text className='form-label'>记住密码</Text>
                            </Label>
                        </CheckboxGroup>
                    </View>
                </Form>
                <View className='form-submit' onClick={this.formSubmit.bind(this)} type='button'>登录</View>
            </View>
        )
    }
}

export default Login

