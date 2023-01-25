<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">首页</div>
     -->
    <el-row :gutter="12">
      <!-- 第一个card -->
      <el-col :span="6">
        <Card title="销售总额" count="￥ 126560">
          <template slot="charts">
            <div class="box">
              <span class="charts-span">
                周同比 <span style="margin-left:5px">56.67%</span>
                <svg t="1673851899337" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="8234" width="10" height="10">
                  <path d="M27.273 753.613l485.222-484.233 484.233 485.222z" fill="#d81e06" p-id="8235"></path>
                </svg>
              </span>
              <span class="charts-span">
                日同比 <span style="margin-left:5px">19.16%</span>
                <svg t="1673852001708" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="12029" width="10" height="10">
                  <path d="M1024 255.996 511.971 767.909 0 255.996 1024 255.996z" fill="#1afa29" p-id="12030"></path>
                </svg>
              </span>
            </div>
          </template>
          <template slot="footer">
            <span class="footer-span">日销售额￥ 12423</span>
          </template>
        </Card>
      </el-col>
      <!-- 第二个card -->
      <el-col :span="6">
        <Card title="访问量" count="88468">
          <template slot="charts">
            <lineChart></lineChart>
          </template>
          <template slot="footer">
            <span class="footer-span">日访问量 1234</span>
          </template>
        </Card>
      </el-col>
      <!-- 第三个card -->
      <el-col :span="6">
        <Card title="支付笔数" count="88468">
          <template slot="charts">
            <barChart></barChart>
          </template>
          <template slot="footer">
            <span class="footer-span">转换率 64%</span>
          </template>
        </Card>
      </el-col>
      <!-- 第四个card -->
      <el-col :span="6">
        <Card title="运营活动效果" count="78%">
          <template slot="charts">
            <progressChart></progressChart>
          </template>
          <template slot="footer">
            <span class="footer-span">
              周同比 <span style="margin-left:5px">56.67%</span>
              <svg t="1673851899337" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="8234" width="10" height="10">
                <path d="M27.273 753.613l485.222-484.233 484.233 485.222z" fill="#d81e06" p-id="8235"></path>
              </svg>
            </span>
            <span class="footer-span">
              日同比 <span style="margin-left:5px">19.16%</span>
              <svg t="1673852001708" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="12029" width="10" height="10">
                <path d="M1024 255.996 511.971 767.909 0 255.996 1024 255.996z" fill="#1afa29" p-id="12030"></path>
              </svg>
            </span>
          </template>
        </Card>
      </el-col>
    </el-row>
    <Sale></Sale>

  </div>
</template>

<script>
import Card from './Card/Card.vue'
import lineChart from './lineChart/lineChart.vue'
import barChart from './barChart/barChart.vue'
import progressChart from './progressChart/progressChart.vue'
import Sale from './Sale/Sale.vue'
export default {
  name: 'Dashboard',
  components: { Card, lineChart, barChart, progressChart, Sale }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.charts-span {
  font-size: 12px;
}

.icon {
  margin: 0 5px;
}

.box {
  padding-top: 25px;
}

.footer-span {
  font-size: 14px;
}
</style>
