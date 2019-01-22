import React, {Component} from 'react'
import {Card, Input, Icon, Button, Select, Table} from "antd";
import {reqProducts ,reqSearchProducts , reqUpdateProductStatus} from '../../api/index'

const Option = Select.Option;
/**
 * 商品管理界面的主界面路由
 */
export default class ProductIndex extends Component {
  state = {
    products: [], //当前页数据
    total: 0,
    searchType: 'productName', //默认搜索类型
    searchName: ''  // 搜算关键字
  };

  updateProductStatus = async (productId , status) =>{
    const result = await reqUpdateProductStatus(productId , status);
    if (result.status === 0){
      this.getProducts(this.pageNum || 1);
    }
  };

  //初始化表格所需要的数组
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => <span>￥{price}</span>
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (status , product) => {
        let btnText = '下架';
        let statusText = '在售';

        if (status === 2){
          let btnText = '上架';
          let statusText = '已下架';
        }

        status = status === 1 ? 2 : 1 ;
          return(
            <span>
            <Button type='primary' onClick={() => this.updateProductStatus(product._id , status )}>{btnText}</Button>
              &nbsp;&nbsp;
              <span>{statusText}</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        render: (product) => (<span>
            <a href="javascripts:;" onClick={() =>this.props.history.push('/product/detail' , product)}>详情</a>
            &nbsp;&nbsp;&nbsp;
            <a href="javascripts:;" onClick={() => this.props.history.push('/product/saveupdata' , product)}>修改</a>
          </span>)
      }
    ]
  };

  //异步请求指定页的数据
  getProducts = async (pageNum) =>{
    const {searchType, searchName} = this.state;
    let result = null;
    if (searchName){  //搜索分页
      result = await reqSearchProducts(pageNum , 4 , searchType , searchName);
    } else {  //一般分页
      result = await reqProducts(pageNum , 4);
    }
    if (result.status === 0){
      const {total , list} = result.data;
      this.setState({
        total,
        products : list
      })
    }
  };

  componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getProducts(1);
  }

  render() {
    const {products , total , searchType} = this.state;
    console.log('total',total);
    return (
      <div>
        <Card>
          <Select value={searchType} onChange={(value) => this.setState({searchType: value})}>
            <Option key='productName' value='productName'>按名称搜索</Option>
            <Option key='productDesc' value='productDesc'>按描述搜索</Option>
          </Select>
          <Input style={{width: 150, marginLeft: 10, marginRight: 10}} placeholder='关键字'
          onChange = {(e) => this.setState({searchName: e.target.value})}/>
          <Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
          <Button type='primary' style={{float: 'right'}} onClick={() => this.props.history.push('/product/saveupdata')}>
            <Icon type='plus'></Icon>
            添加商品
          </Button>
        </Card>

        <Table
          bordered
          rowKey='_id'
          columns={this.columns}
          dataSource={products}
          loading={products.length === 0}
          pagination={{defaultPageSize: 4,
            total: total ,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: this.getProducts
          }}
        />

      </div>
    );
  }
}