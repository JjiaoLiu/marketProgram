import Taro, {Component} from '@tarojs/taro'
import './index.scss';
import './../../app.scss'
import {View, Image, Text, Icon, Button} from "@tarojs/components";
import IconPhone from "../company/icon_phone.png";
import IconContact from "../company/icon_contact.png";
import IconRight from "./icon_right.png";
import IconShop from "./icon_shop.png";
import {request} from "../../util/request";
import JobCardAction from "../componets/job-card-action";

class JobDetail extends Component {
    config = {
        navigationBarTitleText: '职位详情',
        enablePullDownRefresh: true
    };

    constructor(props) {
        super(props);
        this.state = {
            jobId: this.$router.params.jobId,
            merchId: this.$router.params.merchId,
            job: {},
            merch: {},
        }
    }

    call(tel) {
        return Taro.makePhoneCall({phoneNumber: tel})
    }

    toCompageactionPage() {
        return Taro.navigateTo({
            url: `/pages/company-action/index?merchId=${this.state.merchId}&disabled=true`
        })
    }

    onPullDownRefresh() {
        this.init()
    }

    componentDidShow() {
        this.init()
    }

    init() {
        request({
            url: '/merch/jobs', method: 'GET', data: {id: this.state.jobId},
        }).then((res) => {
            this.setState({job: res['data']['data']})
        });

        request({
            url: `/merch/merchant?id=${this.state.merchId}`,
            method: 'GET',
        }).then(res => {
            this.setState({merch: res['data']['data']})
        });
        Taro.stopPullDownRefresh()
    }

    render() {

        const {merch, job} = this.state;

        return (
            <View className='job-detail'>
                <View className='job-status'>
                    <Text>{job.status}</Text>
                </View>
                <JobCardAction job={job}/>
                <View className='job-company'>
                    <View className='detail-1' onClick={this.toCompageactionPage.bind(this)}>
                        <View className='detail-11'><Image src={IconShop} className='icon_shop'/><Text
                            className='detail-12'>{merch.merchantName}</Text></View>
                        <Image src={IconRight} className='icon_right'/>
                    </View>
                    <View className='detail-3'>
                        <View className='detail-32'>
                            <Image className='icon_contact' src={IconContact}/>
                            <Text className='detail-31'>{job.contact ? job.contact : '-'}</Text>
                        </View>
                        <View className='detail-32'>
                            <Image className='icon_phone' src={IconPhone}/>
                            <Text className='detail-31'>{job.phone ? job.phone : '-'}</Text>
                            {
                                job.phone ? <Button className='btn'
                                                    onClick={this.call.bind(this, job.phone)}>拨打</Button> : null
                            }

                        </View>
                    </View>
                    <View className='detail-1'>
                        <Text className='detail-31'>备注：{job.remark ? job.remark : '-'}</Text>
                    </View>
                    <View className='detail-1'>
                        <Text className='detail-31'>上传时间：{job.createTime}</Text>
                        {/*<Text className='detail-31'>对接时间：{job.createTime}</Text>*/}
                        {/*<Text className='detail-31'>完成时间：{job.createTime}</Text>*/}
                    </View>
                </View>
            </View>
        )
    }
}

export default JobDetail
