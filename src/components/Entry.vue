<template>
  <div class="centering">
    <div class="x-cols url-input-container">
      <input
        class="x-grow url-input"
        type="url"
        placeholder="YouTube URL to Clip"
        v-model="link"
        autofocurowss
      />
      <button
        :class="{ 'pure-button': true, monotone: invalid, primary: !invalid }"
        @click="enter"
        :disabled="invalid"
      >
        <icon icon-name="hand-scissors" />
      </button>
    </div>
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
.centering {
  margin-top: 80px;
}
.url-input-container {
  overflow: hidden;
  padding: 0;
  background-color: white;
  border-radius: 16px;
  width: 50%;
  font-size: 120%;
  border: solid 1px var(--light-shadow-color);
}

.url-input-container:focus-within {
  box-shadow: 0 0 2px var(--shadow-color);
}

.url-input {
  border: none;
  outline: none;
  padding: 0.5em 1em;
}

.pure-button {
  font-size: 120%;
  border-radius: 0;
  border-left: solid 1px var(--light-shadow-color);
}
</style>
