<template>
  <div id="progress" ref="progress" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'ProgressChart',
  mounted() {
    // 初始化实例
    const progressChart = echarts.init(this.$refs.progress)
    // 配置
    progressChart.setOption({
      xAxis: {
        // x轴最小值
        min: 0,
        // 最大值
        max: 100

      },
      yAxis: {
        show: false,
        // 均分
        type: 'category'
      },
      // 系列
      series: [
        {
          // 柱状图
          type: 'bar',
          // 颜色
          color: 'cyan',
          // 数据
          data: [78],
          // 柱状图宽度
          barWidth: 10,
          // 显示柱状背景
          showBackground: true,
          // 设置背景颜色
          backgroundStyle: {
            color: '#eee'
          },
          label: {
            // 设置文本显示
            show: true,
            // 设置文本内容
            formatter: '|',
            // 设置显示位置
            position: 'right'
          }
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

<style>
#progress {
    width: 100%;
    height: 100%;
}
</style>
