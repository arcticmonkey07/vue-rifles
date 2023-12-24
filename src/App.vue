<script setup>
import { ref, watch, provide, computed } from 'vue';

import Header from './components/Header.vue';
import Drawer from './components/Drawer.vue';
import Home from './pages/Home.vue';

/* Корзина start */
const cart = ref([]);
const isCreatingOrder = ref(false);

const drawerIsOpen = ref(false);

const drawerOpenHandler = () => {
  drawerIsOpen.value = !drawerIsOpen.value;
};

const totalPrice = computed(() => cart.value.reduce((acc, cur) => acc + cur.price, 0));

const taxPrice = computed(() => Math.round((totalPrice.value * 5) / 100));

const cartIsEmpty = computed(() => cart.value.length === 0);

const cartButtonDisabled = computed(() => isCreatingOrder.value || cartIsEmpty.value);

const addToCart = (item) => {
  cart.value.push(item);
  item.isAdded = true;
};

const removeFromCart = (item) => {
  cart.value.splice(cart.value.indexOf(item), 1);
  item.isAdded = false;
};

const createOrder = async () => {
  try {
    isCreatingOrder.value = true;
    const { data } = await axios.post(`https://62690b738c0081b0.mokky.dev/orders`, {
      items: cart.value,
      totalPrice: totalPrice.value
    });

    cart.value = [];

    return data;
  } catch (e) {
    console.log(e);
  } finally {
    isCreatingOrder.value = false;
  }
};

watch(
  cart,
  () => {
    localStorage.setItem('cart', JSON.stringify(cart.value));
  },
  { deep: true }
);

provide('cart', {
  cart,
  drawerOpenHandler,
  addToCart,
  removeFromCart
});
/* Корзина end */

</script>

<template>
  <Drawer
    v-if="drawerIsOpen"
    @drawer-handler="drawerOpenHandler"
    :cart="cart"
    @on-click-remove="removeFromCart"
    :totalPrice="totalPrice"
    :taxPrice="taxPrice"
    :createOrder="createOrder"
    :cart-button-disabled="cartButtonDisabled"
  />
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl shadow-grey-200 mt-20">
    <Header @drawer-handler="drawerOpenHandler" :totalPrice="totalPrice" />

    <div class="p-10">
      <router-view></router-view>
    </div>
  </div>
</template>
