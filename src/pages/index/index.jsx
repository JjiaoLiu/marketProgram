import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Text, Image} from '@tarojs/components'
import AvatarDefault from './icon_avatar_default.png'
import IconAdd from './icon_add.png'
import './index.scss';
import {request} from "../../util/request";
import '@tarojs/async-await'

class Index extends Component {
    config = {
        navigationBarTitleText: '小豆商家',
        enablePullDownRefresh: true
    };

    constructor(props) {
        super(props);
        this.state = {
            viewId: '',
            scrollViewHeight: 300,
            form: [],
            hasInvalid: false,
            userData: Taro.getStorageSync('userData')
        };
    }

    async initPage() {
        if (!Taro.getStorageSync('access_token')) {
            return Taro.reLaunch({url: '/pages/login/index'});
        }
        let systemInfo = await Taro.getSystemInfo();
        await request({
            url: '/merch/merchant/list', method: 'GET'
        }).then((res) => {
            let _indexedForm = [];
            let sortForm = res['data']['data'].sort((a, b) => {
                return a.firstLetter.localeCompare(b.firstLetter)
            });
            sortForm.map((value, index, arr) => {
                if (_indexedForm.length === 0) {
                    _indexedForm.push({
                        group: value.firstLetter,
                        list: new Array(value)
                    });
                } else {
                    if (value.firstLetter === arr[index - 1].firstLetter) {
                        _indexedForm[_indexedForm.length - 1]['list'].push(value)
                    } else {
                        _indexedForm.push({
                            group: value.firstLetter,
                            list: new Array(value)
                        });
                    }
                }
            });
            this.setState({form: _indexedForm}, () => {
                Taro.createSelectorQuery()
                    .select('#top-bar')
                    .boundingClientRect().exec((res) => this.setState({scrollViewHeight: systemInfo.windowHeight - res[0].height}));
            });
        });

        await request({
            url: '/merch/jobs/statistics-status',
            method: 'GET'
        }).then(res => {
            let a = res.data.data.find((f) => f.status === '失效');
            this.setState(
                {hasInvalid: a}
            );
        });

        Taro.stopPullDownRefresh()
    }

    toCompanyPage(merchId) {
        Taro.navigateTo({
            url: `/pages/company/index?merchId=${merchId}`
        })
    }

    toView(id) {
        this.setState({viewId: id})
    }

    toCompageactionPage() {
        return Taro.navigateTo({
            url: `/pages/company-action/index?disabled=false`
        })
    }

    toHomePage() {
        return Taro.navigateTo({
            url: `/pages/home/index`
        })
    }

    onPullDownRefresh() {
        return this.initPage()
    }

    componentDidShow() {
        return this.initPage()
    }

    render() {
        const {viewId, scrollViewHeight, form, hasInvalid} = this.state;
        return (
            <View className='index'>
                <View className='top-bar' id='top-bar'>
                    <View className='user-avatar' onClick={this.toHomePage.bind(this)}>
                        <Image src={AvatarDefault} className='user-avatar-img'/>
                        {hasInvalid ? <View className='dot'/> : null}
                        <Text>{userData.username}</Text>
                    </View>
                    <View className='btn-add' onClick={this.toCompageactionPage.bind(this)}>
                        <Image src={IconAdd} className='icon_add'/>
                    </View>
                </View>
                <View className='indexed-group' onClick={(e) => e.preventDefault()}>
                    {
                        form.map((f) => {
                            return <Text key={'indexed-group_' + f.group}
                                         onClick={this.toView.bind(this, f.group)}>{f.group}</Text>
                        })
                    }
                </View>
                <ScrollView
                    className='scroll-view'
                    scrollY={true}
                    style={{'height': scrollViewHeight + 'px'}}
                    scrollIntoView={viewId}
                    scrollWithAnimation>
                    {
                        form.map((f) => {
                            return <View key={f.group} id={f.group}>
                                <View className='list-group'>{f.group}</View>
                                <View>
                                    {
                                        f.list.map((m) => {
                                            return <View key={m.id} className='list-item'
                                                         onClick={this.toCompanyPage.bind(this, m.id)}>{m.merchantName}</View>
                                        })
                                    }
                                </View>
                            </View>
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}

export default Index
