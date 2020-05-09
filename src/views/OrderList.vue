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
              <v-icon v-if="deleteEnabled">mdi-delete-off</v-icon>
              <v-icon v-if="!deleteEnabled">mdi-delete</v-icon>
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
            loading="loading"
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
              mdi-pencil
            </v-icon>
            <v-icon v-if="canDelete(item)"
              small
              @click="deleteItem(item.id)"
            >
              mdi-close
            </v-icon>
          </template>
          <template v-slot:item.medtype="{ item }">
            <v-chip :color="getColor(item.medtype)" dark>{{ item.medtype }}</v-chip>
          </template>
          <template v-slot:expanded-item="{ item }">
            <td :colspan="8">
              <v-btn text small color="green">打印</v-btn>
              <div>
                <h4 style="text-align:center;">处  方</h4>
                <br>
                <hr style="height:1px;border:none;border-top:1px solid #555555;" />
                 <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <td :colspan="2"><p>姓名： {{item.patient}}</p></td>
                        <td :colspan="2"><p>年龄： {{item.age}}</p></td>
                        <td :colspan="2"><p>性别： {{item.sex}}</p></td>
                        <td :colspan="2"><p>电话:  {{item.phone}}</p></td>
                      </tr>
                      <tr>
                        <td  :colspan="6" style="border-bottom:1px solid"><p>症状： {{item.symptom}}</p></td>
                        <td  :colspan="2" style="border-bottom:1px solid"><p>备注： {{item.order_comment}}</p></td>
                      </tr>
                      <tr v-for="element in item.medarray" :key="element.name">
                        <td>{{ JSON.parse(element).name1 }}</td>
                        <td>{{ JSON.parse(element).count1 }}</td>
                        <td>{{ JSON.parse(element).name2 }}</td>
                        <td>{{ JSON.parse(element).count2 }}</td>
                        <td>{{ JSON.parse(element).name3 }}</td>
                        <td>{{ JSON.parse(element).count3 }}</td>
                        <td>{{ JSON.parse(element).name4 }}</td>
                        <td>{{ JSON.parse(element).count4 }}</td>
                      </tr>
                      <tr>
                        <td :colspan="6"></td>
                        <td :colspan="2"><p>{{item.dose}}付</p></td>
                      </tr>
                      <tr>
                        <td :colspan="6" style="border-bottom:1px solid"></td>
                        <td :colspan="2" style="border-bottom:1px solid"><p>价钱： {{item.total}}元</p></td>
                      </tr>
                      <tr>
                        <td :colspan="6"><p>处方医师：  崔云杰</p></td>
                        <td :colspan="2"><p>日期： {{item.date}}</p></td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </td>              
          </template>
          </v-data-table>
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
              mdi-bell-plus
            </v-icon>
            {{notification}}
            <v-btn
              icon
              @click="snackbar = false"
            >
              <v-icon>
                mdi-close-circle
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
          text: '名字',
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
        let fromlocal = loadFromLocal(1,'cacheOrder',[]);

        if(fromlocal.length == 0){
          this.$http.get('/api/getAllOrd',{
            params: {
              dbs_a : this.$store.state.user.dbs_prefix+'ordlist',
              dbs_b : this.$store.state.user.dbs_prefix+'patient',
            }
          }).then( (res) => {
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

      getColor (medtype) {
        if (medtype == '免煎') return 'lime darken-2'
        else if (medtype == '西药') return 'blue lighten-2'
        else if(medtype == "药丸") return 'deep-purple lighten-2'
        else return 'green'
      },

      reuse: function(){

      },

      deleteItem(ordId){
        this.$http.delete('/api/deleteOrdbyId',{
          params: {
            dbs : this.$store.state.user.dbs_prefix+'ordlist',
						id : ordId
					}
        }).then( (res) => {
          this.snackbar = true;
          this.notification = '删除成功';
          this.snackbarColor = 'green';
          this.getAll();
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
      }
    },


    mounted: function() {
      this.getAll();      
		}

    
  }
</script>
