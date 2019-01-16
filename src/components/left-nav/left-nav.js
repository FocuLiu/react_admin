import React , {Component} from 'react'
import './left-nav.less'
import {NavLink , withRouter} from "react-router-dom";
import {Menu , Icon} from "antd";
import {logo} from '../../assets/images/logo.png'

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

 class LeftNav extends Component{
    render() {
        //当前的请求路径
        const path = this.props.location.pathname;
        return (
            <div className='left-nav'>
                <NavLink to = '/home' className='logo'>
                    <img src="/static/media/logo.ba1f87ec.png" alt="logo"/>
                    <h1>硅谷后台</h1>
                </NavLink>

                    <Menu theme='dark' mode="inline" defaultSelectedKeys={[path]}>
                        <Item key = '/home'>
                            <NavLink to = '/home'>
                                <Icon type = 'windows'></Icon>首页
                            </NavLink>
                        </Item>

                        <SubMenu key="sub1" title={<span><Icon type="mail" /><span>商品</span></span>}>
                            <Item key="/category">
                                <NavLink to = '/category'>
                                    <Icon type = 'setting'/>分类管理
                                </NavLink>
                            </Item>
                            <Item key="/product">
                                <NavLink to = '/product'>
                                <Icon type = 'setting'/>商品管理
                                </NavLink>
                            </Item>
                        </SubMenu>
                    </Menu>

            </div>
        );
    }
}

export default withRouter(LeftNav)