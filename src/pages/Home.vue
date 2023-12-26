<script setup>
import { ref, inject, reactive, watch, onMounted, provide } from 'vue';
import axios from 'axios';
import debounce from 'lodash.debounce';

import CardList from '../components/CardList.vue';

const { cart, addToCart, removeFromCart } = inject('cart');

const items = ref([]);

const filters = reactive({
  sortBy: '',
  searchQuery: ''
});

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item);
  } else {
    removeFromCart(item);
  }
};

const onChangeSelect = (e) => {
  filters.sortBy = e.target.value;
};

const onChangeSearchInput = debounce((event) => {
  filters.searchQuery = event.target.value;
}, 300);

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        rifle_id: item.id
      };
      const { data } = await axios.post(`https://62690b738c0081b0.mokky.dev/favorites`, obj);

      item.isFavorite = true;
      item.favoriteId = data.id;
    } else {
      await axios.delete(`https://62690b738c0081b0.mokky.dev/favorites/${item.favoriteId}`);
      item.isFavorite = false;
      item.favoriteId = null;
    }
  } catch (e) {
    console.log(e);
  }
};

const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy
    };

    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`;
    }

    const { data } = await axios.get('https://62690b738c0081b0.mokky.dev/rifles', {
      params
    });

    items.value = data.map((obj) => ({
      ...obj,
      isFavorite: false,
      favoriteId: null,
      isAdded: false
    }));
  } catch (e) {
    console.log(e);
  }
};

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get('https://62690b738c0081b0.mokky.dev/favorites');

    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.rifle_id === item.id);

      if (!favorite) {
        return item;
      }

      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id
      };
    });
  } catch (e) {
    console.log(e);
  }
};

onMounted(async () => {
  const localCart = localStorage.getItem('cart');
  cart.value = localCart ? JSON.parse(localCart) : [];

  await fetchItems();
  await fetchFavorites();

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }));
});

watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false
  }));
});

watch(filters, fetchItems);

provide('item', {
  items
});
</script>

<template>
  <div class="flex justify-between items-center mb-10">
    <h1 class="text-3xl font-bold">Все винтовки</h1>
    <div class="flex items-center gap-4">
      <select
        class="py-2 px-3 border border-gray-200 focus:border-gray-400 rounded-md focus:outline-none"
        @change="onChangeSelect"
      >
        <option value="name">По названию</option>
        <option value="price">По цене (дешевые)</option>
        <option value="-price">По цене (дорогие)</option>
      </select>
      <div class="relative">
        <input
          type="text"
          class="border border-gray-200 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:border-gray-400"
          placeholder="Поиск..."
          @input="onChangeSearchInput"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <img src="/search.svg" />
        </div>
      </div>
    </div>
  </div>

  <CardList :items="items" @add-to-favorite="addToFavorite" @add-to-cart="onClickAddPlus" />
</template>
