<template>
  <div class="con">
    <button v-for="(item, index) in guide" :key="index" @click="goTarget(item)">
      {{ item.name }}
    </button>
  </div>
</template>

<script>
export default {
  name: "ThreeTest",
  data() {
    return {
      guide: [
        { name: "数字化机房", path: "/project3" },
        { name: "电脑装配", path: "/project1" },
        { name: "数字城市", path: "/project2" },
        { name: "过马路", path: "/crossRoad" },
        { name: "全景", path: "/house" },
        { name: "飞机", path: "/plane" },
        { name: "上海", path: "/shanghai" },
        { name: "物理", path: "/phy" },
        { name: "飞球", path: "/ballFly" },
        { name: "保龄", path: "/bowling" },
      ],
    };
  },
  mounted() {},
  methods: {
    goTarget(item) {
      this.$router.push({ path: item.path });
    },
  },
};
</script>
<style lang="less" scoped>
.con {
  width: 100%;
  display: flex;
  flex-direction: column;
  button {
    margin: 10px;
  }
}
</style>
