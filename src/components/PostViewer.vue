<template>
<div class="columns">
  <div class="column" />
  <div class="column is-two-thirds">
    <router-link
      v-if="canEdit"
      :to="`/posts/${post.id}/edit`"
      class="button is-link is-rounded"
      data-test="can-edit"
    >
      Edit
    </router-link>
    <h1>{{ post.title }}</h1>
    <div v-html="post.html" />
  </div>
  <div class="column" />
</div>
  
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router';
import { useStore } from '../store';

export default defineComponent({
  name: 'PostViewer',

  async setup(props) {
    const store = useStore();
    const id = useRoute().params.id as string;

    if (!store.getState().posts.loaded) {
      await store.fetchPosts()
    }

    const post = store.getState().posts.all.get(id);

    if (!post) {
      throw Error('Post was not found')
    }

    const canEdit = post.authorId === store.getState().authors.currentUserId

    return {
      post,
      canEdit
    }
  }
});
</script>