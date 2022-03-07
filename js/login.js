// 串接登入 API

const url = 'https://vue3-course-api.hexschool.io/v2';
const path = 'erinhuang-lab';

const loginApp = Vue.createApp ({
    data() {
        return {
            user: {
                username: '',
                password: '',
            }
        }
    },
    
    methods: {
        login () {
            axios.post(`${url}/admin/signin`, this.user)
            .then((res) => {
                // 將 token 存在 cookie
                const { token, expired } = res.data;
                document.cookie = `userToken=${token}; expires=${new Date(expired)}GMT;`;
                // 跳轉頁面
                window.alert(`${res.data.message}，即將進入商品頁面`);
                window.location.href = 'update-product.html';
            })
            .catch((error) => {
                window.alert(`登入失敗，請重新輸入一次`);
                console.dir(error);
            })
        }
    }
    
    })
    
loginApp.mount('#loginApp');

export const loginObj = {
    url, path, loginApp, loginApp.mount('#loginApp')
}
