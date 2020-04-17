<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card 
          flat
					color="green"
          title="详细统计"
        >
          <v-row>
            <v-col cols="12" sm="12" lg="4" md="4">
              <v-date-picker full-width v-model="dates" range color="green"></v-date-picker>
              <div class="py-12"></div>
              <material-linechart-card
                :data="monthSalesChart.data"
                color="orange"
                v-if="reportDisplay"
              >
                <h4 class="title font-weight-light">
                  每月收入
                </h4>
              </material-linechart-card>
            </v-col>
            <v-col cols="12" sm="12" lg="8" md="8">
              <v-chip
                class="ma-2"
                color="green"
                text-color="white"
              >
                今天
              </v-chip>
              <v-chip
                class="ma-2"
                color="green"
                text-color="white"
              >
                本月
              </v-chip>
              <v-card
                class="mx-auto"
              >
                <v-card-text>
                  <v-text-field v-model="dateRangeText" label="时间范围" readonly append-icon="mdi-check-bold" color="blue darken-2" @click:append="actionGenerate"></v-text-field>
                  <div  ref="print" v-if="reportDisplay">
                    <h3 style="text-align:center">{{dateRangeText}} 详情</h3>
                    <v-list subheader dense>
                      <v-subheader>总计</v-subheader>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>总收入</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{totalIncome}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>总利润</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{totalProfit}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-divider></v-divider>

                      <v-subheader>收入</v-subheader>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>草药</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{incomeCaoyao}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>免煎药</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{incomeMianjian}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>西药</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{incomeXiyao}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>药丸</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{incomeYaowan}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>平均每天</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{averageIncome}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-divider></v-divider>

                      <v-subheader>利润</v-subheader>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>草药</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{profitCaoyao}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>免煎药</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{profitMianjian}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>西药</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{profitXiyao}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>药丸</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{profitYaowan}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>平均每天</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{averageProfit}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-divider></v-divider>

                      <v-subheader>病人</v-subheader>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>总计</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{totalPatient}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>平均每天</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{averagePatient}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>小于20岁</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{profitXiyao}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>大于20岁</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{lt20Patient}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-divider></v-divider>

                      <v-subheader>其他</v-subheader>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>煎药次数</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{jianyaoTimes}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      dates: ['2019-09-10', '2019-09-20'],
      reportDisplay: false,
      totalIncome: 0,
      monthSalesChart: {
          data: [],
        },
    }),

    methods: {
      actionGenerate: function(){
        this.reportDisplay = true;
        var start = this.dates[0];
        var end = this.dates[1];
        var range = {
          startDate: start,
          endDate: end,
        };
        this.startDay = start;
        this.endDay = end;
        var orderObj = [];
        var otherEntryObj = [];
        let days = 0;
        days = (this.dateRange[1] - this.dateRange[0]) / (1000*3600*24) + 1;
        this.$http.get("/ordapi/getOrderStatement", {params:range})
        .then(
          function(response) {
            orderObj = response.data;
            this.$http.get("/othentryapi/getOtherEntryRange", {params:range}).then(response => {
              otherEntryObj = response.data;
              this.calculateAndAnalysis(orderObj, otherEntryObj, days);
            })							
          }
        );
      },

      calculateAndAnalysis: function(orderObj,otherEntryObj,days){
        //alert(orderObj.length);
        //alert(otherEntryObj.length);
        let _totalIncome = 0, _totalProfit = 0, _averageIncome = 0, _averageProfit = 0;
        let _incomeMianjian = 0, _incomeXiyao = 0, _incomeYaowan = 0, _incomeCaoyao = 0;
        let _profitMianjian = 0, _profitXiyao = 0, _profitYaowan = 0, _profitCaoyao = 0;
        let _taotalPatient = 0, _averagePatient = 0, _gt20Patient = 0, _lt20Patient = 0;
        let _jianyaoTimes = 0;
        for(let item of orderObj){
          if(item.medType == "免煎药"){
            _incomeMianjian = parseFloat((_incomeMianjian + item.total).toFixed(2));
            _profitMianjian = parseFloat((_profitMianjian + item.totalprofit).toFixed(2));
          } 
          else if(item.medType == "草药"){
            _incomeCaoyao = parseFloat((_incomeCaoyao + item.total).toFixed(2));
            _profitCaoyao = parseFloat((_profitCaoyao + item.totalprofit).toFixed(2));
          }
          else if(item.medType == "西药"){
            _incomeXiyao = parseFloat((_incomeXiyao + item.total).toFixed(2));
            _profitXiyao = parseFloat((_profitXiyao + item.totalprofit).toFixed(2));
          }
          _totalIncome = parseFloat((_totalIncome + item.total).toFixed(2));
          _totalProfit = parseFloat((_totalProfit + item.totalprofit).toFixed(2));
          _taotalPatient = _taotalPatient + 1;
          
          if(parseInt(item.age) > 20){
            _gt20Patient = _gt20Patient + 1;
          }else{
            _lt20Patient = _lt20Patient + 1;
          }
          let searchStr = JSON.stringify(item.med);
          if(searchStr.indexOf('煎药') != -1){
            _jianyaoTimes = _jianyaoTimes + 1;
          }
        }

        for(let item of otherEntryObj){
          if(item.detailType == "药丸"){
            _incomeYaowan = parseFloat((_incomeYaowan + item.amount).toFixed(2));
            _profitYaowan = parseFloat((_profitYaowan + item.profit).toFixed(2));
          }
          _totalIncome = parseFloat((_totalIncome + item.amount).toFixed(2));
          _totalProfit = parseFloat((_totalProfit + item.profit).toFixed(2));
          _taotalPatient = _taotalPatient + 1;

        }
        _averageIncome = parseFloat((_totalIncome / days).toFixed(2));
        _averageProfit = parseFloat((_totalProfit / days).toFixed(2));
        _averagePatient = parseFloat((_taotalPatient / days).toFixed(2));
        //赋值
        this.totalIncome = _totalIncome;
        this.totalProfit = _totalProfit;
        this.averageIncome = _averageIncome;
        this.averageProfit = _averageProfit;
        //收入
        this.incomeMianjian = _incomeMianjian;
        this.incomeCaoyao = _incomeCaoyao;
        this.incomeXiyao = _incomeXiyao;
        this.incomeYaowan = _incomeYaowan;
        //利润
        this.profitMianjian = _profitMianjian;
        this.profitCaoyao = _profitCaoyao;
        this.profitXiyao = _profitXiyao;
        this.profitYaowan = _profitYaowan;
        //病人
        this.totalPatient = _taotalPatient;
        this.averagePatient = _averagePatient;
        this.gt20Patient = _gt20Patient;
        this.lt20Patient = _lt20Patient;
        //其它
        this.jianyaoTimes = _jianyaoTimes;
      },
    },

    mounted: function() {
			this.getAll();
    },
    
    computed: {
      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },

    
  }
</script>
