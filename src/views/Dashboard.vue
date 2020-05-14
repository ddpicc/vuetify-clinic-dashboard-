<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        lg="4"
      >
        <material-linechart-card
          :data="dailySalesChart.data"
          color="grey"
          :chartColor="['#FFB677', '#666']"
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
          color="orange"
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
          color="green"
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
          value="$34,245"
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
          value="49/50"
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
          value="75"
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
          value="245"
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
          title="当天收入"
          value="$34,245"
          sub-icon="mdi-calendar"
          :sub-text="todayDate()"
        />
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <material-stats-card
          color="green"
          icon="mdi-store"
          title="当天收入"
          value="$34,245"
          sub-icon="mdi-calendar"
          :sub-text="todayDate()"
        />
      </v-col>

      <v-col
        cols="12"
        lg="6"
      >
        <material-card
          color="orange"
          title="Employee Stats"
          text="New employees on 15th September, 2016"
        >
          <v-data-table
            :headers="headers"
            :items="items"
            hide-default-footer
          />
        </material-card>
      </v-col>

      <v-col
        cols="12"
        lg="6"
      >
        <material-card
          class="card-tabs"
          color="green"
        >
          <template v-slot:header>
            <v-tabs
              v-model="tabs"
              background-color="transparent"
              slider-color="white"
            >
              <span
                class="subheading font-weight-light mx-3"
                style="align-self: center"
              >Tasks:</span>
              <v-tab class="mr-3">
                <v-icon class="mr-2">
                  mdi-bug
                </v-icon>
                Bugs
              </v-tab>
              <v-tab class="mr-3">
                <v-icon class="mr-2">
                  mdi-code-tags
                </v-icon>
                Website
              </v-tab>
              <v-tab>
                <v-icon class="mr-2">
                  mdi-cloud
                </v-icon>
                Server
              </v-tab>
            </v-tabs>
          </template>

          <v-tabs-items v-model="tabs">
            <v-tab-item
              v-for="n in 3"
              :key="n"
            >
              <v-list
                three-line
                class="py-0"
              >
                <v-list-item @click="complete(0)">
                  <v-list-item-action class="align-self-center">
                    <v-checkbox
                      :value="list[0]"
                      color="green"
                    />
                  </v-list-item-action>

                  <v-list-item-title>
                    Sign contract for "What are conference organized afraid of?"
                  </v-list-item-title>

                  <div class="d-flex">
                    <v-tooltip
                      top
                      content-class="top"
                    >
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          class="v-btn--simple"
                          color="green"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon color="primary">
                            mdi-pencil
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Edit</span>
                    </v-tooltip>

                    <v-tooltip
                      top
                      content-class="top"
                    >
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          class="v-btn--simple"
                          color="danger"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon color="error">
                            mdi-close
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Close</span>
                    </v-tooltip>
                  </div>
                </v-list-item>

                <v-divider />

                <v-list-item @click="complete(1)">
                  <v-list-item-action class="align-self-center">
                    <v-checkbox
                      :value="list[1]"
                      color="green"
                    />
                  </v-list-item-action>

                  <v-list-item-title>
                    Lines From Great Russian Literature? Or E-mails From My Boss?
                  </v-list-item-title>

                  <div class="d-flex">
                    <v-tooltip
                      top
                      content-class="top"
                    >
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          class="v-btn--simple"
                          color="green"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon color="primary">
                            mdi-pencil
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Edit</span>
                    </v-tooltip>

                    <v-tooltip
                      top
                      content-class="top"
                    >
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          class="v-btn--simple"
                          color="danger"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon color="error">
                            mdi-close
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Close</span>
                    </v-tooltip>
                  </div>
                </v-list-item>

                <v-divider />

                <v-list-item @click="complete(2)">
                  <v-list-item-action class="align-self-center">
                    <v-checkbox
                      :value="list[2]"
                      color="green"
                    />
                  </v-list-item-action>

                  <v-list-item-title>
                    Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit
                  </v-list-item-title>

                  <div class="d-flex">
                    <v-tooltip
                      top
                      content-class="top"
                    >
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          class="v-btn--simple"
                          color="green"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon color="primary">
                            mdi-pencil
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Edit</span>
                    </v-tooltip>

                    <v-tooltip
                      top
                      content-class="top"
                    >
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          class="v-btn--simple"
                          color="danger"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon color="error">
                            mdi-close
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Close</span>
                    </v-tooltip>
                  </div>
                </v-list-item>
              </v-list>
            </v-tab-item>
          </v-tabs-items>
        </material-card>
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <TimeLine/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TimeLine from '../components/helper/TimeLine'
import { dateToString, stringToDate} from '../utils/handleDate';
import { saveToLocal, loadFromLocal} from '../utils/handleLocalStorage';
  export default {
    components: {TimeLine},
    data () {
      return {
        infocolor: ['#FFB677', '#436790'],
        dailySalesChart: {
          data: [],
        },
        monthSalesChart: {
          data: [],
        },
        dailyNmPeopleChart: {
          data: [],
        },
        dataCompletedTasksChart: {
          data: {
            labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
            series: [
              [230, 750, 450, 300, 280, 240, 200, 190]
            ]
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.cardinal({
              tension: 0
            }),
            low: 0,
            high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }
          }
        },
        emailsSubscriptionChart: {
          data: {
            labels: ['Ja', 'Fe', 'Ma', 'Ap', 'Mai', 'Ju', 'Jul', 'Au', 'Se', 'Oc', 'No', 'De'],
            series: [
              [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

            ]
          },
          options: {
            axisX: {
              showGrid: false
            },
            low: 0,
            high: 1000,
            chartPadding: {
              top: 0,
              right: 5,
              bottom: 0,
              left: 0
            }
          },
          responsiveOptions: [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0]
                }
              }
            }]
          ]
        },
        headers: [
          {
            sortable: false,
            text: 'ID',
            value: 'id'
          },
          {
            sortable: false,
            text: 'Name',
            value: 'name'
          },
          {
            sortable: false,
            text: 'Salary',
            value: 'salary',
            align: 'right'
          },
          {
            sortable: false,
            text: 'Country',
            value: 'country',
            align: 'right'
          },
          {
            sortable: false,
            text: 'City',
            value: 'city',
            align: 'right'
          }
        ],
        items: [
          {
            id: 1,
            name: 'Dakota Rice',
            country: 'Niger',
            city: 'Oud-Tunrhout',
            salary: '$35,738'
          },
          {
            id: 2,
            name: 'Minerva Hooper',
            country: 'Curaçao',
            city: 'Sinaai-Waas',
            salary: '$23,738'
          },
          {
            id: 3,
            name: 'Sage Rodriguez',
            country: 'Netherlands',
            city: 'Overland Park',
            salary: '$56,142'
          },
          {
            id: 4,
            name: 'Philip Chanley',
            country: 'Korea, South',
            city: 'Gloucester',
            salary: '$38,735'
          },
          {
            id: 5,
            name: 'Doris Greene',
            country: 'Malawi',
            city: 'Feldkirchen in Kārnten',
            salary: '$63,542'
          }
        ],
        tabs: 0,
        list: {
          0: false,
          1: false,
          2: false
        }
      }
    },
    methods: {
      complete (index) {
        this.list[index] = !this.list[index]
      },

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
      

      loadMonth: function(){
        var end = dateToString(new Date(new Date().setDate(new Date().getDate()-1)));
        var start = dateToString(new Date(new Date().setDate(new Date().getDate()-30)));
        var last30daysIncome = [];
        var last30daysNum = [];
        this.$http.get('/api/getChartInfoFromOrder', {
          params: {
            dbs : this.$store.state.user.dbs_prefix+'ordlist',
            startDate: start,
            endDate: end
          }
        }).then(response => {
          this.$nextTick( () => {
            let index = 0;
            let curDate = '';            
            for(let item of response.data){
              if(item.date != curDate){
                index = parseInt((new Date() - stringToDate(item.date)) / (1000 * 60 * 60 * 24));
                curDate = item.date;
                last30daysIncome[index] = item.total;
                last30daysNum[index] = 1;
              }
              else{
                last30daysIncome[index] = parseFloat((last30daysIncome[index] + item.total).toFixed(2));
                last30daysNum[index] = last30daysNum[index] + 1;
              }
            }
            for(var i = 1;i<=30;i++) {
              this.dailySalesChart.data.push([dateToString(new Date(new Date().setDate(new Date().getDate()-i))),last30daysIncome[i]]);
              this.dailyNmPeopleChart.data.push([dateToString(new Date(new Date().setDate(new Date().getDate()-i))),last30daysNum[i]]);
            }
          })
        })
      },

      loadDataAndSetupChart: function(){
        let fromlocal = loadFromLocal(1,'cacheOrder',[]);
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
            this.calculateData(res.data);
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
            this.calculateData(data30Days);
          })
        }
      },

      calculateData: function(data30Days){
        let index = 0;
        let curDate = '';
        var last30daysIncome = [];
        var last30daysNum = [];
        for(let item of data30Days){
          if(item.data == dateToString(new Date())){

          }
          if(item.date.substring(0,4) == this.todayMonth()){

          }
          if(item.date != curDate){
            index = parseInt((new Date() - stringToDate(item.date)) / (1000 * 60 * 60 * 24));
            curDate = item.date;
            last30daysIncome[index] = item.total;
            last30daysNum[index] = 1;
          }
          else{
            last30daysIncome[index] = parseFloat((last30daysIncome[index] + item.total).toFixed(2));
            last30daysNum[index] = last30daysNum[index] + 1;
          }
          if(index > 30){
            break;
          }
        }
        for(var i=0;i<30;i++) {
          this.dailySalesChart.data.push([dateToString(new Date(new Date().setDate(new Date().getDate()-i))),last30daysIncome[i]]);
          this.dailyNmPeopleChart.data.push([dateToString(new Date(new Date().setDate(new Date().getDate()-i))),last30daysNum[i]]);
        }
      }

    },

    mounted: function() {
			this.loadDataAndSetupChart();
		}
  }
</script>
