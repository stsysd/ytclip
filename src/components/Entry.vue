<template>
  <div class="pure-form x-rows">
    <fieldset class="x-cols">
      <input
        class="x-grow"
        type="url"
        placeholder="YouTube URL"
        v-model="link"
      />
      <button class="pure-button primary" @click="enter" :disabled="invalid">
        <icon icon-name="hand-scissors" />
        Clip!
      </button>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import Icon from "./Icon.vue";

export default defineComponent({
  emits: ["submit"],
  components: { Icon },
  setup(_, { emit }) {
    const link = ref<string>("");
    const videoId = computed(() => {
      try {
        const url = new URL(link.value);
        if (url.host !== "www.youtube.com" && url.host !== "youtube.com") {
          return null;
        }
        for (const [k, v] of url.searchParams) {
          if (k === "v") {
            return v;
          }
        }
        return null;
      } catch {
        return null;
      }
    });

    return {
      link,
      videoId,
      invalid: computed(() => videoId.value == null),
      enter() {
        if (videoId.value) emit("submit", videoId.value);
      }
    };
  }
});
</script>

<style scoped>
.pure-form > fieldset {
  font-size: 120%;
  width: 80%;
}
</style>
