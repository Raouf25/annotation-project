<template>
    <div>
      <canvas ref="canvas" :width="imageWidth" :height="imageHeight" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp"></canvas>
      <table>
        <thead>
          <tr>
            <th>Color</th>
            <th>Initial Coordinates</th>
            <th>Final Coordinates</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(point, index) in points" :key="index">
            <td>
              <span class="color-dot" :style="{ backgroundColor: point.color }"></span>
            </td>
            <td>{{ `(${point.initialX}, ${point.initialY})` }}</td>
            <td>{{ `(${point.x}, ${point.y})` }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "DrawPoint",
  
    props: {
      imageSrc: {
        type: String,
        required: true
      }
    },
  
    data() {
      return {
        imageWidth: 0,
        imageHeight: 0,
        points: [
          { color: "rgb(126, 199, 159)", initialX: 516, initialY: 132, x: 516, y: 132 },
          { color: "rgb(10, 222, 182)", initialX: 486, initialY: 118, x: 486, y: 118 },
          { color: "rgb(52, 204, 254)", initialX: 300, initialY: 300, x: 300, y: 300 }
        ],
        selectedPoint: null,
        offsetX: 0,
        offsetY: 0
      };
    },
  
    mounted() {
      const image = new Image();
      image.src = this.imageSrc;
      image.onload = () => {
        this.imageWidth = image.width;
        this.imageHeight = image.height;
        this.drawPoints();
      };
    },
  
    methods: {
      drawPoints() {
        const canvas = this.$refs.canvas;
        const context = canvas.getContext("2d");
  
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
  
        // Draw the image
        const image = new Image();
        image.src = this.imageSrc;
        image.onload = () => {
          context.drawImage(image, 0, 0);
  
          // Draw the points
          this.points.forEach(point => {
            context.fillStyle = point.color;
            context.beginPath();
            context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
            context.fill();
          });
        };
      },
  
      handleMouseDown(event) {
        const canvas = this.$refs.canvas;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
  
        for (let i = 0; i < this.points.length; i++) {
          const point = this.points[i];
          const distance = Math.sqrt((mouseX - point.x) ** 2 + (mouseY - point.y) ** 2);
          if (distance <= 5) {
            this.selectedPoint = point;
            this.offsetX = mouseX - point.x;
            this.offsetY = mouseY - point.y;
            return;
          }
        }
      },
  
      handleMouseMove(event) {
        if (this.selectedPoint) {
          const canvas = this.$refs.canvas;
          const rect = canvas.getBoundingClientRect();
          const mouseX = event.clientX - rect.left;
          const mouseY = event.clientY - rect.top;
          this.selectedPoint.x = mouseX - this.offsetX;
          this.selectedPoint.y = mouseY - this.offsetY;
          this.drawPoints();
        }
      },
  
      handleMouseUp() {
        this.selectedPoint = null;
      }
    }
  });
  </script>
  
  <style>
  canvas {
    border: 1px solid #000;
  }
  
  table {
    margin-top: 20px;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 5px 10px;
    border: 1px solid #000;
  }
  
  .color-dot {
    width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 50%;
  }
  </style>
  