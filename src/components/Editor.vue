<template>
  <div class="editor centering" v-show="ready">
    <div class="container x-rows dense">
      <div class="righted">
        <drawer iconName="volume-up">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            v-model.number="volume"
            style="width: 100%"
          />
        </drawer>
      </div>
      <div ref="container" class="screen"></div>
      <divider />
      <controller
        v-model:scale="scale"
        :playing="isPlaying"
        @toggle="togglePlaying"
        @seek-to-clip-start="seekToClipStart"
        @seek-to-clip-end="seekToClipEnd"
        @set-clip-start="setClipStart"
        @set-clip-end="setClipEnd"
      >
        [{{ clipStart }}-{{ clipEnd }}] {{ currentSeconds }}/{{ duration }}
      </controller>
      <divider />
      <timeline
        v-show="ready"
        :duration="duration"
        :currentTime="currentTime"
        :scale="scale"
        v-model:clipStart="clipStart"
        v-model:clipEnd="clipEnd"
        @update:currentTime="onUpdateCurrentTime"
      />
      <divider />
      <div class="x-cols pure-form bottom" :playing="isPlaying">
        <input type="text" v-model="title" style="width: 80%" />
        <button class="pure-button primary" @click="onClip">
          <icon icon-name="hand-scissors" />
          Clip!
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { usePlayer, PlayerState } from "../utils/usePlayer";
import Timeline from "./Timeline.vue";
import Controller from "./Controller.vue";
import Drawer from "./Drawer.vue";
import Divider from "./Divider.vue";
import Icon from "./Icon.vue";

export default defineComponent({
  components: {
    Timeline,
    Controller,
    Drawer,
    Icon,
    Divider
  },
  props: {
    videoId: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const { container, ctrl } = usePlayer(props.videoId);

    const title = ref<string>("");
    const duration = ref<number>(0);
    const state = ref<PlayerState>("unstarted");
    const volume = ref<number>(0);
    const scale = ref<number>(1);
    const currentTime = ref<number>(0);

    const _clipStart = ref<number>(0);
    const clipStart = computed({
      get() {
        return Math.floor(Math.max(0, _clipStart.value));
      },
      set(value: number) {
        _clipStart.value = Math.max(0, value);
      }
    });

    const _clipEnd = ref<number>(Infinity);
    const clipEnd = computed({
      get() {
        return Math.ceil(Math.min(_clipEnd.value, duration.value));
      },
      set(value: number) {
        _clipEnd.value = Math.ceil(Math.min(value, duration.value));
      }
    });

    ctrl.once("ready", async e => {
      duration.value = e.duration;
      title.value = e.title;
      await ctrl.setVolume(volume.value);
    });

    ctrl.on("stateChange", e => {
      state.value = e.state;
    });

    ctrl.on("tick", ({ time }) => {
      if (state.value === "playing") {
        currentTime.value = time;
      }
    });

    ctrl.on("seeked", ({ time }) => {
      currentTime.value = time;
    });

    watch(volume, () => ctrl.setVolume(volume.value));

    return {
      emit,
      container,
      duration,
      currentTime,
      title,
      volume,
      scale,
      clipStart,
      clipEnd,
      currentSeconds: computed(() => Math.floor(currentTime.value)),
      ready: computed(() => duration.value > 0),

      isPlaying: computed(() => state.value === "playing"),
      togglePlaying() {
        if (state.value === "playing") {
          ctrl.pause();
        } else {
          ctrl.play();
        }
      },

      setClipStart() {
        clipStart.value = Math.floor(
          Math.min(clipEnd.value, currentTime.value)
        );
      },
      setClipEnd() {
        clipEnd.value = Math.floor(
          Math.max(clipStart.value, currentTime.value)
        );
      },
      seekToClipStart() {
        ctrl.seek(clipStart.value, true);
      },
      seekToClipEnd() {
        ctrl.seek(clipEnd.value, true);
      },
      onUpdateCurrentTime(t: number) {
        ctrl.seek(t, true);
      },
      onClip() {
        const e = {
          start: clipStart.value,
          end: clipEnd.value,
          videoId: props.videoId,
          title: title.value
        };
        emit("clip", e);
      }
    };
  }
});
</script>

<style scoped>
.righted {
  position: absolute;
  top: 0;
  display: flex;
  justify-content: end;
  padding: 1em;
}

.editor > .container {
  position: relative;
  width: 80%;
  background-color: var(--ink-color);
  padding: 0;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-top: solid 1px var(--shadow-color);
  border-bottom: solid 1px var(--shadow-color);
  box-sizing: border-box;
}

.editor > .container > * {
  box-sizing: border-box;
  width: 100%;
}

.screen {
  box-sizing: border-box;
  overflow: hidden;
  padding-top: 2em;
  padding-bottom: 2em;
}
</style>
