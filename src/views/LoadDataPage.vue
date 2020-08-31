<template>
  <div id="app">
  	<v-app light>
			<v-app-bar
      app
      color="white"
      height="50"
			>
      <v-avatar
        class="mr-3"
        color="grey lighten-5"
        size="50"
      >
        <v-img
          contain
          max-height="100%"
          src="../assets/logo1.png"
          @click.stop="jumpHome"
        ></v-img>
      </v-avatar>    

    	</v-app-bar>

			<v-content>
				<v-container
					class="fill-height"
					fluid
				>
					<v-row
						align="center"
						justify="center"
					>
						<v-col
							cols="12"
							sm="8"
							md="4"
						>
							<v-card class="elevation-12">
								<v-stepper v-model="e6" vertical>
								<v-stepper-step :complete="e6 > 1" step="1" :color="completeColor()">读取用户数据到本地</v-stepper-step>

								<v-stepper-step :complete="e6 > 2" step="2" :color="completeColor()">读取用户配置</v-stepper-step>

								<v-stepper-step :complete="e6 > 3" step="3" :color="completeColor()">配置界面</v-stepper-step>

								</v-stepper>
							</v-card>
						</v-col>
					</v-row>
				</v-container>
			</v-content>
  	</v-app>
	</div>
</template>

<script>
  import { dateToString, stringToDate, getNowFormatDate} from '../utils/handleDate';
  import { saveToLocal, loadFromLocal} from '../utils/handleLocalStorage';
  export default {
    data () {
      return {
				e6: 1,
      }
		},
		
		methods: {
      loadingData: function() {
        setTimeout( () => {this.e6 = 2;},1200);
				setTimeout( () => {this.e6 = 3;},2400);
        setTimeout( () => {this.$router.push({ path: '/dashboard' });},7600);
      },
      
      //if the date saved in the localstorate is not today, load and set all data, otherwise directly jump to dashboard
      checkDate: function() {
        let updated_date = loadFromLocal(1,'updated_date',[]);
        if(updated_date != new Date().toDateString() || updated_date.length == 0){
          saveToLocal(1,'updated_date', new Date().toDateString());
          this.loadData();
          this.loadUserConfig();
			    this.loadingData();
        }else{
          this.$router.push({ path: '/dashboard' });
        }
      },

			//读取最近90天的订单数据存在本地
			loadData: function(){
        var end = dateToString(new Date(new Date().setDate(new Date().getDate()-1)));
        var start = dateToString(new Date(new Date().setDate(new Date().getDate()-90)));
        this.$http.get('/api/getOrdBetweenDates', {
          params: {
						dbs_a : this.$store.state.user.dbs_prefix+'ordlist',
						dbs_b : this.$store.state.user.dbs_prefix+'patient',
            startDate: start,
            endDate: end
          }
        }).then(response => {
          this.$nextTick( () => {
            saveToLocal(1,'cacheOrder',response.data);
          })
        })
			},
			
      //读取每月数据，用户配置存在本地
      //生成column，如果数据库读到的是0,本地读取上个月的数据，把它替换掉，如果不是0,直接存到本地
			loadUserConfig: function(){
        let date = new Date();
        let lastMonth = date.getMonth();
        if (lastMonth >= 1 && lastMonth <= 9) {
          lastMonth = "0" + lastMonth;
        }
        let thisMonth = date.getMonth()+1;
        if (thisMonth >= 1 && thisMonth <= 9) {
          thisMonth = "0" + thisMonth;
        }
        let columnTotal = 'total' + date.getFullYear() + lastMonth;
        let columnProfit = 'profit' + date.getFullYear() + lastMonth;

        this.$http.get('/api/getUserSetting', {
          params: {
						userid : this.$store.state.user.user_id
          }
        }).then(response => {
          //看上个月是否有数据
          if (response.data[0][columnTotal] == 0){
            this.saveLastMonthTotalToDb(response.data[0], columnTotal, columnProfit, lastMonth, thisMonth);
          }else{
            saveToLocal(1,'userSetting',response.data);
          }
        })
      },

      saveLastMonthTotalToDb: function(UserSettingAry, columnTotal, columnProfit, lastMonth, thisMonth){
        let _lastMonthIncome = 0;
        let _lastMonthProfit = 0;
        let start = new Date().getFullYear() + '-' + lastMonth + '-01';
        let end = new Date().getFullYear() + '-' + thisMonth + '-01';
        
        this.$http.get('/api/getChartInfoFromOrder',{
          params: {
            dbs : this.$store.state.user.dbs_prefix+'ordlist',
            startDate: start,
            endDate: end
          }
        }).then( (res) => {
          for(let item of res.data){
            _lastMonthIncome = parseFloat((_lastMonthIncome + item.total).toFixed(2));
            _lastMonthProfit = parseFloat((_lastMonthProfit + item.totalprofit).toFixed(2));
          }
          if (_lastMonthIncome == 0)
            return;
          this.$http.post('/api/saveMonthTotalToUserSetting',{
            userid : this.$store.state.user.user_id,
            colTotal : columnTotal,
            lastMonthTotal: _lastMonthIncome,
            colProfit : columnProfit,
            lastMonthProfit : _lastMonthProfit
          }).then( (res) => {
            UserSettingAry[columnTotal] = _lastMonthIncome;
            UserSettingAry[columnProfit] = _lastMonthProfit;
            saveToLocal(1,'userSetting',UserSettingAry);
          })
        })
        
      },
			
			completeColor: function() {
				if(this.e6 > 1)
					return 'blue';
			}
    },

    mounted: function() {
      this.checkDate();
		}
  }
</script>