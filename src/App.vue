<template>
  <div id="layer" />
  <preview
    v-if="clip"
    :videoId="clip.videoId"
    :clipStart="clip.start"
    :clipEnd="clip.end"
    :title="clip.title"
    @back="onBack"
  />
  <editor v-else-if="videoId" :videoId="videoId" @clip="onClip" />
  <entry v-else @submit="onSubmit" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Entry from "./components/Entry.vue";
import Editor from "./components/Editor.vue";
import Preview from "./components/Preview.vue";

type Clip = {
  start: number;
  end: number;
  videoId: string;
  title: string;
};

export default defineComponent({
  components: { Editor, Entry, Preview },
  name: "App",
  setup() {
    const videoId = ref<string>();
    const clip = ref<Clip>();
    return {
      videoId,
      clip,
      onClip(c: Clip) {
        clip.value = c;
      },
      onSubmit(v: string) {
        videoId.value = v;
      },
      onBack() {
        clip.value = void 0;
      }
    };
  }
});
</script>

<style>
:root {
  --main-color: #27c7ff;
  --second-color: #ffb101;
  --ink-color: #303030;
  --shadow-color: #808080;
  --light-shadow-color: #e0e0e0;
  background-color: var(--light-shadow-color);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--ink-color);
  margin-top: 60px;
}

.primary {
  background-color: var(--main-color);
  color: white;
}

.monotone {
  background-color: var(--ink-color);
  color: white;
}

.transparent {
  background-color: transparent;
  color: var(--ink-color);
}

.transparent:hover,
.transparent:focus {
  background-image: none;
}
.transparent:active,
.transparent:focus {
  box-shadow: none;
  border: none;
}
.centering {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.x-rows {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0.5em 1em;
}

.x-rows > *:not(:last-child) {
  /* margin-bottom: 0.5em; */
}

.x-cols {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding: 0.5em 1em;
}
.x-cols > *:not(:last-child) {
  margin-right: 0.5em;
}

.x-grow {
  flex-grow: 1;
}
</style>
