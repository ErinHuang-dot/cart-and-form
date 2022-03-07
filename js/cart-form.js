/* global axios bootstrap */


// 表單驗證
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 輸入字元立即進行驗證；若註解掉，在UI操作時焦點離開輸入框後才會進行驗證
});

const url = 'https://vue3-course-api.hexschool.io/v2';
const path = 'erinhuang-lab';

const cartApp = Vue.createApp ({
    data() {
        return {
            products: [],
            cartData: [],
            productId: '',
            isLoadingItem:'', // 用是否正在載入，來改變按鈕的點擊狀態
            orderData: {
                user: {
                    name:'',
                    email:'',
                    tel:'',
                    address:'',
                },
                message:''
            },
            isLoading: false
        }
    },

    methods: {
        getProducts() {
            this.isLoading = true;
            axios.get(`${url}/api/${path}/products/all`)
            .then((res) => {
                this.isLoading = false;
                this.products = res.data.products.slice(0, 5);
            })
            .catch((error) => {
                window.alert('喔...不，暫時無法取得商品資料，請稍候再試');
            })           
        },
        openProductModal(id) {
            this.productId = id;
            this.$refs.moreModal.openModal(id);
            //  元件的getOneProduct() 觸發放置位置1
        },
        getCartData() {
            axios.get(`${url}/api/${path}/cart`)
            .then((res) => {
                this.cartData = res.data.data; // 需取得包含價格的資料
            })
            .catch((error) => {
                window.alert(error.data.data.message);
            })              
        },
        addToCart(id, qty = 1) { // 預設商品數量為1
            const data = {
                product_id: id,
                qty
            };
            this.isLoadingItem = id; // 觸發時也存取id

            axios.post(`${url}/api/${path}/cart`, { data }) // 需帶入商品資料
            .then((res) => {
                this.getCartData();
                this.$refs.moreModal.closeModal();
                this.isLoadingItem = ''; //觸發後清空id
            })
            .catch((error) => {
                window.alert(error.data.data.message);
            })  
        },
        removeCartItem(id) {
            this.isLoadingItem = id; 

            axios.delete(`${url}/api/${path}/cart/${id}`) 
            .then((res) => {
                this.getCartData();
                this.isLoadingItem = ''; 
            })
            .catch((error) => {
                window.alert(error.data.message);
            })              
        },
        updateCartItem(item) { 
            const data = {
                product_id: item.id,
                qty: item.qty
            };
            this.isLoadingItem = item.id; 

            axios.put(`${url}/api/${path}/cart/${item.id}`, { data })
            .then((res) => {
                this.getCartData();
                this.isLoadingItem = ''; 
            })
            .catch((error) => {
                window.alert(error.response.data.message);
            })  
        },
        deleteCartData(id) {
            this.isLoadingItem = id;

            axios.delete(`${url}/api/${path}/carts`)
            .then((res) => {
                alert('您確定要移除購物車內所有商品嗎？');
                this.getCartData();
                this.isLoadingItem = ''; 
            })
            .catch((error) => {
                window.alert(error.response.data.message);
            })  
        },
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/;
            // const phoneNumber = /(^[0-9]{2,4}\-[0-9]{5,8}$)|(^\([0-9]{2,4}\)[0-9]{5,8}$)|^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼';
        },
        onSubmit() {            
            const data = this.orderData;
            console.log(this.cartData.carts);
            if (this.cartData.carts.length !== 0) {

                axios.post(`${url}/api/${path}/order`, { data }) 
                .then((res) => {
                    alert(res.data.message);
                })
                .catch((error) => {
                    console.log(error.response.data.message);
                })

                this.cartData.carts = [];
                this.cartData.total = 0;
            } else {
                alert('購物車內尚未加入商品，繼續看看有沒有喜歡的！');
            }
        }
    },

    mounted() {
        this.getProducts();
        this.getCartData();
    },
})

cartApp.component('more-modal', {
    props: ['id'],
    template: '#moreProductModal',
    data() {
        return {
            modal: {},
            product: {},
            qty: 1 //最小數量
        };
    },
    watch: { //  元件的getOneProduct() 觸發放置位置2: 讓元件封裝更徹底
        id() {
            this.getOneProduct();
        }
    },
    methods: {
        openModal() {
            this.modal.show();
            this.qty = 1;
        },
        closeModal() {
            this.modal.hide();
        },
        getOneProduct() {
            axios.get(`${url}/api/${path}/product/${this.id}`)
            .then((res) => {
                this.product = res.data.product;
            })
            .catch((error) => {
                window.alert('喔...不，暫時無法取得商品資料，請稍候再試');
            }) 
        }, 
        addToCart(id) {
            this.$emit('add-cart', id, this.qty);
        }           
    },

    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal);

    }
});


cartApp.component('loading', VueLoading.Component);

cartApp.component('VForm', VeeValidate.Form);
cartApp.component('VField', VeeValidate.Field);
cartApp.component('ErrorMessage', VeeValidate.ErrorMessage);

cartApp.mount('#cartApp');












