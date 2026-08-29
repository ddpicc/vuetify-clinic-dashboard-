<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        lg="4"
      >
        <material-linechart-card
          :data="dailySalesChart.data"
          color="white"
          :chartColor = "infocolor"
        >
          <h5 class="title font-weight-light">
            每天收入
          </h5>
        </material-linechart-card>
      </v-col>

      <v-col
        cols="12"
        lg="4"
      >
        <material-linechart-card
          :data="monthSalesChart.data"
          color="white"
          :chartColor = "infocolor"
        >
          <h4 class="title font-weight-light">
            每月收入
          </h4>
        </material-linechart-card>
      </v-col>

      <v-col
        cols="12"
        lg="4"
      >
        <material-linechart-card
          :data="dailyNmPeopleChart.data"
          color="white"
          :chartColor="['#FFB677', '#666']"
        >
          <h4 class="title font-weight-light">
            每天病人
          </h4>
        </material-linechart-card>
      </v-col>

      <!-- 全年收入，当天收入，当天病人，月收入，月病人-->
      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <material-stats-card
          color="primary"
          icon="mdi-currency-cny"
          title="当天收入"
          :value="todayIncome"
          small-value="元"
          sub-icon="mdi-calendar"
          :sub-text="todayDate()"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <material-stats-card
          color="teal"
          icon="mdi-account-group"
          title="当天病人"
          :value="todayNum"
          small-value="人"
          sub-icon="mdi-calendar"
          :sub-text="todayDate()"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <material-stats-card
          color="warning"
          icon="mdi-chart-bar"
          title="月收入"
          :value="monthIncome"
          small-value="元"
          sub-icon="mdi-tag"
          :sub-text="todayMonth()"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <material-stats-card
          color="info"
          icon="mdi-account-multiple"
          title="月病人"
          :value="monthNum"
          small-value="人"
          sub-icon="mdi-tag"
          :sub-text="todayMonth()"
        />
      </v-col>
      
      <v-col
        cols="12"
        lg="6"
      >
        <material-stats-card
          color="primary"
          icon="mdi-finance"
          title="全年收入"
          :value="yearIncome"
          sub-icon="mdi-calendar"
          :sub-text="todayYear()"
        />
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <material-stats-card
          color="secondary"
          icon="mdi-sigma"
          title="总收入"
          :value="overallIncome"
          sub-icon="mdi-calendar"
          sub-text="从19年6月至今"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { dateToString, stringToDate } from '../utils/handleDate';
  export default {

    data () {
      return {
        infocolor: ['#FFB677', '#436790'],
        displayProfit: false,
        todayIncome: '0',
        todayNum: '0',
        monthIncome: '0',
        monthNum: '0',
        yearIncome: '0',
        overallIncome: '0',
        dailySalesChart: {
          data: [],
        },
        monthSalesChart: {
          data: [],
        },
        dailyNmPeopleChart: {
          data: [],
        },
      }
    },
    methods: {
      todayDate: function(){
        var myDate = new Date();     //获取当前年份(2位)
        var month=myDate.getMonth();       //获取当前月份(0-11,0代表1月)
        var day=myDate.getDate();        //获取当前日(1-31)
        var dayNow=(month+1)+"月"+day+"日";
        return dayNow;
      },

      todayMonth: function(){
        var myDate = new Date();     //获取当前年份(2位)
        var month=myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        var monthNow=month + "月";
        return monthNow;
      },

      todayYear: function(){
        var myDate = new Date();
        var year=myDate.getFullYear();
        year = year + '年';
        return year;
      },

      loadDataAndSetupChart: function(){
        const end = dateToString(new Date());
        const start = dateToString(new Date(new Date().setDate(new Date().getDate()-30)));
        const requests = [
          this.$http.get('/api/getOrdBetweenDates', {
            params: {
              dbs_a: this.$store.state.user.dbs_prefix+'ordlist',
              dbs_b: this.$store.state.user.dbs_prefix+'patient',
              startDate: start,
              endDate: end
            }
          }),
          this.$http.get('/api/getMonthlyTotals', {
            params: {
              dbPrefix: this.$store.state.user.dbs_prefix
            }
          })
        ];
        Promise.all(requests).then(([ordersRes, monthlyRes]) => {
          this.calculateData(ordersRes.data, monthlyRes.data);
        });
      },

      calculateData: function(data30Days, monthlyTotals){
        let index = 0;
        let curDate = '';
        var last30daysIncome = [];
        var last30daysProfit = [];
        var incomeData = [];
        var profitData = [];
        var last30daysNum = [];
        let _todayIncome = 0;
        let _todayNum = 0;
        let _monthIncome = 0;
        let _monthProfit = 0;
        let _monthNum = 0;
        
        for(let item of data30Days){
          if(item.date == dateToString(new Date())){
            _todayIncome = parseFloat((_todayIncome + item.total).toFixed(2));
            _todayNum = _todayNum + 1;
          }
          if(item.date.substring(0,7) == dateToString(new Date()).substring(0,7)){
            _monthIncome = parseFloat((_monthIncome + item.total).toFixed(2));
            _monthProfit = parseFloat((_monthProfit + item.totalprofit).toFixed(2));
            _monthNum = _monthNum + 1;
          }
          if(item.date != curDate){
            index = parseInt((new Date() - stringToDate(item.date)) / (1000 * 60 * 60 * 24));
            if(index > 30){
              continue;
            }
            curDate = item.date;
            last30daysIncome[index] = item.total;
            last30daysProfit[index] = item.totalprofit;
            last30daysNum[index] = 1;
          }
          else{
            last30daysIncome[index] = parseFloat((last30daysIncome[index] + item.total).toFixed(2));
            last30daysProfit[index] = parseFloat((last30daysProfit[index] + item.totalprofit).toFixed(2));
            last30daysNum[index] = last30daysNum[index] + 1;
          }
        }
        this.todayIncome = _todayIncome.toString();
        this.monthIncome = _monthIncome.toString();
        this.todayNum = _todayNum.toString();
        this.monthNum = _monthNum.toString();
        for(var i=0;i<30;i++) {
          incomeData.push([dateToString(new Date(new Date().setDate(new Date().getDate()-i))),last30daysIncome[i]]);
          profitData.push([dateToString(new Date(new Date().setDate(new Date().getDate()-i))),last30daysProfit[i]]);
          this.dailyNmPeopleChart.data.push([dateToString(new Date(new Date().setDate(new Date().getDate()-i))),last30daysNum[i]]);
        }
        this.dailySalesChart.data.push({name: '收入', data: incomeData});
        if(this.displayProfit)
          this.dailySalesChart.data.push({name: '利润', data: profitData});
        this.setMonthChart(monthlyTotals, _monthIncome, _monthProfit);
      },

      // monthlyTotals: [{ym: '2026-08', total: x, profit: y}, ...] 按月升序
      setMonthChart: function(monthlyTotals, _monthIncome, _monthProfit){
        const totalsByYm = {};
        for(let item of (Array.isArray(monthlyTotals) ? monthlyTotals : [])){
          totalsByYm[item.ym] = {
            total: parseFloat(item.total) || 0,
            profit: parseFloat(item.profit) || 0,
          };
        }

        const now = new Date();
        const currentYm = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2);
        // 当月的实时数覆盖聚合值（聚合值与实时值相同，兜底防聚合缺失）
        totalsByYm[currentYm] = {
          total: _monthIncome,
          profit: _monthProfit,
        };

        var incomeMonth = [];
        var profitMonth = [];
        this.overallIncome = 0;
        for(const ym in totalsByYm){
          this.overallIncome = parseFloat((this.overallIncome + totalsByYm[ym].total).toFixed(2));
        }

        const thisYear = now.getFullYear();
        for(let monthOffset=0; monthOffset<12; monthOffset++){
          const date = new Date(thisYear, now.getMonth() - monthOffset, 1);
          const ym = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2);
          const monthTotal = totalsByYm[ym] ? totalsByYm[ym].total : 0;
          const monthProfit = totalsByYm[ym] ? totalsByYm[ym].profit : 0;
          incomeMonth.push([ym, monthTotal]);
          profitMonth.push([ym, monthProfit]);
          if(date.getFullYear() === thisYear){
            this.yearIncome = parseFloat((parseFloat(this.yearIncome) + monthTotal).toFixed(2));
          }
        }
        this.monthSalesChart.data.push({name: '收入', data: incomeMonth});
          if(this.displayProfit)
            this.monthSalesChart.data.push({name: '利润', data: profitMonth});
      },

    },

    mounted: function() {
      this.displayProfit = this.$store.getters['userconfig/displayProfit'];
      this.loadDataAndSetupChart();
		}
  }
</script>
