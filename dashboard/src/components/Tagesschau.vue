<template>
  <div v-show="url" class="tagesschau">
    <!-- <iframe src="https://www.tagesschau.de/multimedia/video/video-827857~player.html" width="1080" height="608" frameBorder="0" scrolling="no"/> -->
    <div class="video">
      <video ref="video" :src="url" controls playsinline autoplay class="videob" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: null,
    };
  },
  mounted() {
    this.$refs.video.onended = () => {
      this.url = null;
    };

    // setTimeout(() => {
    //   this.url = 'https://download.media.tagesschau.de/video/2021/0223/TV-20210223-2035-4900.webl.h264.mp4';
    //   this.$nextTick(() => {
    //     const x = this.$refs.video.play();


    //     if (x !== undefined) {
    //       x.then(() => {
    //         // Automatic playback started!
    //         console.log('playy');
    //       }).catch((error) => {
    //         // Automatic playback failed.
    //         // Show a UI element to let the user manually start playback.
    //         console.log(error);
    //       });
    //     }
    //   });
    // }, 500);
  },
};
</script>

<style scoped>
.tagesschau {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.85);
  z-index: 10;
}

.video {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.videob {
  width: 1200px;
  display: block;
}
</style>
