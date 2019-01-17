import ajax from './ajax'
import jsonp from 'jsonp'

export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST');

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