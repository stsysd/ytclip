<template>
  <span ref="span" :style="style"> </span>
</template>
<script lang="ts">
import { dom, library } from "@fortawesome/fontawesome-svg-core";
import {
  faVolumeUp,
  faVolumeDown,
  faSearchPlus,
  faSearchMinus,
  faPlay,
  faPause,
  faForward,
  faBackward,
  faStepForward,
  faStepBackward,
  faArrowRight,
  faArrowLeft,
  faHandScissors
} from "@fortawesome/free-solid-svg-icons";
import {
  computed,
  defineComponent,
  PropType,
  onMounted,
  ref,
  watch
} from "vue";

library.add(
  faVolumeUp,
  faVolumeDown,
  faSearchPlus,
  faSearchMinus,
  faPlay,
  faPause,
  faForward,
  faBackward,
  faStepForward,
  faStepBackward,
  faArrowRight,
  faArrowLeft,
  faHandScissors
);
dom.watch();

type IconNames =
  | "volume-up"
  | "volume-down"
  | "search-plus"
  | "search-minus"
  | "play"
  | "pause"
  | "forward"
  | "backward"
  | "step-forward"
  | "step-backwoard"
  | "arrow-right"
  | "arrow-left"
  | "hand-scissors";

export default defineComponent({
  props: {
    iconName: {
      type: String as PropType<IconNames>,
      required: true
    },
    size: Number,
    color: String
  },
  setup(props) {
    const span = ref<HTMLSpanElement>();
    const classNames = computed(() => ["fas", "fa-fw", `fa-${props.iconName}`]);
    const style = computed(() => ({
      fontSize: `${props.size || 1}em`,
      color: props.color || "inherit"
    }));
    watch(classNames, () => {
      if (span.value == null) return;
      const el = document.createElement("i");
      el.className = classNames.value.join(" ");
      span.value.innerHTML = "";
      span.value.appendChild(el);
    });
    onMounted(() => {
      if (span.value == null) return;
      const el = document.createElement("i");
      el.className = classNames.value.join(" ");
      span.value.appendChild(el);
    });
    return { span, style };
  }
});
</script>
