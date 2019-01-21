import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default class RichTextEditor extends Component{

  static propTypes = {
    detail: PropTypes.string
  };

  state = {
    editorState: EditorState.createEmpty(),
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
  /**
   * 得到的富文本数据
   */
  getContent = () =>{
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
  };

  componentWillMount() {
    const detail = this.props.detail;
    console.log(detail);
    if (detail){
      const blocksFromHtml = htmlToDraft(detail);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      const editorState = EditorState.createWithContent(contentState);
      this.state.editorState = editorState;
    }
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          //决定了初始值
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}
