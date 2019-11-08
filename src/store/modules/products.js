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
    }

    // indexOfProduct(state) {
    //   return product => state.items.findIndex(({ id }) => id === product.id)
    // }
  },

  mutations: {
    setProducts(state, products) {
      state.items = products
    },

    resetProductInventory(state, productInCart) {
      const indexOfProduct = state.items.findIndex(
        ({ id }) => id === productInCart.id
      )

      state.items[indexOfProduct].inventory =
        state.items[indexOfProduct].inventory + productInCart.quantity
    },

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
