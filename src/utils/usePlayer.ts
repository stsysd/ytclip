import {
  ref,
  onMounted,
  Ref,
  onUnmounted,
} from "vue";
import { YouTubePlayer } from "youtube-player/dist/types";
import createYoutubePlayer from "youtube-player";
import EventEmitter from "eventemitter3";

export type PlayerState =
  | "unstarted"
  | "ended"
  | "playing"
  | "paused"
  | "buffering"
  | "video-cued";

export class PlayerController extends EventEmitter {
  static id = 0;
  player?: YouTubePlayer;
  element?: HTMLDivElement;
  intervalHandle = 0;

  mount(container: Ref<HTMLElement | null>, videoId: string): void {
    onMounted(() => {
      this.element = document.createElement("div");
      this.element.id = `youtube-player-${PlayerController.id++}`;
      container.value?.appendChild(this.element);
      this.player = createYoutubePlayer(this.element.id, {
        videoId: videoId,
        width: 640,
        height: 360,
        playerVars: {
          controls: 0,
          autoplay: 1
        }
      });

      this.player.on("ready", async event => {
        this.emit("ready", {
          duration: await this.player?.getDuration(),
          title: (event.target as any).getVideoData().title
        });
      });

      this.player?.on("stateChange", async ({ data }) => {
        let state: PlayerState | "" = "";
        switch (data) {
          case -1:
            state = "unstarted";
            break;
          case 0:
            state = "ended";
            break;
          case 1:
            state = "playing";
            break;
          case 2:
            state = "paused";
            break;
          case 3:
            state = "buffering";
            break;
          case 5:
            state = "video-cued";
            break;
        }
        if (state) {
          this.emit("stateChange", { state });
        }
      });

      this.intervalHandle = window.setInterval(async () => {
        this.emit("tick", { time: await this.player?.getCurrentTime() });
      }, 1000 / 30);
    });

    onUnmounted(() => {
      if (this.intervalHandle) clearInterval(this.intervalHandle);
    });
  }

  async play(): Promise<void> {
    await this.player?.playVideo();
  }

  async pause(): Promise<void> {
    await this.player?.pauseVideo();
  }

  async stop(): Promise<void> {
    await this.player?.stopVideo();
  }

  async seek(sec: number, ahead: boolean): Promise<void> {
    if (this.player == null) return;
    sec = Math.min(sec, await this.player.getDuration());
    sec = Math.max(0, sec);
    await this.player.seekTo(sec, ahead);
    this.emit("seeked", { time: sec });
  }

  async getVolume(): Promise<number> {
    return (await this.player?.getVolume()) || 0;
  }

  async setVolume(v: number): Promise<void> {
    v = Math.round(v);
    v = Math.max(0, v);
    v = Math.min(v, 100);
    await this.player?.setVolume(v);
  }
}

export function usePlayer(
  videoId: string
): { container: Ref<HTMLElement | null>, ctrl: PlayerController } {
  const container = ref<HTMLElement | null>(null);
  const ctrl = new PlayerController();
  ctrl.mount(container, videoId);
  return { container, ctrl };
}
