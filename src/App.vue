<template>
  <div>
    <div class="header">
      <h2>Annotation Project</h2>
      <!--a href="https://github.com/Raouf25/annotation-project">Github</a-->
    </div>
    <hr />

    <div class="content">
      <section v-if="!showResultSection">
        <div class="drop-zone-container">
          <DropZone
            :label="'Zone de dépôt 1'"
            :uploadedImage="uploadedImage1"
            @imageDropped="handleImageDropped1"
          />
          <div class="drop-zone-divider"></div>
          <DropZone
            :label="'Zone de dépôt 2'"
            :uploadedImage="uploadedImage2"
            @imageDropped="handleImageDropped2"
          />
        </div>
        <button
          @click="startAlgorithm"
          :disabled="!isButtonActive"
          class="start-button"
        >
          Start Analyse
        </button>
      </section>

      <div v-if="showResultSection">
        <DrawPoint :imageSrc="uploadedImage1.url" :points="pointToDraw1" />
      </div>

      <section class="cropper-area" v-if="showResultSection0">
        <div class="img-cropper">
          <p>Image 1:</p>

          <vue-cropper
            ref="cropper"
            :aspect-ratio="NaN"
            :src="uploadedImage1.url"
            preview=".preview"
          />
          <p>Image 2:</p>
          <vue-cropper
            ref="cropper2"
            :aspect-ratio="16 / 9"
            :src="uploadedImage2.url"
            preview=".preview"
          />
        </div>
      </section>
      <section class="preview-area" v-if="showResultSection0">
        <p>Preview</p>
        <div class="preview" />

        <div class="actions">
          <a href="#" role="button" @click.prevent="reset"> Reset </a>
          <!--
          <a
            href="#"
            role="button"
            @click.prevent="getCropBoxData"
          >
            Get CropBox Data
          </a>
          <a
            href="#"
            role="button"
            @click.prevent="setCropBoxData"
          >
            Set CropBox Data
          </a>
          -->
        </div>
        <textarea v-model="data" />
      </section>
    </div>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import DropZone from "./components/DropZone.vue";
import { callWebService } from "./services/webServices";
import DrawPoint from "./components/DrawPoint.vue";

export default {
  components: {
    VueCropper,
    DropZone,
    DrawPoint,
  },
  data() {
    return {
      data: null,
      showResultSection: false,
      uploadedImage1: null,
      uploadedImage2: null,
      isButtonActive: false,
      processedImage1: null,
      pointToDraw1: [],
    };
  },
  methods: {
    getCropBoxData() {
      this.data = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4);
    },
    reset() {
      this.$refs.cropper.reset();
      this.$refs.cropper2.reset();
    },
    setCropBoxData() {
      if (!this.data) return;
      this.$refs.cropper.setCropBoxData(JSON.parse(this.data));
    },

    handleImageDropped1(image) {
      this.uploadedImage1 = image;
      this.checkButtonActivation();
    },

    handleImageDropped2(image) {
      this.uploadedImage2 = image;
      this.checkButtonActivation();
    },

    checkButtonActivation() {
      this.isButtonActive =
        this.uploadedImage1 !== null && this.uploadedImage2 !== null;
    },

    drawDotsOnImage(image, points) {
      // Créer un nouveau canvas pour dessiner l'image et les points
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      // Dessiner l'image sur le canvas
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Dessiner les points sur le canvas
      context.fillStyle = "red";
      points.forEach((point) => {
        context.beginPath();
        context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        context.fill();
      });

      // Convertir le canvas en une image et la retourner
      const processedImage = new Image();
      processedImage.src = canvas.toDataURL();
      return processedImage;
    },

    startAlgorithm() {
      callWebService(this.uploadedImage1.file, this.uploadedImage2.file)
        .then((points) => {
          console.log(points);
          // Faites ce que vous voulez avec les résultats ici
          this.pointToDraw1 = points.map((point) => {
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

      this.showResultSection = true;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body {
  font-family: Arial, Helvetica, sans-serif;
  width: 1024px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 5px 0;
}

.header h2 {
  margin: 0;
}

.header a {
  text-decoration: none;
  color: black;
}

.content {
  display: flex;
  justify-content: space-between;
}

.drop-zone-container {
  display: flex;
  padding: 20px;
}

.drop-zone-divider {
  width: 2px; /* Largeur de la colonne */
  margin: 0 10px; /* Marge autour de la colonne */
  height: 100%; /* Hauteur de la colonne */
}

.start-button {
  margin-top: 20px;
  display: block;
  margin: 20px auto;
}

.cropper-area {
  width: 614px;
}

.actions {
  margin-top: 1rem;
}

.actions a {
  display: inline-block;
  padding: 5px 15px;
  background: #0062cc;
  color: white;
  text-decoration: none;
  border-radius: 3px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}

textarea {
  width: 100%;
  height: 100px;
}

.preview-area {
  width: 307px;
}

.preview-area p {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 1rem;
}

.preview-area p:last-of-type {
  margin-top: 1rem;
}

.preview {
  width: 100%;
  height: calc(372px * (9 / 16));
  overflow: hidden;
}
</style>
