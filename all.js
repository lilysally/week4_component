import pagination from "./pagination.js";
import modal from "./modal.js";
import delwindow from "./delwindow.js";

Vue.component("pagination", pagination);
Vue.component("modal", modal);
Vue.component("delwindow", delwindow);

new Vue({
  el: "#app",
  data: {
    products: [],
    pagination: {},
    tempProduct: {
      imageUrl: []
    },
    api: {
      uuid: "b0dc44d6-d675-48eb-8020-1d984631b476",
      path: "https://course-ec-api.hexschool.io/api/"
    },
    token: "",
    isNew: "",
    loadingBtn: ""
  },
  methods: {
    updateProduct() {},
    openModal(isNew, item) {
      switch (isNew) {
        case "new":
          this.tempProduct = { imageUrl: [] };
          $("#productModal").modal("show");
          break;
        case "edit":
          this.loadingBtn = item.id;
          //Backend 後台 - Show product. 取得單一商品細節。
          //GET api/{uuid}/admin/ec/product/{id}
          const url = `${this.api.path}${this.api.uuid}/admin/ec/product/${item.id}`;
          axios.get(url).then(res => {
            this.tempProduct = res.data.data;
            $("#productModal").modal("show");
            this.loadingBtn = "";
          });
          break;
        case "delete":
          $("#delProductModal").modal("show");
          this.tempProduct = Object.assign({}, item);
          break;
        default:
          break;
      }
    },
    delProduct() {
      if (this.tempProduct.id) {
        const id = this.tempProduct.id;
        this.products.forEach((item, i) => {
          if (item.id === id) {
            this.products.splice(i, 1);
            this.tempProduct = { imageUrl: [] };
          }
        });
      }
      $("#delProductModal").modal("hide");
    },
    getProducts() {
      //GET api/{uuid}/admin/ec/products

      const url = `${this.api.path}${this.api.uuid}/admin/ec/products`;
      axios.get(url).then(res => {
        console.log(res);
        this.products = res.data.data;
        this.pagination = res.data.meta.pagination;
      });

      if (this.tempProduct.id) {
        this.tempProduct = { imageUrl: [] };
        $("#productModal").modal("hide");
      }
    }
  },
  created() {
    //取得token,var myCookie = document.cookie.replace(/(?:(?:^|.*;\s*)test2\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    this.token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = `Bearer ${this.token}`;
    console.log(this.token);
    // 若無法取得 token 則返回 Login 頁面
    if (this.token === "") {
      window.location = "Login.html";
    }
    this.getProducts();
  }
});
