<template>
    <div>
        <el-card class="box-card" style="margin-top:10px">
            <div slot="header" class="clearfix">
                <!-- 头部左侧区域 -->
                <el-tabs class="tabs" v-model="activeName">
                    <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                    <el-tab-pane label="访问量" name="visite"></el-tab-pane>
                </el-tabs>
                <!-- 头部右侧区域 -->
                <div class="right">
                    <span @click="setDay">本日</span>
                    <span @click="setWeek">本周</span>
                    <span @click="setMonth">本月</span>
                    <span @click="setYear">本年</span>
                    <el-date-picker class="date" v-model="startAndEndDate" size="mini" type="daterange"
                        range-separator="-" start-placeholder="开始日期" value-format="yyyy-MM-dd" end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </div>
            <div>
                <el-row :gutter="10">
                    <el-col :span="18">
                        <div class="charts" ref="charts"></div>
                    </el-col>
                    <el-col :span="6">
                        <h6>门店{{ title }}排名</h6>
                        <ul>
                            <li v-for="item in list" :key="item.id">
                                <span :class="item.class">{{ item.id }}</span>
                                <span>{{ item.name }}</span>
                                <span>{{ item.sale }}</span>
                            </li>
                        </ul>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import * as echarts from 'echarts';
export default {
    name: 'Sale',
    data() {
        return {
            activeName: 'sale',
            list: [
                { id: 1, name: '肯德基', sale: 3213, class: 'rights' },
                { id: 2, name: '肯德基', sale: 3213, class: 'rights' },
                { id: 3, name: '肯德基', sale: 3213, class: 'rights' },
                { id: 4, name: '肯德基', sale: 3213 },
                { id: 5, name: '肯德基', sale: 3213 },
                { id: 6, name: '肯德基', sale: 3213 },
                { id: 7, name: '肯德基', sale: 3213 },
            ],
            saleChart: null,
            startAndEndDate: []
        }
    },
    computed: {
        title() {
            return this.activeName == 'sale' ? '销售额' : '访问量'
        }
    },
    mounted() {
        // 初始化实例
        this.saleChart = echarts.init(this.$refs.charts);
        this.saleChart.setOption({
            title: {
                text: this.title + '趋势',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '40%',
                    data: [10, 52, 200, 334, 390, 330, 220, 42, 31, 53, 13, 42]
                }
            ]
        });
    },
    watch: {
        title(newVal) {
            this.saleChart.setOption({
                title: {
                    text: this.title + '趋势',
                    series: [
                        {
                            name: 'Direct',
                            type: 'bar',
                            barWidth: '40%',
                            data: [53, 21, 63, 85, 24, 123, 43, 1, 41, 421, 42, 42]
                        }
                    ]
                }
            })
        }
    },
    methods: {
        // 获取本日时间
        setDay() {
            const day = dayjs().format('YYYY-MM-DD')
            this.startAndEndDate = [day, day]
        },
        // 获取本周时间
        setWeek() {
            const start = dayjs().day(1).format('YYYY-MM-DD')
            const end = dayjs().day(7).format('YYYY-MM-DD')
            this.startAndEndDate = [start, end]
        },
        // 获取本月时间
        setMonth() {
            const start = dayjs().startOf('month').format('YYYY-MM-DD')
            const end = dayjs().endOf('month').format('YYYY-MM-DD')
            this.startAndEndDate = [start, end]
        },
        // 获取本年时间
        setYear() {
            const start = dayjs().startOf('year').format('YYYY-MM-DD')
            const end = dayjs().endOf('year').format('YYYY-MM-DD')
            this.startAndEndDate = [start, end]
        }
    }
}
</script>

<style scoped>
.clearfix {
    position: relative;
    display: flex;
    justify-content: space-between;
}

.tabs {
    width: 100%;
}

.right {
    position: absolute;
    right: 0
}

.right span {
    margin: 0 10px;
    font-size: 14px;
}

.right .date {
    width: 200px;
    margin: 0 20px;
}

.charts {
    width: 100%;
    height: 300px;
}

li {
    list-style: none;
}

ul li {
    margin: 10px 0
}

ul li span:first-child {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    float: left;
    margin-right: 15px
}

ul li .rights {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #000;
    color: #fff;
    text-align: center;
    float: left;
    margin-right: 15px
}

ul li span:last-child {
    float: right;
}
</style>