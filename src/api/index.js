import ajax from './ajax'

export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST');

// const reqLogin = function reLogin(username,password) {
//     return ajax('/login', {username, password}, 'POST');
// };