import {Upload, Icon, Modal, message} from 'antd';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {reqDeleteImg} from "../../api";

export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs: PropTypes.array
  };

  state = {
    previewVisible: false,
    previewImage: '',
    //包含了所有上传图片对象的相应信息
    fileList: [],
  };
  /**
   * 得到当前已经上传的图片文件名的数组
   */
  getImg = () =>{
    return this.state.fileList.map(file => file.name)
  };
  handleCancel = () => this.setState({previewVisible: false});

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = async ({file, fileList}) => {
    console.log('handleChange',file, fileList);
    if (file.status === 'done') {
      const result = file.response;
      if (result.status === 0) {
        message.success('上传成功');
        const {name, url} = result.data;
        file = fileList[fileList.length - 1];
        file.name = name;
        file.url = url;
      } else {
        message.error('上传失败');
      }
    }else if (file.status === 'removed'){
        const result = await reqDeleteImg(file.name);
        if (result.status === 0){
          message.success('删除图片成功');
        } else {
          message.error('删除图片失败')
        }
    }
    this.setState({fileList});
  };


  componentWillMount() {
    //如果传入了imgs, 生成一个对应的fileList,并更新fileList
    const imgs = this.props.imgs;
    console.log("-------------------------------------------------", imgs);
    if (imgs && imgs.length > 0) {
      const fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done', //loading 上传中   done 上传成功   remove 删除
        url: 'http://localhost:5000/upload/' + img
      }));
      this.state.fileList = fileList
    }
  }

  render() {
    const {previewVisible, previewImage, fileList} = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          accept="image/*"
          name="image"
          action="/manage/img/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}>
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </div>
    );
  }
}
