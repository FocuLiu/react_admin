import React, {Component} from 'react'
import './left-nav.less'
import {NavLink, withRouter} from "react-router-dom";
import {Menu, Icon} from "antd";
import {logo} from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

class LeftNav extends Component {

  getMenuNodes = (menus) => {
    return menus.reduce((pre, item) => {
      if (item.children) {
        const subMenu = (
          <SubMenu key={item.key}
                   title={<span><Icon type={item.type}/><span>{item.title}</span></span>}>
            {
              this.getMenuNodes(item.children)
            }
          </SubMenu>
        );
        pre.push(subMenu);

        const path = this.props.location.pathname;
        console.log(path);
        const cItem = item.children.find((child => path.indexOf(child.key) === 0));
        console.log(cItem);
        if (cItem){
          this.openKey = item.key;
          this.selectKey = cItem.key;
        }
      } else {
        const menuItem = (
          <Item key={item.key}>
            <NavLink to={item.key}>
              <Icon type={item.icon}/>{item.title}
            </NavLink>
          </Item>
        );
        pre.push(menuItem)
      }
      return pre
    }, [])
  };

  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList);
  }

  render() {
    //当前的请求路径
    const path = this.selectKey || this.props.location.pathname;
    return (
      <div className='left-nav'>
        <NavLink to='/home' className='logo'>
          <img src="/static/media/logo.ba1f87ec.png" alt="logo"/>
          <h1>硅谷后台</h1>
        </NavLink>
        <Menu theme='dark' mode="inline" defaultSelectedKeys={[path]} defaultOpenKeys={[this.openKey]}>
          {this.menuNodes}
        </Menu>

      </div>
    );
  }
}

export default withRouter(LeftNav)