<script setup>
const { data: activities, pending, error, refresh } = await useFetch("/api/activities");

const newActivity = ref({
  title: "",
  duration: "",
});

const addActivity = async () => {
  await $fetch("/api/activities", {
    method: "POST",
    body: newActivity.value,
  });

  newActivity.value = { title: "", duration: "" };
  await refresh();
};

const deleteActivity = async (activity) => {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer ${activity.title} ?`,
  );

  if (!confirmed) {
    return;
  }

  await $fetch(`/api/activities/${activity.id}`, {
    method: "DELETE",
  });

  await refresh();
};
</script>

<template>
  <form @submit.prevent="addActivity">
    <h2>Ajouter une activité</h2>

    <label>
      Titre de l’activité
      <input v-model.trim="newActivity.title" type="text" required>
    </label>

    <label>
      Durée de l’activité
      <input v-model.trim="newActivity.duration" type="text" required>
    </label>

    <button type="submit">Ajouter</button>
  </form>

  <h1>Activités</h1>

  <p v-if="pending">Chargement…</p>
  <p v-else-if="error">Impossible de charger les activités.</p>

  <ul v-else>
    <li v-for="activity in activities" :key="activity.id">
      {{ activity.title }} — {{ activity.duration }}
      <button
        type="button"
        aria-label="Supprimer cette activité"
        title="Supprimer cette activité"
        @click="deleteActivity(activity)"
      >
        ×
      </button>
    </li>
  </ul>
</template>
