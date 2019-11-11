import shop from '@/api/shop'

export default {
  namespaced: true,

  state: {
    items: []
  },

  getters: {
    availableProducts(state, getters) {
      return state.items.filter(product => product.inventory > 0)
    },

    productIsInStock() {
      return product => product.inventory > 0
    },

    productByID(state, getters, rootState) {
      return cartItem =>
        rootState.products.items.find(({ id }) => id === cartItem.id)
    }
  },

  mutations: {
    setProducts(state, products) {
      state.items = products
    },

    // resetProductInventory(state, productInCart) {
    //   const product = state.items.find(item => item.id === productInCart.id)

    //   console.log(productInCart)

    //   product.inventory = product.inventory + productInCart.quantity
    // },

    decrementProductInventory(state, product) {
      product.inventory--
    },

    incrementProductInventory(state, product) {
      product.inventory++
    }
  },

  actions: {
    fetchProducts({ commit }) {
      return new Promise((resolve, reject) => {
        shop.getProducts(products => {
          commit('setProducts', products)
          resolve()
        })
      })
    }
  }
}
