<template>
  <div class="spinner-wrapper">
    <md-progress-spinner class="md-accent animated zoomIn" md-mode="indeterminate" :md-stroke="4"></md-progress-spinner>
  </div>  
</template>
<style>
.spinner-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 64px);
  background-color: #f5f5f5;
}
</style>

