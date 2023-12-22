<script setup>
import { ref, onMounted, watch, reactive } from 'vue';
import axios from 'axios';

import Header from './components/Header.vue';
import CardList from './components/CardList.vue';
import Drawer from './components/Drawer.vue';

const items = ref([]);
const cart = ref([]);

const drawerIsOpen = ref(false);

const drawerOpenHandler = () => {
  drawerIsOpen.value = !drawerIsOpen.value;
};

const filters = reactive({
  sortBy: '',
  searchQuery: ''
});

const addToCart = (item) => {
  if (!item.isAdded) {
    cart.value.push(item);
    item.isAdded = true;
  } else {
    cart.value.splice(cart.value.indexOf(item), 1);
    item.isAdded = false;
  }

  console.log(cart);
};

const onChangeSelect = (e) => {
  filters.sortBy = e.target.value;
};

const onChangeSearchInput = (e) => {
  filters.searchQuery = e.target.value;
};

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get('https://62690b738c0081b0.mokky.dev/favorites');

    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.parentId === item.id);

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

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        parentId: item.id
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

onMounted(async () => {
  await fetchItems();
  await fetchFavorites();
});
watch(filters, fetchItems);
</script>

<template>
  <Drawer v-if="drawerIsOpen" @drawer-handler="drawerOpenHandler" />
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl shadow-grey-200 mt-20">
    <Header @drawer-handler="drawerOpenHandler" />

    <div class="p-10">
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

      <CardList :items="items" @addToFavorite="addToFavorite" @addToCart="addToCart" />
    </div>
  </div>
</template>
