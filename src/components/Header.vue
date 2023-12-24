<script setup>
defineProps({
  totalPrice: Number,
})
</script>

<template>
  <header class="flex justify-between border-b border-slate-200 px-10 py-8">
    <router-link class="flex items-center gap-4" to="/">
      <img src="/logo.png" alt="Logo" class="w-20" />
      <div>
        <h2 class="font-bold text-xl uppercase">Vue Machines, Rifles</h2>
        <p class="text-slate-400">Магазин лучших автоматов</p>
      </div>
    </router-link>

    <ul class="flex items-center gap-10">
      <li class="flex items-center gap-3 cursor-pointer" @click="$emit('drawerHandler')">
        <img src="/cart.svg" alt="Cart" />
        <b>{{  totalPrice }} руб.</b>
      </li>
      <router-link class="flex items-center gap-3 cursor-pointer" to="/favorites">
        <img src="/heart.svg" alt="Favorite" />
        <span>Закладки</span>
      </router-link>
      <li class="flex items-center gap-3 cursor-pointer">
        <img src="/profile.svg" alt="Favorite" />
        <span>Профиль</span>
      </li>
    </ul>
  </header>
</template>
