<script setup>
const { data: fruits, refresh } = await useFetch("/api/fruits");

const newFruit = ref({
  label: "",
});

const addFruit = async () => {
  await $fetch("/api/fruits", {
    method: "POST",
    body: newFruit.value,
  });

  newFruit.value.label = "";
  await refresh();
};

const deleteFruit = async (fruit) => {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer ${fruit.label} ?`,
  );
  if (!confirmed) {
    return;
  }
  await $fetch(`/api/fruits/${fruit.id}`, {
    method: "DELETE",
  });
  await refresh();
};
</script>

<template>
  <h1>Nos fruits</h1>

  <ul>
    <li v-for="fruit in fruits" :key="fruit.id">
      {{ fruit.label }}
      <button type="button" aria-label="Supprimer ce fruit" title="Supprimer ce fruit" @click="deleteFruit(fruit)">
        ×
      </button>
    </li>
  </ul>

  <h2>Nouveau fruit</h2>

  <form @submit.prevent="addFruit">
    <input v-model="newFruit.label" type="text" placeholder="Nom du fruit">
    <button type="submit">Ajouter</button>
  </form>
</template>
