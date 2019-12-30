import Taro, {Component} from '@tarojs/taro'
import {
    Text,
    View,
    Button,
    RadioGroup,
    Form,
    Picker,
    Checkbox,
    CheckboxGroup,
    Input,
    Label,
} from '@tarojs/components'
import './index.scss';
import './../../app.scss'
import '@tarojs/async-await'
import {SETTLETYPES, JOBTYPES, WELFARETYPES, SALARYTYPES} from "../../constants/type";
import {request} from "../../util/request";
import {checkNumber, checkPhone, checkRequire} from "../../util/validator";
import {dateFormatter} from "../../util/formatter";

class JobAction extends Component {

    config = {
        navigationBarTitleText: '小豆商家',
    };

    constructor(props) {
        super(props);
        this.state = {
            error: '',
            form: {},
            jobId: this.$router.params.jobId,
            type: this.$router.params.type === 'new',//再发一次
            disabled: this.$router.params.disabled === 'true',//查看
            merchId: this.$router.params.merchId,
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
                if (name === 'welfare') {
                    return {form: {...prevState.form, [name]: value.toString()}}
                }
                return {
                    form: {...prevState.form, [name]: value}, error: result
                }
            });
        } catch (e) {
            this.setState((prevState) => {
                if (name === 'welfare') {
                    return {form: {...prevState.form, [name]: value.toString()}}
                }
                return {
                    form: {...prevState.form, [name]: value}, error: result
                }
            });
        }
    }

    handleInputChange(name, value) {
        this.setState((prevState) => {
            if (name === 'welfare') {
                return {form: {...prevState.form, [name]: value.toString()}}
            }
            return {
                form: {...prevState.form, [name]: value}
            }
        });
    }

    handleSelectChange(name, types, value) {
        this.setState((prevState) => {
            if (types) {
                return {form: {...prevState.form, [name]: types[value]}}
            }
            //省市区或日期 无types
            return {form: {...prevState.form, [name]: value.toString()}}
        });
    }

    formSubmit() {
        let a = checkRequire(this.state.form.contact);
        let b = checkRequire(this.state.form.phone);
        let c = checkRequire(this.state.form.jobType);
        let d = checkRequire(this.state.form.settleType);
        let e = checkRequire(this.state.form.address);
        if (a || b || c || d || e) {
            this.setState({
                error: a || b || c || d || e
            });
            return false;
        }
        this.setState({isDisabled: true}, () => {
            request({
                url: '/merch/jobs', method: this.state.form.id ? 'PUT' : 'POST', data: this.state.form,
            }).then((res) => {
                this.setState({isDisabled: false}, () => {
                    if (this.state.jobId) {
                        return Taro.navigateBack();
                    }
                    return Taro.redirectTo({url: `/pages/action-result/index?type=job&action=add&merchId=${this.state.merchId}&jobId=${res.data.data}`})
                });
            });
        });
    };


    async componentDidShow() {
        let job = null;
        let merchant = null;
        merchant = await request({
            url: '/merch/merchant', method: 'GET', data: {id: this.$router.params.merchId},
        });
        if (this.state.jobId) {
            job = await request({
                url: '/merch/jobs', method: 'GET', data: {id: this.state.jobId},
            });
        }
        if (this.state.type) { //再来一条
            job.data.data.id = '';
        }
        if (job) {
            this.setState({
                form: {
                    contact: merchant.data.data.contact,
                    phone: merchant.data.data.phone,
                    address: merchant.data.data.address ? merchant.data.data.address : '河南省,郑州市,金水区',
                    merchId: this.$router.params.merchId,
                    ...job.data.data,
                }
            })
        } else {
            this.setState({
                form: {
                    contact: merchant.data.data.contact,
                    phone: merchant.data.data.phone,
                    address: merchant.data.data.address ? merchant.data.data.address : '河南省,郑州市,金水区',
                    area: merchant.data.data.addressDetails ? merchant.data.data.addressDetails : '',
                    merchId: this.$router.params.merchId,
                }
            })
        }
    }

    render() {
        const {form, disabled, error, isDisabled} = this.state;
        return (
            <View className='job-action'>
                <View className='error-top'>{error}</View>
                <Form>
                    <View className='form-body'>
                        <View className='form-item'>
                            <Label className='label'>工作类型</Label>
                            <Picker className='flex-1' mode='selector' range={JOBTYPES}
                                    value={form.jobType}
                                    onChange={(e) => this.checkValue([checkRequire], 'jobType', JOBTYPES[e.detail.value])}>
                                <Text>{form.jobType ? form.jobType : '请选择（必填项）'}</Text>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>结算方式</Label>
                            <Picker className='flex-1' mode='selector' range={SETTLETYPES}
                                    value={form.settleType}
                                    onChange={(e) => this.checkValue([checkRequire], 'settleType', SETTLETYPES[e.detail.value])}>
                                <Text>{form.settleType ? form.settleType : '请选择（必填项）'}</Text>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>工作地点</Label>
                            <Picker className='flex-1' mode='region'
                                    value={form.address ? form.address.split(',') : ''}
                                    onChange={(e) => this.checkValue([checkRequire], 'address', e.detail.value)}>
                                <Text>{form.address ? form.address : '请选择（必填项）'}</Text>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>详细地址</Label>
                            <Input className='flex-1' value={form.addressDetails}
                                   onChange={(e) => this.handleInputChange('addressDetails', e.detail.value)}
                                   maxLength={50} placeholder='输入街道、牌号等详细信息'/>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>联系人</Label>
                            <Input className='flex-1' value={form.contact}
                                   onInput={(e) => {
                                       this.checkValue([checkRequire], 'contact', e.detail.value)
                                   }}
                                   maxLength={6} placeholder='联系人(必填项)'/>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>联系电话</Label>
                            <Input className='flex-1' value={form.phone}
                                   onInput={(e) => {
                                       this.checkValue([checkRequire, checkPhone], 'phone', e.detail.value)
                                   }}
                                   maxLength={11} placeholder='联系电话(必填项)'/>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>薪资单位</Label>
                            <Picker className='flex-1' mode='selector' range={SALARYTYPES}
                                    value={form.unit}
                                    onChange={(e) => this.handleSelectChange('unit', SALARYTYPES, e.detail.value)}>
                                <Text>{form.unit ? form.unit : '请选择'}</Text>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>薪资</Label>
                            <Input className='flex-1'
                                   onInput={(e) => this.checkValue([checkNumber], 'price', e.detail.value)}
                                   value={form.price} disabled={disabled} maxLength={5} placeholder='输入薪资'/>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>工作日期</Label>
                            <Picker mode='date'
                                    onChange={(e) => this.handleSelectChange('startDate', null, e.detail.value)}
                                    value={form.startDate} end={form.endDate}>
                                <Text>{form.startDate ? dateFormatter(form.startDate) : '请选择'}</Text>
                            </Picker>
                            <Text>~</Text>
                            <Picker mode='date'
                                    onChange={(e) => this.handleSelectChange('endDate', null, e.detail.value)}
                                    value={form.endDate} start={form.startDate}>
                                <Text>{form.endDate ? dateFormatter(form.endDate) : '请选择'}</Text>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>时间1</Label>
                            <Picker mode='time'
                                    onChange={(e) => this.handleSelectChange('times1Start', null, e.detail.value)}
                                    value={form.times1Start}>
                                <Text>{form.times1Start ? form.times1Start : '请选择'}</Text>
                            </Picker>
                            <Text>~</Text>
                            <Picker mode='time'
                                    onChange={(e) => this.handleSelectChange('times1End', null, e.detail.value)}
                                    value={form.times1End}>
                                <Text>{form.times1End ? form.times1End : '请选择'}</Text>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>时间2</Label>
                            <Picker mode='time'
                                    onChange={(e) => this.handleSelectChange('times2Start', null, e.detail.value)}
                                    value={form.times2Start}>
                                <Text>{form.times2Start ? form.times2Start : '请选择'}</Text>
                            </Picker>
                            <Text>~</Text>
                            <Picker mode='time'
                                    onChange={(e) => this.handleSelectChange('times2End', null, e.detail.value)}
                                    value={form.times2End}>
                                <Text>{form.times2End ? form.times2End : '请选择'}</Text>
                            </Picker>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>所需人数</Label>
                            <RadioGroup onChange={(e) => this.handleInputChange('gender', e.detail.value)}>
                                <Label for='1' key='1' className='group-item'>
                                    <Radio value='男女不限' checked={form.gender === '男女不限'}>男女不限</Radio>
                                </Label>
                                <Label for='2' key='3' className='group-item'>
                                    <Radio value='仅限男/女' checked={form.gender === '仅限男/女'}>仅限男/女</Radio>
                                </Label>
                            </RadioGroup>
                        </View>
                        {form.gender === '男女不限' ?
                            <View className='form-item'>
                                <Label className='label'>共</Label>
                                <Input type='number' maxLength={3} placeholder='0'
                                       value={form.recruitNum}
                                       onInput={(e) => this.checkValue([checkNumber], 'recruitNum', e.detail.value)}/>
                            </View>
                            : null
                        }
                        {form.gender === '仅限男/女' ?
                            <View className='form-item'>
                                <Label className='label'>男</Label>
                                <Input type='number' maxLength={3} placeholder='0' value={form.numMan}
                                       onInput={(e) => this.checkValue([checkNumber], 'numMan', e.detail.value)}/>
                                <Label className='label'>女</Label>
                                <Input type='number' maxLength={3} value={form.numWoman} placeholder='0'
                                       onInput={(e) => this.checkValue([checkNumber], 'numWoman', e.detail.value)}/>
                            </View>
                            : null
                        }
                        <View className='form-item'>
                            <Label className='label'>福利</Label>
                            <View className='group'>
                                <CheckboxGroup onChange={(e) => this.handleInputChange('welfare', e.detail.value)}>
                                    {WELFARETYPES.map((item, i) => {
                                        return (
                                            <Label for={i} key={i} className='group-item'>
                                                <Checkbox
                                                    checked={form.welfare ? form.welfare.split(',').includes(item) : false}
                                                    value={item}>{item}</Checkbox>
                                            </Label>
                                        )
                                    })}
                                </CheckboxGroup>
                            </View>
                        </View>
                        <View className='form-item'>
                            <Label className='label'>备注</Label>
                            <Input onChange={(e) => this.handleInputChange('remark', e.detail.value)} maxLength={50}
                                   value={form.remark ? form.remark : ''}
                                   placeholder='输入注意事项'/>
                        </View>
                    </View>
                    {
                        disabled ? null :
                            <Button className='btn_submit' disabled={isDisabled}
                                    onClick={this.formSubmit.bind(this)}>提交</Button>
                    }

                </Form>
            </View>
        )
    }
}

export default JobAction
