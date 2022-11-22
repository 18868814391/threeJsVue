<template>
  <div ref="chartEl" style="height:100%"></div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  name: 'ChartBlock',
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chart: null,
      data: [5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 20, 36, 10, 10, 20, 5, 20, 36, 10]
    }
  },
  watch: {
    option: {
      handler(newValue, oldValue) {
        this.chart.setOption(newValue)
      },
      // 因为option是个对象，而我们对于echarts的配置项，要更改的数据往往不在一级属性里面
      // 所以这里设置了deep:true，vue文档有说明
      deep: true
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chartEl)
    this.chart.setOption(this.option)    
    // 这里模拟后台请求动态变化的数据，每2S改变一次数据
    setInterval(this.changeOption, 2000)
  },
  methods: {
    changeOption() {
      var r = Math.floor(Math.random() * 12)
      // splice会改变原来的数组
      // var data = this.data.splice(r,6);
      var d = this.data.slice(r, r + 6)
      this.option.series[0].data = d
    }
  }
}
</script>