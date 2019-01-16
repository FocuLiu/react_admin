import React, {Component} from 'react';
import './login.less'
import PropTypes from 'prop-types'
import {reqLogin} from '../../api'
import MemoryUtils from '../../utils/MemoryUtils'
import storageUtils from '../../utils/storageUtils'
import {Form, Input, Button, Icon} from "antd";
import logo from '../../assets/images/logo.png'

export default class Login extends Component {

    state = {
      errorMsg:''
    };

    //请求后台登陆
    login = async (username , password) => {
        console.log(reqLogin);
        const result = await reqLogin(username, password);
        if (result.status === 0){
            const user = result.data;
            storageUtils.saveUser(user);
            MemoryUtils.user = user;
            console.log(MemoryUtils.user);
            this.props.history.push('/admin');
        } else {
            const errorMsg = result.msg;
            this.setState({errorMsg})
        }
    }
    ;

    render() {
        return (
            <div className='login'>
                <div className='login-header'>
                    <img src={logo} alt="尚硅谷后台管理系统"/>
                </div>
                <div className="login-content">
                    <div className="login-box">
                        <div className="error-msg-wrap">
                            <div className={this.state.errorMsg ? "show" : ""}>
                                {this.state.errorMsg}
                            </div>
                        </div>
                        <div className="title">用户登陆</div>
                        <LoginForm ref="login" login={this.login}/>
                    </div>
                </div>
            </div>
        );
    }
}

class LoginForm extends React.Component {

    static propTypes = {
      login: PropTypes.func.isRequired
    };

    clickLogin = (e) => {
        e.preventDefault();
        //对表单数据进性验证,如果没有错误,调用父组件的login方法
        this.props.form.validateFields((err , values)=>{
            if (!err){
                this.props.login(values.username, values.password);
            }else {
                this.props.form.resetFields();
            }
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form className='login-form'>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{validator: this.checkUsername},
                            {
                                type: 'string',
                                required: true,
                                whitespace: true,
                                message: '请输入账户名'
                            },
                            {
                                min: 4,
                                max: 6,
                                message: '账户名必须是4到6位'
                            }]
                    })(
                        <Input placeholder="username" prefix={<Icon type="user"/>}/>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [
                            // {validator: this.checkUsername},
                            {
                                type: 'string',
                                required: true,
                                whitespace: true,
                                message: '请输入密码!!!'
                            },
                            {
                                min: 4,
                                max: 8,
                                message: '密码必须是4到8位'
                            }
                        ]
                    })(
                        <Input type="password" placeholder="密码" prefix={<Icon type="safety"/>}/>
                    )}
                </Form.Item>

                <Form.Item>
                    <Button type="primary" onClick={this.clickLogin} className="login-form-button">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

LoginForm = Form.create({})(LoginForm);
