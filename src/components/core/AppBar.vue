<template>
  <v-app-bar
    id="core-app-bar"
    absolute
    app
    color="transparent"
    flat
    height="88"
  >
    <v-toolbar-title class="tertiary--text font-weight-light align-self-center">
      <v-btn
        icon
        @click.stop="onClick"
      >
        <v-icon>mdi-view-list</v-icon>
      </v-btn>
      {{ title }}
    </v-toolbar-title>

    <v-spacer />

    <v-toolbar-items>
      <v-row
        align="center"
        class="mx-0"
      >

        <v-btn
          icon
          to="/settings"
        >
          <v-icon color="tertiary">
            mdi-account
          </v-icon>
        </v-btn>

        <v-btn
          icon
          @click="reloadData"
        >
          <v-icon color="tertiary">
            mdi-refresh
          </v-icon>
        </v-btn>

<!--         <v-menu
          bottom
          left
          offset-y
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              class="toolbar-items"
              icon
              to="/notifications"
              v-bind="attrs"
              v-on="on"
            >
              <v-badge
                color="error"
                overlap
              >
                <template slot="badge">
                  {{ notifications.length }}
                </template>
                <v-icon color="tertiary">
                  mdi-bell
                </v-icon>
              </v-badge>
            </v-btn>
          </template>

          <v-card>
            <v-list dense>
              <v-list-item
                v-for="notification in notifications"
                :key="notification"
                @click="onClick"
              >
                <v-list-item-title v-text="notification" />
              </v-list-item>
            </v-list>
            <v-btn block color="blue-grey" dark class="mb-3">全部删除</v-btn>
          </v-card>
        </v-menu> -->

        <v-btn
          @click="logout"
          icon
        >
          <v-icon color="tertiary">
            mdi-logout
          </v-icon>
        </v-btn>
      </v-row>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
  // Utilities
  import {
    mapMutations
  } from 'vuex'

  import { saveToLocal} from '../../utils/handleLocalStorage';
  import { dateToString} from '../../utils/handleDate';
  export default {
    data: () => ({
      notifications: [
        'Mike, John responded to your email',
        'You have 5 new tasks',
        'You\'re now a friend with Andrew',
        'Another Notification',
        'Another One'
      ],
      title: null,
      responsive: false
    }),

    watch: {
      '$route' (val) {
        this.title = val.name
      }
    },

    mounted () {
      this.onResponsiveInverted()
      window.addEventListener('resize', this.onResponsiveInverted)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.onResponsiveInverted)
    },

    methods: {
      ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
      onClick () {
        this.setDrawer(!this.$store.state.app.drawer)
      },
      onResponsiveInverted () {
        if (window.innerWidth < 991) {
          this.responsive = true
        } else {
          this.responsive = false
        }
      },

      reloadData: function(){
        window.localStorage.clear();
        saveToLocal(1,'updated_date', new Date().toDateString());
        this.loadData();
        this.loadUserConfig();
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
            location.reload();
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

      logout: function(e){
        e.preventDefault();
        this.$store.dispatch('user/FedLogOut').then(() => {
          this.$router.push({ path: '/login' });
        }).catch(err => {
          this.$message.error(err);
        });
      }
    },
  }
</script>

<style>
  /* Fix coming in v2.0.8 */
  #core-app-bar {
    width: auto;
  }

  #core-app-bar a {
    text-decoration: none;
  }
</style>
