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

          <p class="category d-inline-flex font-weight-light">
            <v-icon
              color="green"
              small
            >
              mdi-arrow-up
            </v-icon>
            <span class="green--text">55%</span>&nbsp;
            昨天收入提高
          </p>
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
          <p class="category d-inline-flex font-weight-light">
            <v-icon
              color="green"
              small
            >
              mdi-arrow-up
            </v-icon>
            <span class="green--text">55%</span>&nbsp;
            此月收入提高
          </p>
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
          <p class="category d-inline-flex font-weight-light">
            <v-icon
              color="green"
              small
            >
              mdi-arrow-up
            </v-icon>
            <span class="green--text">55%</span>&nbsp;
            昨天人数提高
          </p>
        </material-linechart-card>
      </v-col>

      <!-- 全年收入，当天收入，当天病人，月收入，月病人-->
      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <material-stats-card
          color="green"
          icon="mdi-store"
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
          color="orange"
          icon="mdi-content-copy"
          title="当天病人"
          :value="todayNum"
          small-value="人"
          sub-icon="mdi-alert"
          sub-icon-color="error"
          :sub-text="todayDate()"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <material-stats-card
          color="red"
          icon="mdi-information-outline"
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
          icon="mdi-twitter"
          title="月病人"
          :value="monthNum"
          small-value="人"
          sub-icon="mdi-update"
          :sub-text="todayMonth()"
        />
      </v-col>
      
      <v-col
        cols="12"
        lg="6"
      >
        <material-stats-card
          color="green"
          icon="mdi-store"
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
          color="green"
          icon="mdi-store"
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
import { dateToString, stringToDate} from '../utils/handleDate';
import { saveToLocal, loadFromLocal} from '../utils/handleLocalStorage';
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
        let fromlocal = loadFromLocal(1,'cacheOrder',[]);
        let monthTotalFromLocal = loadFromLocal(1,'userSetting', []);
        let data30Days = [];

        if(fromlocal.length == 0){
          var end = dateToString(new Date());
          var start = dateToString(new Date(new Date().setDate(new Date().getDate()-30)));
          //directly get last 30 days
          this.$http.get('/api/getChartInfoFromOrder',{
            params: {
              dbs : this.$store.state.user.dbs_prefix+'ordlist',
              startDate: start,
              endDate: end
            }
          }).then( (res) => {            
            this.calculateData(res.data, monthTotalFromLocal);
          })
        }else{
          //get today
          this.$http.get('/api/getChartInfoFromOrder',{
            params: {
              dbs : this.$store.state.user.dbs_prefix+'ordlist',
              startDate: dateToString(new Date()),
              endDate: dateToString(new Date())
            }
          }).then( (res) => {
            data30Days = res.data;
            data30Days = data30Days.concat(fromlocal);
            this.calculateData(data30Days, monthTotalFromLocal);
          })
        }
      },

      calculateData: function(data30Days, monthTotalFromLocal){
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
        this.setMonthChart(monthTotalFromLocal, _monthIncome, _monthProfit);
      },

      setMonthChart: function(monthTotalArry, _monthIncome, _monthProfit){
        var incomeMonth = [];
        var profitMonth = [];
        for (var key in monthTotalArry[0]){
          if(key.indexOf('total') != -1){
            this.overallIncome = parseFloat(this.overallIncome + parseFloat(monthTotalArry[0][key]));
          }
        }
        this.overallIncome = this.overallIncome + _monthIncome;
        
        //start from 0, 也就是当前月
        for(let monthOffset=0; monthOffset<12; monthOffset++){
          let date = new Date();
          let month = date.getMonth()+1;
          let year = date.getFullYear();
          month = month - monthOffset;
          
          if(month <= 0){
            month = month + 12;
            year = year-1;
          }else if(month > 0 && monthOffset != 0){
            if (month >= 1 && month <= 9) {
              month = "0" + month;
            }
            let columnTotal = 'total' + year + month;
            if(!monthTotalArry[0][columnTotal])
              monthTotalArry[0][columnTotal] = 0;
            this.yearIncome = parseFloat(this.yearIncome + parseFloat(monthTotalArry[0][columnTotal]));
          }

          if(monthOffset ==0){
            incomeMonth.push([year + '-' + month, _monthIncome]);
            profitMonth.push([year + '-' + month, _monthProfit]);
            continue;
          }          
          let columnTotal = 'total' + year + month;
          let columnProfit = 'profit' + year + month;

          if(!monthTotalArry[0][columnTotal])
            monthTotalArry[0][columnTotal] = 0;
          if(!monthTotalArry[0][columnProfit])
            monthTotalArry[0][columnProfit] = 0;
          incomeMonth.push([year + '-' + month, monthTotalArry[0][columnTotal]]);
          profitMonth.push([year + '-' + month, monthTotalArry[0][columnProfit]]);
        }
        this.monthSalesChart.data.push({name: '收入', data: incomeMonth});
          if(this.displayProfit)
            this.monthSalesChart.data.push({name: '利润', data: profitMonth});
        this.yearIncome = this.yearIncome + _monthIncome;
      }

    },

    mounted: function() {
      let userSetting = loadFromLocal(1,'userSetting', []);
      this.displayProfit = userSetting[0]['displayProfit'];
      this.loadDataAndSetupChart();      
		}
  }
</script>
