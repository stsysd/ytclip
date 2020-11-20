<template>
  <div>
    <div class="youtube">
      <iframe
        :src="embedded"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>
    <tweet-button :text="title" :url="sharedUrl" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import TweetButton from "./TweetButton.vue";

const MAX_URL_LENGTH = 4096;

export default defineComponent({
  components: { TweetButton },
  props: {
    prefix: {
      type: String,
      default: `${document.location.protocol}//${document.location.hostname}/clip`
    },
    videoId: {
      type: String,
      required: true
    },
    clipStart: {
      type: Number,
      required: true
    },
    clipEnd: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const sharedUrl = computed(
      () =>
        props.prefix +
        `?v=${props.videoId}` +
        `&r=${props.clipStart}-${props.clipEnd}` +
        `&t=${encodeURIComponent(props.title)}`
    );
    const isUrlOver = computed(() => sharedUrl.value.length > MAX_URL_LENGTH);

    const embedded = computed(
      () =>
        `https://www.youtube.com` +
        `/embed/${props.videoId}` +
        `?start=${props.clipStart}&end=${props.clipEnd}`
    );

    return { sharedUrl, isUrlOver, embedded };
  }
});
</script>
