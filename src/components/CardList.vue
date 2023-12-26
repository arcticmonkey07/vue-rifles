<script setup>
import Card from './Card.vue';

defineProps({
  items: Array,
  isFavorites: Boolean
});

const emit = defineEmits(['addToFavorite', 'addToCart']);

</script>

<template>
  <div class="grid grid-cols-3 gap-10" v-auto-animate>
    <Card
      v-for="rifle in items"
      :key="rifle.id"
      :id="rifle.id"
      :title="rifle.title"
      :price="rifle.price"
      :img="rifle.imageUrl"
      :onClickFavorite="isFavorites ? null : () => emit('addToFavorite', rifle)"
      :onClickAdd="isFavorites ? null : () => emit('addToCart', rifle)"
      :isFavorite="rifle.isFavorite"
      :isAdded="rifle.isAdded"
    />
  </div>
</template>
