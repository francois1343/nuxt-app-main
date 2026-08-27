<script setup>
const counter = ref(0)
const updateCounter = () => {
  counter.value++
}
</script>
<template>
  <button @click="updateCounter">{{ counter }}</button>
</template>