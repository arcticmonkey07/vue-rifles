<script setup>
import { ref, inject, computed } from 'vue';
import axios from 'axios';

import CartItem from './CartItem.vue';
import InfoBlock from './InfoBlock.vue';

const props = defineProps({
  totalPrice: Number,
  taxPrice: Number
});
defineEmits(['drawerHandler', 'onClickRemove']);

const { cart } = inject('cart');

const isCreating = ref(false);
const orderId = ref(null);

const createOrder = async () => {
  try {
    isCreating.value = true;

    const { data } = await axios.post(`https://62690b738c0081b0.mokky.dev/orders`, {
      items: cart.value,
      totalPrice: props.totalPrice.value
    });

    cart.value = [];

    orderId.value = data.id;
  } catch (e) {
    console.log(e);
  } finally {
    isCreating.value = false;
  }
};

const buttonDisabled = computed(() => isCreating.value || cartIsEmpty.value);
const cartIsEmpty = computed(() => cart.value.length === 0);
</script>

<template>
  <div class="fixed z-10 top-0 h-full w-full bg-black opacity-70" @click="$emit('drawerHandler')" />
  <div
    class="flex flex-col justify-between fixed h-full z-10 top-0 h-full right-0 w-96 bg-white px-10 py-7 overflow-y-scroll"
  >
    <h2 class="text-2xl font-bold mb-10 flex items-center gap-5">
      <svg
        @click="$emit('drawerHandler')"
        class="rotate-180 hover:-translate-x-1 opacity-30 hover:opacity-100 transition cursor-pointer"
        width="16"
        height="14"
        viewBox="0 0 16 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 7H14.7143"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.71436 1L14.7144 7L8.71436 13"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Корзина
    </h2>
    <div class="flex flex-col flex-1">
      <div v-auto-animate class="flex flex-col gap-5 mb-20" v-if="totalPrice">
        <CartItem
          v-for="rifle in cart"
          :key="rifle.id"
          :title="rifle.title"
          :price="rifle.price"
          :img="rifle.imageUrl"
          :onClickRemove="() => $emit('onClickRemove', rifle)"
        />
      </div>

      <InfoBlock
        v-if="!totalPrice && !orderId"
        title="Корзина пустая"
        description="Добавьте хотя бы одну винтовку, чтобы сделать заказ"
        image-url="/package-icon.png"
      />

      <InfoBlock
        v-if="orderId"
        title="Заказ оформлен!"
        :description="`Ваш заказ #${orderId} скоро будет передан курьерской доставке`"
        image-url="/order-success-icon.png"
      />

      <div v-if="cart.length">
        <div class="flex flex-col gap-5">
          <div class="flex items-end gap-2">
            <span>Итого:</span>
            <div class="flex-1 border-b border-dashed" />
            <span class="font-bold">{{ totalPrice + taxPrice }} руб.</span>
          </div>

          <div class="flex items-end gap-2">
            <span>Налог 5%:</span>
            <div class="flex-1 border-b border-dashed" />
            <span class="font-bold">{{ taxPrice }} руб.</span>
          </div>
        </div>

        <button
          class="flex justify-center items-center gap-3 w-full py-3 mt-10 bg-lime-500 text-white rounded-xl transition active:bg-lime-700 hover:bg-lime-600 disabled:bg-lime-200 disabled:text-slate-300"
          @click="createOrder"
          :disabled="buttonDisabled"
        >
          Оформить заказ
        </button>
      </div>
    </div>
  </div>
</template>
