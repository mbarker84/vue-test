<template>
  <div>
    <h1>Products</h1>
    <p v-if="loading">Loading...</p>
    <ul v-else>
      <li v-for="product in products" v-bind:key="product.id">
        {{ product.title }} - {{ product.price | currency }} - {{ product.inventory }}
        <button
          :disabled="!productIsInStock(product)"
          @click="addProductToCart(product)"
        >Add to cart</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      loading: false
    };
  },

  computed: {
    ...mapState({
      products: state => state.products.items
    }),

    ...mapGetters("products", {
      productIsInStock: "productIsInStock"
    })
  },

  methods: {
    ...mapActions({
      fetchProducts: "products/fetchProducts",
      addProductToCart: "cart/addProductToCart"
    })
  },

  created() {
    this.loading = true;
    this.fetchProducts().then(() => (this.loading = false));
  }
};
</script>

<style scoped>
</style>
