<template>
  <div class="box">
      欢迎<span class="username">
        {{username}}
      </span>使用字节跳动后台管理系统
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      username: ''
    };
  },
  watch: {},
  computed: {},
  methods: {

  },
  created() {
this.username = window.sessionStorage.getItem('username')
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.box{
    width: 100%;
    height: 100%;
    background: #3ea47c;
    color: aliceblue;
    font-size: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align:center;
    .username{
      color: red;
    }
}
</style>