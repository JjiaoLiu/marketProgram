import Taro, {Component} from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import IconInvalid from './icon_invalid.png';
import IconSetting from './icon_setting.png';
import IconStay from './icon_stay.png';
import IconSure from './icon_sure.png';
import IconSured from './icon_sured.png';
import IconBack from './icon_back.png';
import IconMenu from './icon_menu.png';
import IconAvatarDefault from './icon_avatar_default.png'
import './index.scss'
import './../../app.scss'
import {request} from "../../util/request";


class Home extends Component {
    config = {
        navigationBarTitleText: '小豆商家',
        enablePullDownRefresh: true
    };

    constructor(props) {
        super(props);
        this.state = {
            tabModel: [{count: 0, status: "待确认", icon: IconSure, className: 'icon_sure'},
                {count: 0, status: "对接中", icon: IconStay, className: 'icon_stay'},
                {count: 0, status: "已确认", icon: IconSured, className: 'icon_sured'},
                {count: 0, status: "失效", icon: IconInvalid, className: 'icon_invalid'}],
            tab: [],
            userData: Taro.getStorageSync('userData')
        }
    }

    toSettingPage() {
        return Taro.navigateTo({url: '/pages/setting/index'})
    }

    toJoblistPage(current) {
        return Taro.navigateTo({url: '/pages/job-list/index?current=' + current})
    }

    onPullDownRefresh() {
        this.init()
    }

    componentDidShow() {
        this.init()
    }

    init() {
        request({
            url: '/merch/jobs/statistics-status',
            method: 'GET'
        }).then(res => {
            let data = this.state.tabModel.map((f) => {
                let a = res.data.data.find((m) => f.status === m.status);
                if (a) return Object.assign({}, f, a);
                return f
            });
            this.setState((prevState) => {
                Taro.stopPullDownRefresh();
                return {tab: data}
            });
        })
    }

    render() {
        const {tab} = this.state;
        return (
            <View className='home'>
                <View className='info'>
                    <Image src={IconAvatarDefault} className='icon_avatar_default'/>
                    <Text className='username'>Hi~{userData.username}</Text>
                </View>
                <View className='work'>
                    <View className='title'>
                        <View className='left'>
                            <Image src={IconMenu} className='icon_menu'/>
                            <Text className='title-txt'>我录入的职位</Text>
                        </View>
                        <View className='right' onClick={this.toJoblistPage.bind(this, 0)}>
                            <Text className='all'>查看全部</Text>
                            <Image src={IconBack} className='icon_back'/>
                        </View>
                    </View>
                    <View className='list'>
                        {
                            tab.map((f, index) => {
                                return <View className='list-item' key={index}
                                             onClick={this.toJoblistPage.bind(this, index + 1)}>
                                    <Image src={f.icon} className={f.className}/>
                                    <Text className='list-title'>{f.status}</Text>
                                    {f.status === '失效' ? (f.count !== 0 ? <Text className='list-dot'>{f.count}</Text> :
                                        null) : (f.count > 99 ? <Text className='list-brand'>99+</Text> :
                                        <Text className='list-brand'>{f.count}</Text>)}
                                </View>
                            })
                        }

                    </View>
                </View>
                <View className='system'>
                    <View className='list' onClick={this.toSettingPage.bind(this)}>
                        <View className='left'>
                            <Image src={IconSetting} className='icon_setting'/>
                            <Text className='title'>设置</Text>
                        </View>
                        <View>
                            <Image src={IconBack} className='icon_back'/>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

export default Home
