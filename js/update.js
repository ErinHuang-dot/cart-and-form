let updateModal = {};
let deleteModal = {};

const updateApp = Vue.createApp ({
    data() {
        return {
            user: {
                username: '',
                password: ''
            },
            products: [],
            tempProduct: {
                imagesUrl: [],
            },
            isNew: false,
        }
    },
  
    methods: {
        checkLogin() {
            axios.post(`${url}/api/user/check`)
            .then((res) => {
                this.getProducts();
            })            
            .catch((error) => {
                window.alert(`驗證失敗，請重新登入`);
                window.location.href = 'index.html';                
            })
        },
        getProducts() {
            axios.get(`${url}/api/${path}/admin/products`)
            .then((res) => {
                this.products = res.data.products;
            })
            .catch((error) => {
                window.alert('error');
            })   
        },
        openModal(status, product) {
            // 新增、編輯共用的判斷
            if (status === 'isNew') {
                this.tempProduct = {
                    imagesUrl: []
                }
                updateModal.show();
                this.isNew = true;
            } else if (status === 'edit') {
                this.tempProduct = { ...product }
                updateModal.show();  
            // 刪除的判斷        
            } else if (status === 'delete') {
                this.tempProduct = { ...product }
                deleteModal.show();
            }
        },
        updateProduct() {
            let newUrl = `${url}/api/${path}/admin/product`;
            let method = 'post';
            // 如果是編輯模式，api位址和介接方法變動為
            if (!this.isNew) {
                newUrl = `${url}/api/${path}/admin/product/${this.tempProduct.id}`;
                method = 'put';            
            }

            axios[method](newUrl, { data: this.tempProduct})
            .then((res) => {
                this.getProducts();
                updateModal.hide();
            })
            .catch((error) => {
                console.dir(error);
            })
        },
        deleteProduct() {
            let newUrl = `${url}/api/${path}/admin/product/${this.tempProduct.id}`;
            axios.delete(newUrl, { data: this.tempProduct})
            .then((res) => {
                deleteModal.hide();
                this.getProducts();       
            })
            .catch((error) => {
                console.dir(error);
            })
        }
    },

    mounted() {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;

        this.checkLogin();

        updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
        deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        
    }
  
  })
  
  updateApp.mount('#updateApp');