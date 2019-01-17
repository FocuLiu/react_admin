import React, {Component} from 'react'
import {withRouter} from "react-router-dom"
import {Row, Col , Modal} from "antd"
import './header.less'
import {reqWeather} from "../../api"
import {formateDate} from '../../utils/utils'
import StorageUtils from '../../utils/storageUtils'
import MemoryUtils from "../../utils/MemoryUtils"
import menuList from '../../config/menuConfig'

class Header extends Component {
    state = {
        sysTime: formateDate(Date.now()),
        dayPictureUrl: '',
        weather: ''
    };
    /**
     * 退出登陆
     */
    logout = () =>{
      Modal.confirm({
          content: '确定退出吗',
          onOk: () =>{
            //移除保存的user
              StorageUtils.removeUser();
              MemoryUtils.user = {};
            //跳转到login
              this.props.history.replace('/login');
          },
          onCancel(){

          }
      })
    };
    /**
     * 获取时间
     */
    getSysTime = () =>{
        this.intervalId = setInterval(() => {
            this.setState({
                sysTime: formateDate(Date.now())
            })
        }, 1000);
    };
    /**
     * 获取天气
     */
    getWeather = async () =>{
        const {dayPictureUrl , weather} = await reqWeather('北京');
        this.setState({
            dayPictureUrl,
            weather
        });
    };

    /**
     * 根据请求的path得到对应的标题
     */
    getTitle = (path) =>{
        let title = null;
        menuList.forEach(menu =>{
            if (menu.key === path){
                title = menu.title
            } else if (menu.children){
                menu.children.forEach(item =>{
                    if (item.key === path) {
                        title = item.title
                    }
                })
            }
        });
        return title
    };

    componentDidMount() {
       this.getSysTime();
       this.getWeather();
    };

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        const user = MemoryUtils.user;
        const {sysTime , dayPictureUrl , weather} = this.state;
        const path = this.props.location.pathname;
        // console.log(path);
        const title = this.getTitle(path);
        return (
            <div className='header'>
                <Row className='header-top'>
                    <span>欢迎,{user.username}</span>
                    <a href="javascript:" onClick={this.logout}>退出</a>
                </Row>
                <Row className='breadcrumb'>
                    <Col span={4} className='breadcrumb-title'>{title}</Col>
                    <Col span={20} className='weather'>
                        <span className='date'>{sysTime}</span>
                        <span className='weather-img'>
                            <img src={dayPictureUrl} alt="weather"/>
                        </span>
                        <span className='weather-detail'>{weather}</span>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default withRouter(Header);