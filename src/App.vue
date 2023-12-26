<script setup>
import { ref, watch, provide, computed } from 'vue';

import Header from './components/Header.vue';
import Drawer from './components/Drawer.vue';

/* Корзина start */
const cart = ref([]);

const drawerIsOpen = ref(false);

const drawerOpenHandler = () => {
  drawerIsOpen.value = !drawerIsOpen.value;
};

const totalPrice = computed(() => cart.value.reduce((acc, cur) => acc + cur.price, 0));
const taxPrice = computed(() => Math.round((totalPrice.value * 5) / 100));

const addToCart = (item) => {
  cart.value.push(item);
  item.isAdded = true;
};

const removeFromCart = (item) => {
  cart.value.splice(cart.value.indexOf(item), 1);
  item.isAdded = false;
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
    @on-click-remove="removeFromCart"
    :totalPrice="totalPrice"
    :taxPrice="taxPrice"
  />
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl shadow-grey-200 mt-20">
    <Header @drawer-handler="drawerOpenHandler" :totalPrice="totalPrice" />

    <div class="p-10">
      <router-view></router-view>
    </div>
  </div>
</template>
