import React,{Component} from 'react';
import {Redirect , Switch ,Route} from "react-router-dom";
import MemoryUtils from  '../../utils/MemoryUtils';
import {Row , Col} from "antd";
import LeftNav from '../../components/left-nav/left-nav'
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'

import Home from '../home/home'
import Product from '../product/product'
import Category from '../category/categroy'
import './admin.less'

export default class Admin extends Component{
    render() {
        // const user = storageUtils.getUser();
        const user = MemoryUtils.user;        //存在内村中
        console.log(user);
        if (!user || !user._id){
            // this.props.history.replace('/login');   // 用在事件回调函数中
            // return <Redirect to = '/login'/>
        }
        return (
            <Row className='container'>
                <Col span = {4}>
                    <LeftNav></LeftNav>
                </Col>
                <Col span={20} className='main'>
                    <Header></Header>
                    <div className='content'>
                        <Switch>
                            <Route path = '/home' component = {Home}></Route>
                            <Route path = '/category' component = {Category}></Route>
                            <Route path = '/product' component = {Product}></Route>
                            <Redirect to = '/home'/>
                        </Switch>
                    </div>
                    <Footer></Footer>
                </Col>
            </Row>
        );
    }
}