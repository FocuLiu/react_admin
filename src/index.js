import React from 'react';
import {render} from 'react-dom'
import App from './APP'
import MemoryUtils from './utils/MemoryUtils'
import storageUtils from "./utils/storageUtils";
/**
 * 读取内存中的user 如果存在,则保存在内存中
 */
let user = storageUtils.getUser();
if (user){
    MemoryUtils.user = user;
}
render(<App/>,document.getElementById('root'));

