import Taro, {Component} from '@tarojs/taro'
import './index.scss';
import {ScrollView, Swiper, SwiperItem, Text, View, Image, Button} from "@tarojs/components";
import IconFilter from './icon_filter.png'
import './../../app.scss'
import {request} from "../../util/request";
import JobCardActionMerchant from "../componets/job-card-action-merchant";
import {JOBTYPES, SETTLETYPES, HENANAREA} from "../../constants/type";

class JobList extends Component {
    config = {
        navigationBarTitleText: '小豆商家',
        enablePullDownRefresh: true
    };

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            height: 0,
            windowHeight: 200,
            current: +this.$router.params.current,
            jobList: [],
            tab: [{label: ''}, {label: '待确认'}, {label: '对接中'}, {label: '已确认'}, {label: '失效'}],
            filter: {},
            pageNo: 1
        }
    }

    getJobList() {
        request({
            url: `/merch/jobs/page`,
            method: 'GET',
            data: {
                ...this.state.filter,
                status: this.state.tab[this.state.current].label,
                pageNo: this.state.pageNo
            }
        }).then(res => {
            this.setState((prevState) => {
                return {jobList: [...prevState.jobList, ...res.data.data.records], pageNo: res.data.data.current + 1}
            });
        });
    }

    async getTabBodyHeight() {
        const window = Taro.getSystemInfoSync();
        Taro.createSelectorQuery().in(this.$scope)
            .select('#tab-body')
            .boundingClientRect().exec((res) => {
            this.setState({height: window.windowHeight - res[0].top, windowHeight: window.windowHeight})
        });
        Taro.stopPullDownRefresh()
    }

    setCurrent(index) {
        this.setState({current: index, filter: {}, pageNo: 1, jobList: []}, () => {
            this.getJobList()
        })
    }

    onPullDownRefresh() {
        this.getJobList();
        return this.getTabBodyHeight();
    }

    componentDidShow() {
        this.getJobList();
        return this.getTabBodyHeight();
    }

    reset(e) {
        e.stopPropagation();
        this.setState({filter: {}});
    }

    submit(e) {
        this.setState({
            pageNo: 1,
            jobList: []
        }, () => {
            this.getJobList();
            this.hidden(e);
        });
    }

    show() {
        this.setState({show: true})
    }

    hidden(e) {
        e.stopPropagation();
        this.setState({show: false})
    }

    handleUpdate(index) {
        this.setState((prevState) => {
            prevState.jobList.splice(index, 1);
            jobList:prevState.jobList
        })
    }

    setFilter(key, value, e) {
        e.stopPropagation();
        if (this.state.filter[key] === value) {
            this.setState((prevState) => {
                return {filter: {...prevState.filter, [key]: ''}}
            });
        } else {
            this.setState((prevState) => {
                return {filter: {...prevState.filter, [key]: value}}
            });
        }
    }

    render() {
        const {height, current, show, windowHeight, tab, jobList} = this.state;
        return (
            <View className='job-list'>
                <View className='with-filter' style={{marginBottom: '10px'}}>
                    <Swiper displayMultipleItems={5} className='tab-header' style={{flex: 1}}>
                        {
                            tab.map((f, index) => {
                                return <SwiperItem className='tab-header_item' key={index}
                                                   onClick={this.setCurrent.bind(this, index)}>
                                    <Text className={
                                        ['tab-header_body', current === index ? 'tab-header_body-active' : null]
                                    }>{f.label || '全部'}</Text>
                                </SwiperItem>
                            })
                        }
                    </Swiper>
                    <View className='btn-filter' onClick={this.show}>
                        <Image src={IconFilter} className='icon_filter'/>
                    </View>
                </View>
                <View id='tab-body' className='tab-body'>
                    <ScrollView scrollY style={{'height': height + 'px'}} onScrollToLower={this.getJobList.bind(this)}>
                        {
                            jobList.map((f, index) => {
                                return <JobCardActionMerchant onUpdate={this.handleUpdate.bind(this, index)} key={index}
                                                              job={f}/>
                            })
                        }
                    </ScrollView>
                </View>
                {
                    show ?
                        <View className='pop_fixed-wrap flex-end' onClick={this.hidden.bind(this)}>
                            <View className='pop_fixed-filter-body' style={{height: windowHeight + 'px'}}
                                  onClick={(e) => {
                                      e.stopPropagation()
                                  }}>
                                <View className='list-wrap'>
                                    <View className='list-title'>
                                        <Text>工作类型</Text>
                                    </View>
                                    <View className='list-group'>
                                        {
                                            JOBTYPES.map((f, index) => {
                                                return <Text onClick={this.setFilter.bind(this, 'jobType', f)}
                                                             key={index}
                                                             className={['list-item', filter.jobType === f ? 'list-item_active' : null]}>{f}</Text>
                                            })
                                        }
                                    </View>
                                    <View className='list-title'>
                                        <Text>结算方式</Text>
                                    </View>
                                    <View className='list-group'>
                                        {
                                            SETTLETYPES.map((f, index) => {
                                                return <Text onClick={this.setFilter.bind(this, 'settleType', f)}
                                                             key={index}
                                                             className={['list-item', filter.settleType === f ? 'list-item_active' : null]}>{f}</Text>
                                            })
                                        }
                                    </View>
                                    <View className='list-title'>
                                        <Text>工作区域</Text>
                                    </View>
                                    <View className='list-group'>
                                        {
                                            HENANAREA.map((f, index) => {
                                                return <Text onClick={this.setFilter.bind(this, 'address', f)}
                                                             key={index}
                                                             className={['list-item', filter.address === f ? 'list-item_active' : null]}>{f}</Text>
                                            })
                                        }
                                    </View>
                                    <Button className='btn reset' onClick={this.reset}>重置</Button>
                                    <Button className='btn submit' onClick={this.submit}>确定</Button>
                                </View>
                            </View>
                        </View> : null
                }
            </View>
        )
    }
}

export default JobList
