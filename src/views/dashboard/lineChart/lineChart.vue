<template>
    <div id="line" ref="line"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'lineChart',
    mounted() {
        // 初始化实例
        const lineChart = echarts.init(this.$refs.line);
        // 配置
        lineChart.setOption({
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
                    // 折线图
                    type: 'line',
                    // 折现变曲线
                    smooth: true,
                    data: [2, 4, 1, 5, 4, 6, 8, 2, 3, 4, 9, 2],
                    // 设置拐点样式
                    itemStyle: {
                        // 透明度为0
                        opacity: 0
                    },
                    // 线条样式
                    lineStyle: {
                        // 线条颜色
                        color: 'rgb(165, 116, 218)',
                    },
                    areaStyle: {
                        // 填充颜色
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgb(199, 158, 243)' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#fff' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        },
                    }
                }
            ],
            // 布局调试
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            }
        });
    }
}
</script>

<style scoped>
#line {
    width: 100%;
    height: 100%;
}
</style>