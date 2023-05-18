<template>
  <div class="site">
    <div class="header">
      <h2>Annotation Project</h2>
    </div>
    <hr />

    <div class="content">
      <DrawPoint />
    </div>

    <div class="footer">
      <p>© 2023 Makhlouf Company. All rights reserved.</p>
    </div>
  </div>
</template>

<script>
 
import DrawPoint from "./components/DrawPoint.vue";

export default {
  components: {
    DrawPoint,
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
  flex: 1;
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

.site {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.footer {
  padding: 10px;
  text-align: right;
  border-top: 1px solid #ccc;
  font-size: 12px;
}
</style>
