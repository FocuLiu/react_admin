import React from 'react';
import {BrowserRouter ,Route ,Redirect,Switch} from "react-router-dom";
import Login from './pages/login/login'
import Admin from './pages/admin/admin'
// import Component from "echarts/src/view/Component";

export default class APP extends React.Component{
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path = '/login' component = {Login}/>
                    <Route path = '/' component = {Admin}/>
                    {/*<Route path = '/login' component = {Login}></Route>*/}
                    {/*<Route path = '/' component = {Admin}></Route>*/}
                </Switch>
            </BrowserRouter>
        );
    }
}