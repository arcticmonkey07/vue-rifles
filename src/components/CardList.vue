<script setup>
import Card from './Card.vue';

defineProps({
  items: Array
});

const emit = defineEmits(['addToFavorite', 'addToCart']);

</script>

<template>
  <div class="grid grid-cols-3 gap-10">
    <Card
      v-for="rifle in items"
      :key="rifle.id"
      :id="rifle.id"
      :title="rifle.title"
      :price="rifle.price"
      :img="rifle.imageUrl"
      :onClickFavorite="() => emit('addToFavorite', rifle)"
      :isFavorite="rifle.isFavorite"
      :onClickAdd="() => emit('addToCart', rifle)"
      :isAdded="rifle.isAdded"
    />
  </div>
</template>
