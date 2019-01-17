import React , {Component} from 'react'
import './footer.less'
import {withRouter} from "react-router-dom";

class Footer extends Component{
    render() {
        console.log(this.props.location.pathname);
        return (
            <div className='footer'>
                推荐使用谷歌浏览器,可以获得更加的页面操作体验
            </div>
        );
    }
}
export default withRouter(Footer);