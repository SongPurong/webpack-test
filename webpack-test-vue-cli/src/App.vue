<template>
  <h1 class="title">hello vue</h1>
  <ul>
    <li>
      <router-link to="/home">Home</router-link>
    </li>
    <li>
      <router-link to="/about">About</router-link>
    </li>
  </ul>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
.title {
  color: pink;
}
</style>
