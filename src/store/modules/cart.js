import shop from '@/api/shop'

export default {
  namespaced: true,

  state: {
    items: [],
    checkoutStatus: null
  },

  getters: {
    cartProducts(state, getters, rootState, rootGetters) {
      return state.items.map(cartItem => {
        const product = rootState.products.items.find(
          ({ id }) => id === cartItem.id
        )
        const { title, price } = product

        return {
          title,
          price,
          quantity: cartItem.quantity,
          id: cartItem.id
        }
      })
    },

    cartTotal(state, getters) {
      let total = 0

      getters.cartProducts.forEach(product => {
        total = total + product.price * product.quantity
      })

      return total
    }
  },

  mutations: {
    pushProductToCart(state, productID) {
      state.items.push({
        id: productID,
        quantity: 1
      })
    },

    incrementItemQuantity(state, cartItem) {
      cartItem.quantity++
    },

    decrementItemQuantity(state, cartItem) {
      const itemInCart = state.items.find(item => item.id === cartItem.id)

      if (!itemInCart) return

      itemInCart.quantity--
    },

    setCheckoutStatus(state, status) {
      state.checkoutStatus = status
    },

    emptyCart(state) {
      state.items = []
    },

    removeProduct(state, productID) {
      state.items = state.items.filter(({ id }) => id !== productID)
    }
  },

  actions: {
    addProductToCart(
      { state, getters, commit, rootState, rootGetters },
      product
    ) {
      if (!rootGetters['products/productIsInStock'](product)) return

      const cartItem = state.items.find(({ id }) => id === product.id)

      if (!cartItem) {
        commit('pushProductToCart', product.id)
      } else {
        commit('incrementItemQuantity', cartItem)
      }

      commit('products/decrementProductInventory', product, { root: true })
    },

    removeProductFromCart({ commit }, product) {
      commit('products/resetProductInventory', product, { root: true })
      commit('removeProduct', product.id)
    },

    checkout({ state, commit }) {
      shop.buyProducts(
        state.cart,
        () => {
          commit('emptyCart')
          commit('setCheckoutStatus', 'success')
        },
        () => {
          commit('setCheckoutStatus', 'fail')
        }
      )
    },

    increaseBasketQuantity({ dispatch, rootState }, cartItem) {
      const product = rootState.products.items.find(
        ({ id }) => id === cartItem.id
      )

      return dispatch('addProductToCart', product)
    },

    decreaseBasketQuantity({ commit, rootState, dispatch }, cartItem) {
      const product = rootState.products.items.find(
        ({ id }) => id === cartItem.id
      )

      if (cartItem.quantity === 1) {
        dispatch('removeProductFromCart', product)
      }

      if (product.inventory > 1) {
        commit('decrementItemQuantity', cartItem)
      }

      commit('products/incrementProductInventory', product, { root: true })
    }
  }
}
