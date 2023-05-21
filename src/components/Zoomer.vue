<template>
  <div>
    <canvas ref="myCanvas" @wheel="zoomdezoom"></canvas>
    <button @click="resetZoom">Réinitialiser le zoom</button>
  </div>
</template>
  
  <script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Zoomer",

  data() {
    return {
      canvas: null,
      context: null,
      image: null,
      zoomFactor: 1,
      zoomIncrement: 0.1,
      point: { x: 30, y: 70 },
    };
  },

  mounted() {
    this.canvas = this.$refs.myCanvas;
    this.context = this.canvas.getContext("2d");
    this.initCanvas();
  },

  methods: {
    initCanvas() {
      this.image = new Image();
      this.image.onload = () => {
        this.canvas.width = this.image.width;
        this.canvas.height = this.image.height;

        this.context.drawImage(this.image, 0, 0);
        this.context.beginPath();
        this.context.fillStyle = "red";
        this.context.arc(this.point.x, this.point.y, 5, 0, 2 * Math.PI);
        this.context.fill();
      };

      this.image.src = "/assets/images/left.jpg";
    },

    zoomdezoom(event) {
      event.preventDefault();
      const delta = event.deltaY || event.detail || event.wheelDelta;

      const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - this.canvas.getBoundingClientRect().top;

      const zoomRatioX = mouseX / this.canvas.width;
      const zoomRatioY = mouseY / this.canvas.height;

      if (delta < 0) {
        this.zoomFactor += this.zoomIncrement;
      } else {
        this.zoomFactor -= this.zoomIncrement;
      }

      this.zoomFactor = Math.max(1, this.zoomFactor);
      this.zoomFactor = Math.min(3, this.zoomFactor);

      const zoomedWidth = this.image.width * this.zoomFactor;
      const zoomedHeight = this.image.height * this.zoomFactor;

      const offsetX = mouseX - zoomRatioX * zoomedWidth;
      const offsetY = mouseY - zoomRatioY * zoomedHeight;

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.translate(offsetX, offsetY);
      this.context.drawImage(this.image, 0, 0, zoomedWidth, zoomedHeight);
      this.context.translate(-offsetX, -offsetY);

      this.point.x *= this.zoomFactor;
      this.point.y *= this.zoomFactor;

      this.context.beginPath();
      this.context.fillStyle = "red";
      this.context.arc(this.point.x, this.point.y, 5, 0, 2 * Math.PI);
      this.context.fill();
    },

    resetZoom() {
      this.zoomFactor = 1;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(this.image, 0, 0);
      this.point.x = 30;
      this.point.y = 70;
    },
  },
});
</script>
  