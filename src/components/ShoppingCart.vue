<template>
  <div>
    <h2>Shopping Cart</h2>
    <ul>
      <li v-for="product in cartProducts" v-bind:key="product.id">
        {{ product.title }} – {{ product.price | currency }} – {{ product.quantity }}
        <button
          @click="increaseBasketQuantity(product)"
          :disabled="!productIsInStock(product)"
        >+</button>
        <button @click="decreaseBasketQuantity(product)">-</button>
        <button @click="removeProductFromCart(product)">Remove</button>
      </li>
    </ul>
    <p>Total: {{ total | currency }}</p>
    <p v-if="checkoutStatus">{{ checkoutStatus }}</p>
    <button :disabled="!items.length" @click="checkout">Checkout</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters("cart", {
      cartProducts: "cartProducts",
      total: "cartTotal",
      productIsInStock: "productIsInStock"
    }),

    ...mapGetters("products", {
      productByID: "productByID"
    }),

    ...mapState("cart", {
      checkoutStatus: state => state.checkoutStatus,
      items: state => state.items
    })
  },

  methods: {
    ...mapActions("cart", {
      checkout: "checkout",
      removeProductFromCart: "removeProductFromCart",
      increaseBasketQuantity: "increaseBasketQuantity",
      decreaseBasketQuantity: "decreaseBasketQuantity"
    })
  }
};
</script>

<style scoped></style>
