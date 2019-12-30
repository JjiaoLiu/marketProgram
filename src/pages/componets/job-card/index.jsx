import Taro, {Component} from '@tarojs/taro'
import './../../../app.scss'
import {Image, Text, View, Button} from "@tarojs/components";
import IconFemale from "./icon_female.png";
import IconMale from "./icon_male.png";
import IconRecruit from "./icon_recruit.png";
import IconCalendar from "./icon_calendar.png";
import {dateFormatter} from "../../../util/formatter";

class JobCard extends Component {
    config = {
        navigationBarTitleText: '小豆商家'
    };

    static defaultProps = {
        job: {}
    };

    constructor(props) {
        super(props)
    }

    toJobDetaillPage(e) {
        e.stopPropagation();
        Taro.navigateTo({
            url: `/pages/job-detail/index?jobId=${this.props.job.id}&merchId=${this.props.job.merchId}`
        })
    }

    render() {
        const {job} = this.props;
        return (
            <View className='job-card' onClick={this.toJobDetaillPage.bind(this)}>
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
                <View className='detail-1 detail-2' style={{flexWrap: 'wrap'}}>
                    {
                        job.welfare ? job.welfare.split(',').map((f, index) => {
                            return <Text className='tag' key={index}>{f}</Text>
                        }) : null
                    }
                </View>
            </View>
        )
    }
}

export default JobCard;