/*
能发送ajax请求的函数模块
  包装axios
  函数的返回值是promise对象
  axios.get()/post()返回的就是promise对象
  返回自己创建的promise对象:
      统一处理请求异常
      异步返回结果数据, 而不是包含结果数据的response
 */
import axios from 'axios'
import {message} from "antd";
//为了消化自己的错误
export default function ajax(url , data = {} , methed = 'GET') {
    return new Promise(function (resolve, reject) {
        let promise = null;
        //执行ajax异步请求
        if (methed === 'GET') {
            promise = axios.get(url , {params:data});
        }else {
            promise = axios.post(url , data);
        }
        promise.then(response =>{
            //都得到的是用户信息
            resolve(response.data);
        }).catch(error =>{
            message.error('请求错误: ' + error.message);
        })
    });
}

// async function reqLogin() {
//   const result = await ajax('/login', {username: 'tom', password: '123'}, 'POST');
//   if(result.status===0) {
//     alert('成功了')
//   } else {
//     alert('失败了')
//   }
// }

// const promise = new Promise(function (resolve, reject) {
//     setTimeout(() => {
//         reject()
//     }, 1000)
// })
// promise.then(function () {
//     console.log('-------')
// })