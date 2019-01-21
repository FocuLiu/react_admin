import React , {Component} from 'react'
import {Switch , Route , Redirect} from "react-router-dom";

import ProductIndex from './index'
import ProductAddUpdata from './saveupdata'
import ProductDetail from "./detail";
import './product.less'
/**
 * 管理的商品管理路由组件
 */
export default class Product extends Component{
    render() {
        return (
            <Switch>
                <Route path='/product/index' component={ProductIndex}/>
                <Route path='/product/saveupdata' component = {ProductAddUpdata}/>
                <Route path='/product/detail' component={ProductDetail}/>
                <Redirect to = '/product/index'/>
            </Switch>
        );
    }
}