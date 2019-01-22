import React, {Component} from 'react';
import {Button, Icon, Form, Select, Input ,message} from "antd";
import {reqCategorys , reqAddUpdataProduct} from '../../api/index';
import RichTextEditor from './rich-text-editor';
import PicturesWall from './pictures-wall';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Item = Form.Item;
const Option = Select.Option;

/**
 * 商品添加和更新
 */
class ProductAddUpdata extends Component {
  state = {
    categorys: [],
    SubCategorys: []
  };

  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId);
    const categorys = result.data;
    if (parentId === '0') {
      this.setState({
        categorys: categorys
      })
    } else {
      this.setState({
        SubCategorys: categorys
      },() => {
        this.props.form.setFieldsValue({
          category2: '未选择'
        })
      })
    }
  };
  /**
   * 根据状态中的分类数组组成Option
   */
  renderOptions = () => {
    const {categorys, SubCategorys} = this.state;
    const options = categorys.map(c => (
      <Option key={c._id} value={c._id}>{c.name}</Option>
    ));

    const subOptions = SubCategorys.map(c => (
      <Option key={c._id} value={c._id}>{c.name}</Option>
    ));
    return {options, subOptions};
  };

  /**
   * 显示二级分类列表
   */
  showSubCategory = (parentId) => {
    const product = this.props.location.state || {};
    product.categoryId = '';
    this.getCategorys(parentId);
  };

  /**
   * 添加更新产品
   */
  submit = async () => {
    const {name, desc, price, category1, category2} = this.props.form.getFieldsValue();
    let categoryId, pCategoryId = null;
    if (!category2 || category2 === '未选择') {
      pCategoryId = '0';
    } else {  //当前要添加的商品是二级分类下的
      categoryId = category2;
      pCategoryId = category1
    }
    //富文本边框的内容
    const detail = this.refs.editor.getContent();
    //得到所上传图片的文件名的数组
    const imgs = this.refs.imgs.getImg();
    const product = {name, desc, price, pCategoryId, categoryId, detail, imgs};
    const p = this.props.location.state;
    if (p){
      product._id = p._id;
    }
    const result = await reqAddUpdataProduct(product);
    if (result.status === 0){
      message.success('保存商品成功了')
    }else {
      message.error('保存商品失败了,请重新处理')
    }
    console.log('values', detail, imgs);
  };

  componentDidMount() {
    this.getCategorys('0');
    //如果当前是更新, 商品所属分类是二级分类
    const product = this.props.location.state;
    if (product && product.pCategoryId !== '0') {
      this.getCategorys(product.pCategoryId)
    }
  };

  render() {
    const {options, subOptions} = this.renderOptions();
    const product = this.props.location.state || {};
    console.log('-------------0', product);
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 2},
      wrapperCol: {span: 4}
    };
    let initialValue1 = '未选择';
    let initialValue2 = '未选择';
    if (product.pCategoryId === '0') {
      initialValue1 = product.categoryId
    } else if (product.pCategoryId) {
      initialValue1 = product.pCategoryId;
      initialValue2 = product.categoryId || '未选择';
      console.log(product);
    }
    return (
      <div>
        <h2>
          <a href="javascript:;" onClick={() => this.props.history.goBack()}>
            <Icon type='arrow-left'></Icon>
          </a>
          &nbsp; &nbsp; &nbsp;
          {product._id ? '编辑商品' : '添加商品'}
        </h2>
        <Form>
          <Item {...formItemLayout} label='商品名称'>
            {getFieldDecorator('name', {
              initialValue: product.name
            })(
              <Input placeholder='请输入商品名称'/>
            )}
          </Item>

          <Item labelCol={{span: 2}} wrapperCol={{span: 12}} label='商品描述'>
            {getFieldDecorator('desc', {
              initialValue: product.desc
            })(
              <Input placeholder='请输入商品名称'/>
            )}
          </Item>

          <Item labelCol={{span: 2}} label='商品分类'>
            {getFieldDecorator('category1', {
              initialValue: initialValue1
            })(
              <Select style={{width: 140}} onChange={value => this.showSubCategory(value)}>
                {options}
              </Select>
            )}
            &nbsp; &nbsp; &nbsp;

            {subOptions.length > 0 ? getFieldDecorator('category2', {
              initialValue: initialValue2
            })(
              <Select style={{width: 140}}>
                {subOptions}
              </Select>
            ) : null}
          </Item>

          <Item {...formItemLayout} label='商品价格'>
            {getFieldDecorator('price', {
              initialValue: product.price
            })(
              <Input placeholder='请输入商品' addonAfter='元'/>
            )}
          </Item>

          <Item label='商品图片' labelCol={{span: 2}}>
            <PicturesWall ref='imgs' imgs={product.imgs}></PicturesWall>
          </Item>

          <Item label='商品详情' labelCol={{span: 2}} wrapperCol={{span: 20}}>
            <RichTextEditor ref='editor' detail={product.detail}></RichTextEditor>
          </Item>

          <Button type='primary' onClick={this.submit}>提交</Button>

        </Form>
      </div>
    );
  }
}

export default Form.create()(ProductAddUpdata)