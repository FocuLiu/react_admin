import ajax from './ajax'
import jsonp from 'jsonp'

/**
 * 接口请求
 * @param username
 * @param password
 */

//登录请求
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST');
//添加用户
export const reqAddUser = (user) => ajax('/manage/user/add',user,'POST');
//获取一级/二级分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list' , {parentId});
//添加分类
export const reqAddCategory = (parentId , categoryName) => ajax('/manage/category/add' , {parentId , categoryName} , 'POST');
//更新分类
export const reqUpdataCategory = (categoryId , categoryName) => ajax('/manage/category/update' , {categoryId , categoryName}, 'POST');
//获取指定页商品分页列表
export const reqProducts = (pageNum , pageSize) => ajax('/manage/product/list',{pageNum , pageSize});
//搜索商品分页列表
export const reqSearchProducts = (pageNum , pageSize , searchType , searchName) => ajax('/manage/product/search' , {
    pageNum ,
    pageSize ,
    [searchType]: searchName
});
//删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete' , {name} , 'POST');

export function reqWeather(city) {
    return new Promise((resolve, reject)=>{
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
        //发送请求
        jsonp(url , {param:'callback'}, (err , data)=>{
            if (!err){
                //请求成功,调用resolve传递数据
                const {dayPictureUrl,weather} = data.results[0].weather_data[0];
                resolve({dayPictureUrl,weather})
            }else {
                alert('请求天气接口出错了')
            }
        })
        //如果成功了,调用reslove传递数据
        //如果出错了,显示提示
    })
    
}