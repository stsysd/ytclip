<template>
  <div ref="el"></div>
</template>

<script lang="ts">
declare const twttr: any;
import { defineComponent, ref, onMounted } from "vue";
export default defineComponent({
  props: {
    url: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const el = ref<HTMLElement>();
    onMounted(async () => {
      await twttr.widgets.createShareButton(props.url, el.value, {
        text: props.text,
      });
      emit("ready");
    });
    return { el };
  },
});
</script>