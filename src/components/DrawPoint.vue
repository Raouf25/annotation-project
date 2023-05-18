<template>
  <div class="container">
    <div class="image-container">
      <canvas
        ref="canvas"
        :width="imageWidth"
        :height="imageHeight"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
      ></canvas>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Color</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(point, index) in points" :key="index">
            <td>
              <span
                class="color-dot"
                :style="{ backgroundColor: point.color }"
              ></span>
            </td>
            <td>
              <span
                class="material-icons hover-green"
                @click="resetMove(point.color)"
                >undo</span
              >
              <span
                class="material-icons hover-red"
                @click="deletePoint(point.color)"
                >delete</span
              >
            </td>
          </tr>
        </tbody>
      </table>

      <button @click="submitNewPoint" class="submit-button">
        <span class="text">Submit</span>
        <span class="material-icons">send</span>
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { callWebService } from "../services/webServices";

export default defineComponent({
  name: "DrawPoint",

 
  data() {
    return {
      imageWidth: 0,
      imageHeight: 0,
      selectedPoint: null,
      offsetX: 0,
      offsetY: 0,
      newPoints: [],
      points: [],
    };
  },

  mounted() {
    callWebService()
        .then((points) => {
         // console.log(points);
          // Faites ce que vous voulez avec les résultats ici
          this.points = points.slice(0, 5).map((point) => {
            return {
              color: point.color,
              initialX: point.x1,
              initialY: point.y1,
              x: point.x1,
              y: point.y1,
            };
          });
        })
        .catch((error) => {
          // Gérez l'erreur ici
        });

    this.canvas = this.$refs.canvas;
    this.context = this.canvas.getContext("2d");

    this.image = new Image();
    this.image.src = "/assets/images/right.jpg";
    this.image.onload = () => {
      this.canvas.width = this.image.width;
      this.canvas.height = this.image.height;
      this.context.drawImage(this.image, 0, 0);
      this.drawPoints();
    };
  },

  methods: {
    drawPoints() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(this.image, 0, 0);

      // Draw the points
      this.points.forEach((point) => {
        this.context.fillStyle = point.color;
        this.context.beginPath();
        this.context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        this.context.fill();
      });
    },

    handleMouseDown(event) {
      const canvas = this.$refs.canvas;
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      for (let i = 0; i < this.points.length; i++) {
        const point = this.points[i];
        const distance = Math.sqrt(
          (mouseX - point.x) ** 2 + (mouseY - point.y) ** 2
        );
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
    },

    resetMove(color) {
      // Filter the points with the specified color code and update their coordinates
      this.points.forEach((point) => {
        if (point.color === color) {
          point.x = point.initialX;
          point.y = point.initialY;
        }
      });

      // Redraw the points
      this.drawPoints();
    },

    deletePoint(color) {
      // Find the index of the point to delete
      const index = this.points.findIndex((point) => point.color === color);

      // Check if the point was found
      if (index !== -1) {
        // Remove the point from the list
        this.points.splice(index, 1);
      }

      // Redraw the points
      this.drawPoints();
    },

    submitNewPoint() {
      this.newPoints = this.points.map((point) => {
        return {
          color: point.color,
          x: point.x,
          y: point.y,
        };
      });
      console.log(JSON.stringify(this.newPoints, null, "  "));
    },
  },
});
</script>

<style>
.container {
  display: flex;
}

.image-container {
  margin-right: 20px;
}

canvas {
  border: 1px solid #000;
}

table {
  border-collapse: collapse;
}

th,
td {
  padding: 5px 10px;
  border: 1px solid #000;
}

.color-dot {
  width: 20px;
  height: 20px;
  display: inline-block;
  border-radius: 50%;
}

.hover-red:hover {
  color: red;
}

.hover-green:hover {
  color: green;
}

.submit-button {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.text {
  margin-right: 5px;
}
</style>
