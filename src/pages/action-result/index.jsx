import Taro, {Component} from '@tarojs/taro'
import {View, Button, Image} from '@tarojs/components'
import IconSuccess from './icon_success.png'
import './index.scss'
import './../../app.scss'

class ActionResult extends Component {
    config = {
        navigationBarTitleText: '小豆商家',
    };

    constructor(props) {
        super(props);
        this.state = {
            typeString: this.$router.params.type === 'job' ? '职位信息' : '商家信息',
            actionString: this.$router.params.action === 'add' ? '添加' : '修改',
            merchId: this.$router.params.merchId,
            jobId: this.$router.params.jobId,
        }
    }

    toActionPage() {
        if (this.$router.params.type === 'job') { //新增职位
            return Taro.redirectTo({url: `/pages/job-action/index?disabled=false&merchId=${this.state.merchId}`})
        }
        if (this.$router.params.type === 'company') { //新增商家
            return Taro.redirectTo({url: '/pages/company-action/index?disabled=false'})
        }
    }

    toJobactionPage(disabled) {
        return Taro.redirectTo({url: `/pages/job-action/index?disabled=${disabled}&merchId=${this.state.merchId}&jobId=${this.state.jobId ? this.state.jobId : ''}`})
    }

    render() {
        const {type, action} = this.$router.params;
        const {typeString, actionString} = this.state;
        return (
            <View className='action-result'>
                <View><Image src={IconSuccess} className='icon_success'/></View>
                <Text className='txt'>{actionString}{typeString}成功</Text>
                <View>
                    <Button className='btn' onClick={this.toActionPage.bind(this)}>继续添加</Button>
                    {type === 'job' ?
                        <Button className='btn' onClick={this.toJobactionPage.bind(this, true)}>查看职位</Button> :
                        <Button className='btn' onClick={this.toJobactionPage.bind(this, false)}>录入职位</Button>}
                </View>
            </View>
        )
    }
}

export default ActionResult
