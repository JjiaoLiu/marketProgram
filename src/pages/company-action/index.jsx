import Taro, {Component} from '@tarojs/taro'
import {View, Button, Form, Picker, Input, Label, Text} from '@tarojs/components'
import './index.scss';
import './../../app.scss'
import '@tarojs/async-await'
import {MERCHANTTYPE, MERCHANTLEVEL} from "../../constants/type";
import {request} from "../../util/request";
import {checkPhone, checkRequire} from './../../util/validator'

class CompanyAction extends Component {
    config = {
        navigationBarTitleText: '小豆商家',
    };

    constructor(props) {
        super(props);
        this.state = {
            form: {address: '河南省,郑州市,金水区'},
            disabled: this.$router.params.disabled === 'true',
            merchId: this.$router.params.merchId,
            error: '',
            isDisabled: false
        }
    }

    checkValue(validators, name, value) {
        let result = '';
        try {
            validators.forEach((f) => {
                result = f(value);
                if (result) {
                    throw Error()
                }
            });
            this.setState((prevState) => {
                return {form: {...prevState.form, [name]: value}, error: result}
            });
        } catch (e) {
            this.setState((prevState) => {
                return {form: {...prevState.form, [name]: value}, error: result}
            });
        }
    }

    formSubmit() {
        let a = checkRequire(this.state.form.merchantName);
        let c = checkRequire(this.state.form.merchantType);
        let b = checkPhone(this.state.form.phone);
        if (a || b || c) {
            this.setState({
                error: a || b || c
            });
            return false;
        }
        this.setState({isDisabled: true}, () => {
            request({
                url: '/merch/merchant', method: this.state.merchId ? 'PUT' : 'POST', data: this.state.form,
            }).then((res) => {
                this.setState({isDisabled: false}, () => {
                    if (this.state.merchId) { //修改页面
                        return Taro.navigateBack();
                    }
                    return Taro.redirectTo({url: `/pages/action-result/index?action=add&type=company&merchId=${res.data.data}`})
                })
            });
        });
    };

    handleInputChange(name, value) {
        this.setState((prevState) => {
            return {form: {...prevState.form, [name]: value}}
        });
    }

    handleSelectChange(name, types, value) {
        this.setState((prevState) => {
            if (types) {
                return {form: {...prevState.form, [name]: types[value]}}
            }
            //省市区
            return {form: {...prevState.form, [name]: value.toString()}}
        });
    }

    componentDidMount() {
        if (this.state.merchId) {
            request({
                url: `/merch/merchant?id=${this.state.merchId}`,
                method: 'GET',
            }).then(res => {
                this.setState({form: res['data']['data']});
            });
        }
    }

    render() {
        const {form, disabled, error, isDisabled} = this.state;
        return (
            <View className='company-action'>
                <View className='error-top'><Text>{error}</Text></View>
                <Form>
                    <View className='form-body'>
                        <View className='form-item'>
                            <Label className='label'>商家名称</Label>
                            <Input className='flex-1' value={form.merchantName} disabled={disabled}
                                   onInput={(e) => this.checkValue([checkRequire], 'merchantName', e.detail.value)}
                                   maxLength={20} placeholder='请输入商家名(必填项)'/>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>商户类型</Label>
                            <Picker className='flex-1' mode='selector' range={MERCHANTTYPE} disabled={disabled}
                                    value={form.merchantType ? MERCHANTTYPE.indexOf(form.merchantType) : ''}
                                    onChange={(e) => this.checkValue([checkRequire], 'merchantType', MERCHANTTYPE[e.detail.value])}>
                                <Text>{form.merchantType ? form.merchantType : '请选择（必填项）'}</Text>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>地址</Label>
                            <Picker className='flex-1' mode='region' disabled={disabled}
                                    value={form.address ? Array.of(form.address) : ['河南省', '郑州市', '金水区']}
                                    onChange={(e) => {
                                        this.handleSelectChange('address', null, e.detail.value)
                                    }}>
                                <Text>{form.address ? form.address.toString() : ['河南省', '郑州市', '金水区']}</Text>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>详细地址</Label>
                            <Input className='flex-1'
                                   onChange={(e) => {
                                       this.handleInputChange('addressDetails', e.detail.value)
                                   }}
                                   disabled={disabled}
                                   value={form.addressDetails} maxLength={50} placeholder='输入街道、牌号等详细信息'/>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>商家等级</Label>
                            <Picker className='flex-1' mode='selector' range={MERCHANTLEVEL} disabled={disabled}
                                    value={form.merchantLevel ? MERCHANTTYPE.indexOf(form.merchantLevel) : ''}
                                    onChange={(e) => this.handleSelectChange('merchantLevel', MERCHANTLEVEL, e.detail.value)}>
                                <Text>{form.merchantLevel ? form.merchantLevel : '请选择'}</Text>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>乘车路线</Label>
                            <Input className='flex-1' onChange={(e) => this.handleInputChange('bus', e.detail.value)}
                                   disabled={disabled}
                                   value={form.bus} maxLength={50} placeholder='输入乘车交通路线'/>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>负责人</Label>
                            <Input className='flex-1'
                                   onChange={(e) => this.handleInputChange('contact', e.detail.value)}
                                   disabled={disabled}
                                   value={form.contact} maxLength={50} placeholder='输入商家负责人姓名'/>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>联系电话</Label>
                            <Input className='flex-1'
                                   onInput={(e) => this.checkValue([checkPhone], 'phone', e.detail.value)}
                                   disabled={disabled} value={form.phone} maxLength={11} placeholder='输入商家负责人电话'/>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>备注</Label>
                            <Input className='flex-1' onChange={(e) => this.handleInputChange('remark', e.detail.value)}
                                   disabled={disabled} value={form.remark} maxLength={50} placeholder='输入其他备注信息'/>
                        </View>
                    </View>
                    {
                        disabled ? '' : <Button className='btn_submit' disabled={isDisabled}
                                                onClick={this.formSubmit.bind(this)}>提交</Button>
                    }
                </Form>
            </View>
        )
    }
}

export default CompanyAction
