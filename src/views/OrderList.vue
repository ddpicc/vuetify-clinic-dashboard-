<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card flat color="green">
          <template v-slot:header>
            <div class="px-3">
              <div class="title font-weight-light mb-2">
                &nbsp;&nbsp;&nbsp;&nbsp;处&nbsp;&nbsp;&nbsp;&nbsp;方
              </div>
            </div>
						<v-spacer />   

						<v-btn
              absolute
              dark
              fab
              top
              right
              color="amber"
              @click="deleteEnabled = !deleteEnabled"
            >
              <v-icon v-if="deleteEnabled">fa-trash-o</v-icon>
              <v-icon v-if="!deleteEnabled">fa-trash</v-icon>
            </v-btn>
          </template>
          <!--  need a key of id -->
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="id"
            show-expand
            single-expand
            :expanded.sync="expanded"
            :items-per-page="15"
            :search="searchStr"
            :custom-filter="filterText"
            :loading="loading"
          >
          <template v-slot:top>
            <v-text-field v-model="searchStr" label="搜索..." class="mx-4"></v-text-field>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="reuse(item)"
            >
              fa-angle-double-left
            </v-icon>
            <v-icon v-if="canDelete(item)"
              small
              @click="deleteItem(item)"
            >
              fa-close
            </v-icon>
          </template>
          <template v-slot:item.medtype="{ item }">
            <v-chip :color="getColor(item.medtype)" dark>{{ item.medtype }}</v-chip>
          </template>
          <template v-slot:expanded-item="{ item }">
            <td :colspan="8">
              <v-btn text small color="green" @click="startPrint">打印</v-btn>
              <div ref="print" class="smallHeight">
                <h4 style="text-align:center;">宛&nbsp;城&nbsp;云&nbsp;杰&nbsp;诊&nbsp;所</h4>
                <h5 style="text-align:center;">处&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方</h5>
                <br>
                <hr style="margin-top:5px;height:1px;border:none;border-top:1px solid #555555;" />
                 <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <td :colspan="2"><p>姓名:{{item.patient}} </p></td>
                        <td :colspan="1"><p>性别:{{item.sex}}</p></td>
                        <td :colspan="1"><p>年龄:{{item.age}}</p></td>
                      </tr>
                      <tr>
                        <td :colspan="4" ><p>症状:{{item.symptom}}</p></td>
                      </tr>
                      <tr>
                        <td :colspan="2" style="border-bottom:1px solid"><p>电话:{{item.phone}}</p></td>
                        <td :colspan="2" style="border-bottom:1px solid"><p>备注:{{item.order_comment}}</p></td>
                      </tr>
                      <tr v-for="element in item.medarray" :key="element.name">
                        <td style="width:23%" v-if="!JSON.parse(element).medComment1">{{ JSON.parse(element).name1 }} {{ JSON.parse(element).count1 }}</td>
                        <td style="width:50%" v-if="JSON.parse(element).medComment1">{{ JSON.parse(element).name1 }} {{ JSON.parse(element).count1 }}</td>
                        <td style="width:30%" v-if="JSON.parse(element).medComment1">{{ JSON.parse(element).medComment1 }}</td>
                        <td style="width:10%" v-if="JSON.parse(element).medComment1"></td> 
                        <td style="width:10%" v-if="JSON.parse(element).medComment1"></td> 
                        <td style="width:23%">{{ JSON.parse(element).name2 }} {{ JSON.parse(element).count2 }}</td>
                        <td style="width:23%">{{ JSON.parse(element).name3 }} {{ JSON.parse(element).count3 }}</td>
                        <td style="width:31%">{{ JSON.parse(element).name4 }} {{ JSON.parse(element).count4 }}</td>
                      </tr>
                      <tr>
                        <td :colspan="3"></td>
                        <td :colspan="1"><p>{{item.dose}}付</p></td>
                      </tr>
                      <tr>
                        <td :colspan="3" style="border-bottom:1px solid"></td>
                        <td :colspan="1" style="border-bottom:1px solid"><p>价钱： {{item.total}}元</p></td>
                      </tr>
                      <tr>
                        <td :colspan="2"><p>处方医师：  崔云杰</p></td>
                        <td :colspan="2"><p>日期： {{item.date}}</p></td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </td>              
          </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-btn block color=green dark class="mr-2" @click="loadAll">读取全部</v-btn>
          </div>
          <v-snackbar
            v-model="snackbar"
            :color="snackbarColor"
            :timeout="3000"
            top
            dark
          >
            <v-icon
              color="white"
              class="mr-3"
            >
              fa-bell
            </v-icon>
            {{notification}}
            <v-btn
              icon
              @click="snackbar = false"
            >
              <v-icon>
                fa-close
              </v-icon>
            </v-btn>
          </v-snackbar>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { dateToString, stringToDate, getNowFormatDate} from '../utils/handleDate';
  import { saveToLocal, loadFromLocal} from '../utils/handleLocalStorage';
  var pinyin = require("pinyin");
  export default {
    data: () => ({
      searchStr: '',
      deleteEnabled: false,
      displayYaowan: false,
      loading: false,
      expanded: [],
      snackbar: false,
      snackbarColor: '',
      notification: '',
      headers: [
        { text: '', value: 'data-table-expand' },
        { text: '序号', value: 'pid' },
        {
          sortable: false,
          text: '姓名',
          value: 'patient'
        },
        {
          sortable: false,
          text: '类型',
          value: 'medtype'
        },
        {
          sortable: false,
          text: '数量',
          value: 'dose'
        },
        {
          sortable: false,
          text: '总价',
          value: 'total',
        },
        {
          sortable: true,
          text: '日期',
          value: 'date',
        },
        {
          sortable: false,
          text: '操作',
          value: 'action',
        }
      ],
      items: []
    }),

    methods: {
      //搜索
      filterText (value, search, item) {
        if(value !=null && search !=null && typeof value === 'string'){
          if(value.toString().indexOf(search) !== -1 || pinyin(value.toString(),{style: pinyin.STYLE_FIRST_LETTER}).join("").indexOf(search) !== -1){
            return true;
          }
        }else{
          return false;
        }
      },

      // 获取全部数据
      getAll: function() {
        this.loading = true;
        let idStartFrom = 0;
        let fromlocal = loadFromLocal(this.$store.state.user.user_id,'cacheOrder',[]);
        let userSetting = loadFromLocal(this.$store.state.user.user_id,'userSetting', []);
        this.displayYaowan = userSetting[0]['displayYaowan'];

        if(fromlocal.length == 0){
          this.$http.get('/api/getAllOrd',{
            params: {
              dbs_a : this.$store.state.user.dbs_prefix+'ordlist',
              dbs_b : this.$store.state.user.dbs_prefix+'patient',
            }
          }).then( (res) => {
            if(!this.displayYaowan){
              res.data = res.data.filter(function (e) { return e.medtype != '药丸'; });
            }
            for(let element of res.data) {
              element.medarray = element.medarray.split(";");
              idStartFrom = idStartFrom + 1;
              element.pid = idStartFrom;
            }
            this.items = res.data;
            this.loading = false;
          })
        }else{
          this.$http.get('/api/getOrdByDate',{
            params: {
              dbs_a : this.$store.state.user.dbs_prefix+'ordlist',
              dbs_b : this.$store.state.user.dbs_prefix+'patient',
              dateBy: dateToString(new Date())
            }
          }).then( (res) => {
            if(!this.displayYaowan){
              res.data = res.data.filter(function (e) { return e.medtype != '药丸'; });
              fromlocal = fromlocal.filter(function (e) { return e.medtype != '药丸'; });
            }
            for(let element of res.data) {
              element.medarray = element.medarray.split(";");
              idStartFrom = idStartFrom + 1;
              element.pid = idStartFrom;              
            }
            for(let ele of fromlocal){
              ele.medarray = ele.medarray.split(";");
              idStartFrom = idStartFrom + 1;
              ele.pid = idStartFrom;
            }
            this.items = res.data;
            this.items = this.items.concat(fromlocal);
            this.loading = false;
          })
        }
      },

      loadAll: function(){
        //load all
        this.loading = true;
        let idStartFrom = 0;
        let userSetting = loadFromLocal(this.$store.state.user.user_id,'userSetting', []);
        this.displayYaowan = userSetting[0]['displayYaowan'];
        this.$http.get('/api/getAllOrd',{
          params: {
            dbs_a : this.$store.state.user.dbs_prefix+'ordlist',
            dbs_b : this.$store.state.user.dbs_prefix+'patient',
          }
        }).then( (res) => {
          if(!this.displayYaowan){
            res.data = res.data.filter(function (e) { return e.medtype != '药丸'; });
          }
          for(let element of res.data) {
            element.medarray = element.medarray.split(";");
            idStartFrom = idStartFrom + 1;
            element.pid = idStartFrom;
          }
          this.items = res.data;
          this.loading = false;
        })
      },

      getColor (medtype) {
        if (medtype == '免煎') return 'lime darken-2'
        else if (medtype == '西药') return 'blue lighten-2'
        else if(medtype == "药丸") return 'deep-purple lighten-2'
        else return 'green'
      },

      reuse: function(selectedItem){
        //alert(JSON.stringify(selectedItem));
        //this.$store.dispatch('order/setOrderToVuex', selectedItem);
        //this.$router.push({path: '/orderCreate'});
        this.$router.push({name: '生成处方', params: {ord_item: selectedItem}});
      },

      deleteItem(oneOrder){
        //update med inventory
        var sqlStatement = '';
        if(oneOrder.medtype == '免煎' || oneOrder.medtype == '西药'){
          this.$http.get('/api/getAllMedbyType',{
            params: {
              dbs : this.$store.state.user.dbs_prefix+'medlist',
              medtype : oneOrder.medtype
            }
          }).then( (res) => {
            let cacheMedData = res.data;
            for(let oneMed of oneOrder.medarray) {
              oneMed = JSON.parse(oneMed);
              if(typeof(oneMed.name1) == 'undefined')
                break;
              else{
                var existInDb = cacheMedData.find(function(p){
                return p.medname === oneMed.name1;
                })
                if(typeof(existInDb) != 'undefined'){
                  let countCost = parseInt(oneMed.count1) * oneOrder.dose;
                  let oneSqlString = 'UPDATE ' + this.$store.state.user.dbs_prefix+'medlist' +  ' SET inventoryNm = inventoryNm + ' + countCost + " WHERE medname = '" + oneMed.name1 + "';";
                  sqlStatement = sqlStatement + oneSqlString;
                }
              }
              if(typeof(oneMed.name2) == 'undefined')
                break;
              else{
                var existInDb = cacheMedData.find(function(p){
                return p.medname === oneMed.name2;
                })
                if(typeof(existInDb) != 'undefined'){
                  let countCost = parseInt(oneMed.count2) * oneOrder.dose;
                  let oneSqlString = 'UPDATE ' + this.$store.state.user.dbs_prefix+'medlist' +  ' SET inventoryNm = inventoryNm + ' + countCost + " WHERE medname = '" + oneMed.name2 + "';";
                  sqlStatement = sqlStatement + oneSqlString;
                }
              }
              if(typeof(oneMed.name3) == 'undefined')
                break;
              else{
                var existInDb = cacheMedData.find(function(p){
                return p.medname === oneMed.name3;
                })
                if(typeof(existInDb) != 'undefined'){
                  let countCost = parseInt(oneMed.count3) * oneOrder.dose;
                  let oneSqlString = 'UPDATE ' + this.$store.state.user.dbs_prefix+'medlist' +  ' SET inventoryNm = inventoryNm + ' + countCost + " WHERE medname = '" + oneMed.name3 + "';";
                  sqlStatement = sqlStatement + oneSqlString;
                }
              }
              if(typeof(oneMed.name4) == 'undefined')
                break;
              else{
                var existInDb = cacheMedData.find(function(p){
                return p.medname === oneMed.name4;
                })
                if(typeof(existInDb) != 'undefined'){
                  let countCost = parseInt(oneMed.count4) * oneOrder.dose;
                  let oneSqlString = 'UPDATE ' + this.$store.state.user.dbs_prefix+'medlist' +  ' SET inventoryNm = inventoryNm + ' + countCost + " WHERE medname = '" + oneMed.name4 + "';";
                  sqlStatement = sqlStatement + oneSqlString;
                }
              }
            }
            this.$http.post('/api/updateMedInventory',{
              sqlStatement : sqlStatement,
            }).then( (res) => {
              console.log('update med success');
            })
          })
        }
        
        this.$http.post('/api/updatePatientTimes',{
          dbs : this.$store.state.user.dbs_prefix+'patient',
          patient_id: oneOrder.patient_id,
          change: -1,
        }).then( (res) => {
          this.$http.delete('/api/deleteOrdbyId',{
            params: {
              dbs : this.$store.state.user.dbs_prefix+'ordlist',
              id : oneOrder.id,
            }
          }).then( (res) => {            
            this.snackbar = true;
            this.notification = '删除成功';
            this.snackbarColor = 'green';
            this.getAll();
          })
        })
      },

      canDelete: function(item){
        if(this.deleteEnabled){
          if(getNowFormatDate() == item.date)
            return true;
          else
            return false;
        }
        else
          return false;
      },

      startPrint: function(){
					this.$print(this.$refs.print);
				}
    },


    mounted: function() {
      this.getAll();      
		}
  }
</script>
<style scoped>
  .smallHeight .v-data-table td{
    height: 20px;
    font-size: 14px;
  }
</style>
