import React , {Component} from 'react'
import {Switch , Route , Redirect} from "react-dom";

import ProductIndex from './index'
import ProductSaveUpdata from './saveUpdata'
import ProductDetail from "./detail";
/**
 * 管理的商品管理路由组件
 */
export default class Product extends Component{
    render() {
        return (
            <Switch>
                <Route path='/product/index' component={ProductIndex}/>
                <Route path='/product/saveUpdata' component={ProductSaveUpdata}/>
                <Route path='/product/detail' component={ProductDetail}/>
                <Redirect to = '/product/index'/>
            </Switch>
        );
    }
}