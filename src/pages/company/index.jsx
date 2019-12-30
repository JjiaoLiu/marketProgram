import Taro, {Component} from '@tarojs/taro'
import {Image, Text, View, Button, Swiper, SwiperItem, ScrollView} from '@tarojs/components'
import JobCard from './../componets/job-card'
import IconEdit from './icon_edit.png'
import IconLocation from './icon_location.png'
import IconContact from './icon_contact.png'
import IconPhone from './icon_phone.png'
import IconBus from './icon_bus.png'
import IconAdd from './icon_add.png'
import './index.scss';
import './../../app.scss'
import '@tarojs/async-await'
import {request} from "../../util/request";


class Company extends Component {
    config = {
        navigationBarTitleText: '小豆商家',
        enablePullDownRefresh: true
    };

    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0,
            jobListHeight: 0,
            merch: {},
            merchId: this.$router.params.merchId,
            tab: [{label: '待确认'}, {label: '对接中'}, {label: '已确认'}, {label: '失效'}],
            jobList: [],
            pageNo: 1
        }
    }

    async initPage() {
        await this.getJobList();
        const window = await Taro.getSystemInfo();
        await request({
            url: `/merch/merchant?id=${this.state.merchId}`,
            method: 'GET',
        }).then(res => {
            this.setState({merch: res['data']['data']}, () => {
                Taro.createSelectorQuery().in(this.$scope)
                    .select('#detail')
                    .boundingClientRect().exec((res) => {
                    this.setState({jobListHeight: window.windowHeight - res[0].height})
                });
            });
        });
        Taro.stopPullDownRefresh()
    }

    getJobList() {
        request({
            url: `/merch/jobs/page`,
            method: 'GET',
            data: {
                merchId: this.state.merchId,
                status: this.state.tab[this.state.currentTab].label,
                pageNo: this.state.pageNo,
            }
        }).then(res => {
            this.setState((prevState) => {
                return {jobList: [...prevState.jobList, ...res.data.data.records], pageNo: res.data.data.current + 1}
            });
        });
    }

    toCompageactionPage() {
        this.setState({pageNo: 1, jobList: []}, () => {
            return Taro.navigateTo({
                url: `/pages/company-action/index?merchId=${this.state.merchId}&disabled=false`
            })
        });
    }

    toJobactionPage() {
        this.setState({pageNo: 1, jobList: []}, () => {
            return Taro.navigateTo({
                url: `/pages/job-action/index?merchId=${this.state.merchId}&disabled=false`
            })
        })
    }

    setcurrentTab(index) {
        this.setState({currentTab: index, jobList: [], pageNo: 1}, () => {
            this.getJobList()
        });
    }

    call(tel) {
        return Taro.makePhoneCall({phoneNumber: tel,})
    }

    onPullDownRefresh() {
        return this.initPage();
    }

    componentDidShow() {
        return this.initPage();
    }

    render() {
        const {currentTab, jobListHeight, merch, tab, jobList} = this.state;
        return (
            <View className='company'>
                <View className='detail-wrap' id='detail'>
                    <View className='detail'>
                        <View className='detail-1'>
                            <View className='detail-11'>
                                <Text className='companyName'>{merch.merchantName}</Text>
                                <Text className='brand ml-10'>{merch.merchantType ? merch.merchantType : '-'}</Text>
                                <View
                                    className='icon_level'><Text>{merch.merchantLevel ? merch.merchantLevel : '-'}</Text></View>
                            </View>
                            <View className='btn-edit' onClick={this.toCompageactionPage.bind(this)}>
                                <Image className='icon_edit' src={IconEdit}/>
                            </View>
                        </View>
                        <View className='detail-2'>
                            <Image className='icon_location' src={IconLocation}/>
                            <Text
                                className='detail-21'>{merch.address ? merch.address : '-'}{merch.addressDetails ? merch.addressDetails : '-'}</Text>
                        </View>
                        <View className='detail-2'>
                            <Image className='icon_bus' src={IconBus}/>
                            <Text className='detail-21'>{merch.bus ? merch.bus : '-'}</Text>
                        </View>
                        <View className='detail-3'>
                            <View className='detail-32'>
                                <Image className='icon_contact' src={IconContact}/>
                                <Text className='detail-31'>{merch.contact ? merch.contact : '-'}</Text>
                            </View>
                            <View className='detail-32'>
                                <Image className='icon_phone' src={IconPhone}/>
                                <Text className='detail-31'>{merch.phone ? merch.phone : '-'}</Text>
                                {
                                    merch.phone ?
                                        <Button className='btn' onClick={this.call.bind(this, merch.phone)}>拨打</Button>
                                        : null
                                }

                            </View>
                        </View>
                        <View className='detail-4'>
                            <Text className='detail-41'>
                                备注：{merch.remark ? merch.remark : '-'}
                            </Text>
                        </View>
                        <Button className='btn_add' onClick={this.toJobactionPage.bind(this)}>
                            <Image src={IconAdd} className='icon_add'/>
                            加油～录入新职位吧
                        </Button>
                        <Swiper displayMultipleItems={4} className='tab-header'>
                            {
                                tab.map((f, index) => {
                                    return <SwiperItem className='tab-header_item' key={index}
                                                       onClick={this.setcurrentTab.bind(this, index)}>
                                        <Text className={
                                            ['tab-header_body', currentTab === index ? 'tab-header_body-active' : null]
                                        }>{f.label}</Text>
                                    </SwiperItem>
                                })
                            }
                        </Swiper>
                    </View>
                </View>
                <ScrollView
                    className='tab-body'
                    scrollY={true}
                    onScrollToLower={this.getJobList.bind(this)}
                    style={{'height': jobListHeight + 'px'}}>
                    {
                        jobList.map((f) => {
                            return <JobCard key={f.id} job={f}/>
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}

export default Company
