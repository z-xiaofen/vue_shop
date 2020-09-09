<template>
  <div>
     <el-button type="info" plain @click="out">退出</el-button>
     
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
    };
  },
  watch: {},
  computed: {},
  methods: {
out() {
window.sessionStorage.clear()
this.$router.push('/login')
this.$massage.success('退出成功')
}
  },
  created () {

  },
  mounted () {}
};
</script>
<style lang="less" scoped>
</style>