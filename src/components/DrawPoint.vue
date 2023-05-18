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
      <canvas
        ref="canvas2"
        :width="imageWidth"
        :height="imageHeight"
        @mousedown="handleMouseDown2"
        @mousemove="handleMouseMove2"
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
import pointsData from "../../assets/points.json";

export default defineComponent({
  name: "DrawPoint",

  data() {
    return {
      imageWidth: 0,
      imageHeight: 0,
      selectedPoint: null,
      selectedPoint2: null,
      offsetX: 0,
      offsetY: 0,
      newPoints: [],
      points: [],
    };
  },

  mounted() {
    // Fetch the JSON data from the file
    this.points = pointsData.slice(0, 18).map((point) => {
      return {
        color: point.color,
        initialX: point.x1,
        initialY: point.y1,
        x: point.x1,
        y: point.y1,

        initialX2: point.x2,
        initialY2: point.y2,
        x2: point.x2,
        y2: point.y2,
      };
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

    //--
    this.canvas2 = this.$refs.canvas2;
    this.context2 = this.canvas2.getContext("2d");

    this.image2 = new Image();
    this.image2.src = "/assets/images/left.jpg";
    this.image2.onload = () => {
      this.canvas2.width = this.image2.width;
      this.canvas2.height = this.image.height;
      this.context2.drawImage(this.image2, 0, 0);
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
      //__
      this.context2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
      this.context2.drawImage(this.image2, 0, 0);

      // Draw the points
      this.points.forEach((point) => {
        this.context2.fillStyle = point.color;
        this.context2.beginPath();
        this.context2.arc(point.x2, point.y2, 5, 0, 2 * Math.PI);
        this.context2.fill();
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

    handleMouseDown2(event) {
      const canvas2 = this.$refs.canvas2;
      const rect = canvas2.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      for (let i = 0; i < this.points.length; i++) {
        const point = this.points[i];
        const distance = Math.sqrt(
          (mouseX - point.x2) ** 2 + (mouseY - point.y2) ** 2
        );
        if (distance <= 5) {
          this.selectedPoint2 = point;
          this.offsetX = mouseX - point.x2;
          this.offsetY = mouseY - point.y2;
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

    handleMouseMove2(event) {
      if (this.selectedPoint2) {
        const canvas2 = this.$refs.canvas2;
        const rect = canvas2.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        this.selectedPoint2.x2 = mouseX - this.offsetX;
        // this.selectedPoint2.y2 = mouseY - this.offsetY;
        this.drawPoints();
      }
    },

    handleMouseUp() {
      this.selectedPoint = null;
      this.selectedPoint2 = null;
    },

    resetMove(color) {
      // Filter the points with the specified color code and update their coordinates
      this.points.forEach((point) => {
        if (point.color === color) {
          point.x = point.initialX;
          point.y = point.initialY;
          point.x2 = point.initialX2;
          point.y2 = point.initialY2;
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
          x1: point.x,
          y1: point.y,
          x2: point.x2,
          y2: point.y2,
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
