import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Card, Table, Icon, Button, Modal, Form, Input, Select, message} from "antd"
import {reqCategorys, reqAddCategory, reqUpdataCategory} from "../../api"

const Item = Form.Item;
const Option = Select.Option;

export default class Category extends Component {

    state = {
        parentId: '0',
        parentName: '',
        categorys: [],
        subCategorys: [],
        isShowAdd: false,
        isShowUpdate: false
    };
    /**
     * 添加分类
     */
    addCategory = async () => {
        //隐藏对话框
        this.setState({
            isShowAdd: false
        });
        //得到输入框的值
        const {parentId, categoryName} = this.form.getFieldsValue();
        //清空输入框的缓存
        this.form.resetFields();
        //请求添加分类
        const result = await reqAddCategory(parentId, categoryName);
        if (result.status === 0) {
            message.success('添加成功');
            //无法描述
            if (parentId === this.state.parentId || parentId === '0'){
                this.getCategorys(parentId);
            }
        }
    };
    /**
     * 更新分类
     */
    updateCategory = async () => {
        const categoryId = this.category._id;
        //得到输入的值
        const categoryName = this.form.getFieldValue('categoryName');
        //清空输入框的缓存
        this.form.resetFields();
        const result = await reqUpdataCategory(categoryId, categoryName);
        if (result.status === 0) {
            message.success('修改成功');
            this.getCategorys();
        }
        //隐藏添加框
        this.setState({
            isShowUpdate: false
        });
    };
    /**
     * 获取一级或二级分类
     */
    getCategorys = async (pId) => {
        const parentId = pId || this.state.parentId;
        console.log('getCategorys', parentId);
        const result = await reqCategorys(parentId);
        if (result.status === 0) {
            const categorys = result.data;
            //更新状态
            if (parentId === '0') {
                this.setState({
                    categorys
                })
            } else {
                this.setState({
                    subCategorys: categorys
                })
            }

        }
    };

    /**
     *  显示
     */
    showUpdate = (category) => {
        //保存分类对象
        this.category = category;
        //显示更新分类的Modal
        this.setState({
            isShowUpdate: true
        })
    };

    /**
     * 显示一级分类
     */
    showCategorys = () =>{
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    };

    /**
     *  显示二级分类列表
     */
    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            this.getCategorys();
        });
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
                    console.log(category);
                    return (
                        <span>
                            <a href="javascript:;"
                               onClick={() => this.showUpdate(category)}>修改分类</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="javascript:;" onClick={() => this.showSubCategorys(category)}>查看子分类</a>
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
        const {categorys, subCategorys, parentId, parentName, isShowAdd, isShowUpdate} = this.state;
        const category = this.category || {};

        return (
            <div>
                <Card>
                    {
                        parentId === '0' ?
                            <span style={{fontsize: 20}}>一级分类列表</span> : (
                                <span>
                                    <a href="javascript:;" onClick={this.showCategorys}>一级分类</a>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <Icon type = 'arrow-right'></Icon>
                                    <span>{parentName}</span>
                                </span>
                            )
                    }
                    <Button onClick={() => {
                        this.setState({isShowAdd: true})
                    }} type='primary' style={{float: 'right'}}>
                        <Icon type='plus'/>
                        添加分类
                    </Button>
                </Card>
                <Table
                    pagination={{defaultPageSize: 7, showSizeChanger: true, showQuickJumper: true}}
                    rowKey='_id'
                    columns={columns}
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    loading={categorys.length === 0}
                    bordered
                />
                <Modal
                    title="添加分类"
                    visible={isShowAdd}
                    onOk={this.addCategory}
                    onCancel={() => this.setState({isShowAdd: false})}>
                    <AddForm categorys={categorys} parentId = {parentId} setForm={(form) => this.form = form}></AddForm>
                </Modal>

                <Modal
                    title="更新分类"
                    visible={isShowUpdate}
                    onOk={this.updateCategory}
                    onCancel={() => this.setState({isShowUpdate: false})}>
                    <UpdateForm categoryName={category.name} setForm={(form) => this.form = form}></UpdateForm>
                </Modal>
            </div>
        );
    }
}

class AddForm extends Component {
    static propTypes = {
        categorys: PropTypes.array.isRequired,
        setForm: PropTypes.func.isRequired,
        parentId: PropTypes.string.isRequired
    };

    componentWillMount() {
        this.props.setForm(this.props.form);
    }

    render() {
        //问,key________________________________________________________________________________________________________
        const {getFieldDecorator} = this.props.form;
        const {categorys , parentId} = this.props;
        return (
            <Form>
                <Item label='所属分类'>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId
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

class UpdateForm extends Component {
    static propTypes = {
        categoryName: PropTypes.string,
        setForm: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.props.setForm(this.props.form);
    }

    render() {
        //问,key________________________________________________________________________________________________________
        const {getFieldDecorator} = this.props.form;
        const {categoryName} = this.props;
        console.log("categoryName", categoryName);
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: categoryName
                        })(<Input placeholder='请输入分类名称'/>
                        )
                    }
                </Item>
            </Form>
        );
    }
}

UpdateForm = Form.create()(UpdateForm);