<template>
  <div id="bar" ref="bar" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'BarChart',
  mounted() {
    // 初始化实例
    const barChart = echarts.init(this.$refs.bar)
    // 配置
    barChart.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        // 均分
        type: 'category'
      },
      yAxis: {
        show: false
      },
      // 系列
      series: [
        {
          // 柱状图
          type: 'bar',
          data: [2, 4, 1, 5, 4, 6, 8, 2, 3, 4, 9, 2]
        }
      ],
      tooltip: {
        show: true
      },
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    })
  }
}
</script>

<style scoped>
#bar {
    width: 100%;
    height: 100%;
}
</style>
