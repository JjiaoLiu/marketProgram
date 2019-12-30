import Taro, {Component} from '@tarojs/taro'
import './../../../app.scss'
import {Image, Text, View, Button} from "@tarojs/components";
import IconFemale from "./icon_female.png";
import IconMale from "./icon_male.png";
import IconCalendar from "./icon_calendar.png";
import IconRecruit from "./icon_recruit.png";
import IconRightArr from "./icon_right.png";
import {request} from "../../../util/request";
import {dateFormatter} from "../../../util/formatter";
import IconLocation from "../../company/icon_location.png";

class JobCardAction extends Component {
    config = {
        navigationBarTitleText: '小豆商家'
    };

    static defaultProps = {
        job: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            _delete: false
        }
    }

    toJobactionlPage(type) {
        if (type) { //再发一次
            return Taro.navigateTo({
                url: `/pages/job-action/index?jobId=${this.props.job.id}&merchId=${this.props.job.merchId}&type=${type}`
            });
        }
        return Taro.navigateTo({
            url: `/pages/job-action/index?jobId=${this.props.job.id}&merchId=${this.props.job.merchId}`
        })
    }

    handleDelete(e) {
        e.stopPropagation();
        request({
            url: `/merch/jobs?id=${this.props.job.id}`,
            method: 'DELETE'
        }).then(() => {
            return Taro.navigateBack()
        })
    }

    hideDel() {
        this.setState({_delete: false})
    }

    showDel() {
        this.setState({_delete: true})
    }

    render() {
        const {job} = this.props;
        const {_delete} = this.state;
        return (
            <View className='job-card'>
                <View className='detail-1'>
                    <View>
                        <Text className='brand mr-10'>{job.address ? (job.address.split(','))[2] : ''}</Text>
                        <Text className='detail-11'>{job.jobType ? job.jobType : '-'}</Text>
                    </View>
                    <Text
                        className='detail-12'>{job.price ? job.price : '-'}{job.unit ? job.unit : '-'}·{job.settleType ? job.settleType : '-'}</Text>
                </View>
                {
                    job.gender === '男女不限' ? <View className='detail-1 detail-2'>
                        <Image src={IconRecruit} style={{marginRight: '8px'}}
                               className='icon_recruit'/><Text>{job.recruitNum ? job.recruitNum : '-'}</Text>
                    </View> : null
                }
                {
                    job.gender === '仅限男/女' ? <View className='detail-1 detail-2'>
                        <Image src={IconFemale}
                               className='icon_female'/><Text>{job.numWoman ? job.numWoman : '-'}</Text>
                        <Image style={{marginLeft: '8px'}} src={IconMale}
                               className='icon_male'/><Text>{job.numMan ? job.numMan : '-'}</Text>
                    </View> : null
                }
                <View className='detail-1 detail-2'>
                    <Image src={IconCalendar} className='icon_calendar'/>
                    <Text>{dateFormatter(job.startDate)}~{dateFormatter(job.endDate)} {job.times1Start ? job.times1Start : '-'}~{job.times1End ? job.times1End : '-'} {job.times2Start ? job.times2Start : '-'}~{job.times2End ? job.times2End : '-'}</Text>
                </View>
                <View className='detail-1 detail-2'>
                    <Image className='icon_location' src={IconLocation} style={{marginRight: '8px'}}/>
                    <Text
                        className='detail-21'>{job.address ? job.address : '-'}{job.addressDetails ? job.addressDetails : '-'}</Text>
                </View>
                <View className='detail-1 detail-2' style={{flexWrap: 'wrap'}}>
                    {
                        job.welfare ? job.welfare.split(',').map((f, index) => {
                            return <Text className='tag' key={index}>{f}</Text>
                        }) : null
                    }
                </View>
                {
                    job.status === '待确认' ? <View className='detail-1 detail-3'>
                        <View className='btn' onClick={this.toJobactionlPage.bind(this, '')}>修改信息</View>
                        <View className='btn' onClick={this.showDel.bind(this)}>删除</View>
                    </View> : null
                }
                {
                    (job.status === '失效' || job.status === '已确认' || job.status === '对接中') ?
                        <View className='detail-1 detail-3'>
                            <View className='btn' onClick={this.toJobactionlPage.bind(this, 'new')}>再发一次</View>
                        </View> : null
                }
                {
                    _delete ?
                        <View className='pop_fixed-wrap' onClick={this.hideDel.bind(this)}>
                            <View className='pop_fixed-delete-body' onClick={(e) => e.stopPropagation()}>
                                <View className='pop_fixed-center-content'><Text>确定删除此职位信息吗？</Text></View>
                                <View className='pop_fixed-delete-action'>
                                    <Text className='btn-action' onClick={this.hideDel.bind(this)}>取消</Text>
                                    <View className='line'/>
                                    <Text className='btn-action' onClick={this.handleDelete.bind(this)}>确定</Text>
                                </View>
                            </View>
                        </View> : null
                }
            </View>
        )
    }
}

export default JobCardAction;