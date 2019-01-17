import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Card, Table, Icon, Button, Modal, Form, Input, Select , message} from "antd"
import {reqCategorys , reqAddCategory} from "../../api"

const Item = Form.Item;
const Option = Select.Option;

export default class Category extends Component {

    state = {
        categorys: [],
        isShowAdd: false,
    };
    /**
     * 添加分类
     */
    addCategory = async () => {
        const {parentId , categoryName} = this.form.getFieldsValue();
        //请求添加分类
        const result = await reqAddCategory(parentId , categoryName);
        if (result.status === 0){
            message.success('添加成功');
            this.getCategorys();
        }
    };
    /**
     * 获取一级分类
     */
    getCategorys = async () => {
        const result = await reqCategorys('0');
        if (result.status === 0) {
            const categorys = result.data;
            //更新状态
            this.setState({
                categorys
            })
        }
    };

    componentWillMount() {
        this.columns = [{
            title: '品类名称',
            dataIndex: 'name',
        }
            , {
                title: '操作',
                width: 300,
                render: (category) => {
                    return (
                        <span>
                            <a href="javascript:;">修改分类</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="javascript:;">查看子分类</a>
                        </span>
                    )
                }
            }];
    }

    componentDidMount() {
        this.getCategorys();
    };

    render() {
        //得到列的数组
        const columns = this.columns;
        //得到分类的数组
        const {categorys, isShowAdd} = this.state;

        return (
            <div>
                <Card>
                    <span style={{fontsize: 20}}>一级分类列表</span>
                    <Button onClick={() => {
                        this.setState({isShowAdd: true})
                    }} type='primary' style={{float: 'right'}}>
                        <Icon type='plus'/>
                        添加分类
                    </Button>
                </Card>
                <Table
                    pagination={{defaultPageSize: 2, showSizeChanger: true, showQuickJumper: true}}
                    rowKey='_id'
                    columns={columns}
                    dataSource={categorys}
                    loading={categorys.length === 0}
                    bordered
                />
                <Modal
                    title="添加分类"
                    visible={isShowAdd}
                    onOk={this.addCategory}
                    onCancel={() => this.setState({isShowAdd: false})}>
                    <AddForm categorys={categorys} setForm = {(form) => this.form = form}></AddForm>
                </Modal>
            </div>
        );
    }
}

class AddForm extends Component {
    static propTypes = {
        categorys: PropTypes.array.isRequired,
        setForm: PropTypes.func.isRequired
    };
    componentWillMount() {
        this.props.setForm(this.props.form);
    }
    render() {
        //问,key________________________________________________________________________________________________________
        const {getFieldDecorator} = this.props.form;
        const {categorys} = this.props;
        return (
            <Form>
                <Item label='所属分类'>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: '0'
                        })(<Select>
                            <Option key='0'>一级标题</Option>
                            {
                                categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                            }
                        </Select>)
                    }
                </Item>
                <Item label='分类名称'>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: ''
                        })(<Input placeholder='请输入分类名称'/>
                        )
                    }
                </Item>
            </Form>
        );
    }
}

AddForm = Form.create()(AddForm);