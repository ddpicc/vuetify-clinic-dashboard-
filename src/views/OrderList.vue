<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card flat color="primary">
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
              <v-icon v-if="deleteEnabled">mdi-trash-can-outline</v-icon>
              <v-icon v-if="!deleteEnabled">mdi-trash-can</v-icon>
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
            :items-per-page="-1"
            :loading="loading"
            hide-default-footer
          >
          <template v-slot:top>
            <v-row class="mx-2" align="center">
              <v-text-field v-model="searchStr" label="按姓名或电话搜索..." @input="onSearchInput"></v-text-field>
              <v-btn class="ml-4" color="primary" dark small @click="startNewOrder">开处方</v-btn>
            </v-row>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              small
              class="mr-2"
              title="复用处方"
              @click="reuse(item)"
            >
              mdi-content-copy
            </v-icon>
            <v-icon
              small
              class="mr-2"
              title="只复用病人信息"
              @click="reusePatientInfo(item)"
            >
              mdi-account-outline
            </v-icon>
            <v-icon v-if="canDelete(item)"
              small
              @click="deleteItem(item)"
            >
              mdi-close
            </v-icon>
          </template>
          <template v-slot:item.medtype="{ item }">
            <v-chip :color="getColor(item.medtype)" dark>{{ item.medtype }}</v-chip>
          </template>
          <template v-slot:expanded-item="{ item }">
            <td :colspan="8">
              <v-btn text small color="primary" @click="startPrint">打印</v-btn>
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
          <div class="text-center pt-2" v-if="total > 0">
            <v-pagination
              v-model="page"
              :length="pageCount"
              :total-visible="7"
              :disabled="loading"
              @input="onPageChange"
            />
            <div class="caption mt-2">第 {{ page }} / {{ pageCount }} 页，共 {{ total }} 条处方</div>
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
              mdi-bell
            </v-icon>
            {{notification}}
            <v-btn
              icon
              @click="snackbar = false"
            >
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-snackbar>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { getNowFormatDate} from '../utils/handleDate';
  export default {
    data: () => ({
      searchStr: '',
      deleteEnabled: false,
      displayYaowan: false,
      loading: false,
      expanded: [],
      page: 1,
      pageSize: 30,
      total: 0,
      searchTimer: null,
      requestId: 0,
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

    computed: {
      pageCount: function() {
        return Math.max(1, Math.ceil(this.total / this.pageSize));
      }
    },

    methods: {
      normalizeItems: function(items, page = this.page) {
        return (Array.isArray(items) ? items : []).map((element, index) => {
          element.medarray = element.medarray ? element.medarray.split(";") : [];
          element.pid = (page - 1) * this.pageSize + index + 1;
          return element;
        });
      },

      loadOrders: function(requestedPage = 1) {
        this.loading = true;
        const currentPage = Number(requestedPage) || 1;
        const currentSearch = this.searchStr;
        const currentRequestId = ++this.requestId;
        this.$http.get('/api/searchOrders', {
          params: {
            dbPrefix: this.$store.state.user.dbs_prefix,
            name: currentSearch,
            page: currentPage,
            pageSize: this.pageSize,
            hideYaowan: !this.displayYaowan,
          }
        }).then((res) => {
          if (currentRequestId !== this.requestId) return;
          const data = res.data || {};
          this.total = Number(data.total) || 0;
          this.page = currentPage;
          this.items = this.normalizeItems(data.items, currentPage);
        }).finally(() => {
          if (currentRequestId === this.requestId) this.loading = false;
        });
      },

      onPageChange: function(page) {
        this.loadOrders(page);
      },

      onSearchInput: function() {
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => this.loadOrders(1), 300);
      },

      startNewOrder: function() {
        this.$router.push({ name: '生成处方' });
      },

      reusePatientInfo: function(item) {
        this.$router.push({
          name: '生成处方',
          params: {
            ord_item: {
              patient: item.patient,
              patient_name: item.patient,
              patient_id: item.patient_id,
              sex: item.sex,
              age: item.age,
              phone: item.phone,
            }
          }
        });
      },

      getColor (medtype) {
        if (medtype == '免煎') return 'teal'
        else if (medtype == '西药') return 'blue'
        else if(medtype == "药丸") return 'deep-purple'
        else return 'primary'
      },

      reuse: function(selectedItem){
        //alert(JSON.stringify(selectedItem));
        //this.$store.dispatch('order/setOrderToVuex', selectedItem);
        //this.$router.push({path: '/orderCreate'});
        this.$router.push({name: '生成处方', params: {ord_item: selectedItem}});
      },

      deleteItem(oneOrder){
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
            this.loadOrders(1);
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
      this.displayYaowan = this.$store.getters['userconfig/displayYaowan'];
      this.loadOrders(1);
		},

    beforeDestroy: function() {
      clearTimeout(this.searchTimer);
    }
  }
</script>
<style scoped>
  .smallHeight .v-data-table td{
    height: 20px;
    font-size: 14px;
  }
</style>
