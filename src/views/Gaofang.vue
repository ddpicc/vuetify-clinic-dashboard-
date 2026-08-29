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
                &nbsp;&nbsp;&nbsp;&nbsp;药&nbsp;&nbsp;&nbsp;&nbsp;膏
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
              @click="openAddDialog()"
            >
              <v-icon>mdi-plus</v-icon>
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
            hide-default-footer
          >
          <template v-slot:top>
            <v-text-field v-model="searchStr" label="搜索..." class="mx-4"></v-text-field>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn
              small
              class="mr-2"
              v-if="item.status == '已取膏'"
              @click="reuse(item)"
            >
              重用
            </v-btn>
            <v-btn
              small
              class="mr-2"
              v-if="item.status != '已取膏'"
              @click="updateStatus(item)"
            >
              更新
            </v-btn>
            <v-btn
              small
              @click="deleteItem(item)"
            >
              删除
            </v-btn>
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
                        <td :colspan="2"><p>姓名:{{item.name}} </p></td>
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
                        <td style="width:23%">{{ JSON.parse(element).name1 }} {{ JSON.parse(element).count1 }}</td>
                        <td style="width:23%">{{ JSON.parse(element).name2 }} {{ JSON.parse(element).count2 }}</td>
                        <td style="width:23%">{{ JSON.parse(element).name3 }} {{ JSON.parse(element).count3 }}</td>
                        <td style="width:31%">{{ JSON.parse(element).name4 }} {{ JSON.parse(element).count4 }}</td>
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
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              dark
            >
              {{ item.status }}
            </v-chip>
          </template>
          </v-data-table>
          <v-btn block color="primary" dark class="mt-5" @click="loadMore">读取更多</v-btn>

          <v-dialog v-model="addialog" max-width="800px">
            <v-card>
              <v-card-title>
                <span class="headline">录入信息</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col sm="4" md="6">
                      <v-text-field v-model="patientName"
                        label="姓名"
                        append-outer-icon="mdi-magnify"
                        title="按姓名或电话查找患者"
                        @click:append-outer="searchPatient"
                      ></v-text-field>
                    </v-col>
                    <v-col sm="4" md="3">
                      <v-select v-model="patientSex"
                        :items="sexItems"
                        label="性别"
                      ></v-select>
                    </v-col>
                    <v-col sm="4" md="3">
                      <v-text-field v-model="patientAge"
                        label="年龄"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col sm="12" md="12">
                      <v-text-field v-model="patientPhone"
                        label="电话"
                      ></v-text-field>
                    </v-col>
                    <v-col sm="12" md="12">
                      <v-text-field v-model="patientSymptom"
                        label="主要症状"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="cancelDialog">取消</v-btn>
                <v-btn color="primary" text :loading="isSavingIntake" :disabled="isSavingIntake" @click="saveDialog">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="patientSearchDialog" max-width="700px">
            <v-card>
              <v-card-title>选择患者</v-card-title>
              <v-card-text>
                <div class="mb-2" v-if="patientSearchResults.length == 0">未找到患者，可继续手动填写，保存时将新建病人档案。</div>
                <div class="mb-2" v-else>点击患者，回填档案信息。</div>
                <v-data-table
                  class="patient-match-table"
                  :headers="patientMatchHeaders"
                  :items="patientSearchResults"
                  hide-default-footer
                  disable-pagination
                  @click:row="chooseSearchedPatient"
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="patientSearchDialog = false">取消</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="patientMatchDialog" max-width="700px">
            <v-card>
              <v-card-title>发现同名患者</v-card-title>
              <v-card-text>
                <div class="mb-2">点击患者，把膏方记录保存到他/她名下；或选择新建病人档案。</div>
                <v-data-table
                  class="patient-match-table"
                  :headers="patientMatchHeaders"
                  :items="patientMatchResults"
                  hide-default-footer
                  disable-pagination
                  @click:row="chooseMatchedPatient"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" dark @click="createNewMatchedPatient">新建病人档案</v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click="patientMatchDialog = false">取消</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="orderDialog" scrollable @click:outside="clearInfo()">
            <material-card flat full-width :color=cardColor>
              <template v-slot:header>
                <v-radio-group v-model="medRadio" :mandatory="false" row @change="radioChanged">
                  <v-radio label="草药" value="草药" color="grey darken-1"></v-radio>
                  <v-radio label="免煎" value="免煎" color="grey darken-1"></v-radio>
                </v-radio-group>
                <v-spacer />
                <v-text-field v-model="orderComment" class="ma-8"
                  label="备注"
                ></v-text-field>
                <v-btn small @click="postOrdToDb()">
                  确定
                </v-btn>
              </template>
              <v-data-table
                class="mt-5"
                :headers="orderHeaders"
                :items="medItems"
                item-key="name"
                :search="searchStr"
                :custom-filter="filterText"
                hide-default-footer
              >
              <template v-slot:top>
                <v-row 
                dense
                >
                  <v-col sm="6" md="6">
                    <v-autocomplete
                      label="药品"
                      :items="components"
                      :filter="customFilter"
                      dense
                      clearable
                      ref="mark1"
                      @keyup.enter.native="moveFocusToDose"
                      @update:search-input="searchChanged"
                      item-text="medname"
                      item-value="medname"
                      v-model="inputMed"
                      @focus="focus($event)"
                    >
                    <template v-slot:item="data">
                      <template>
                        <v-list-item-content>
                          <v-list-item-title>{{data.item.medname}}&nbsp;&nbsp;&nbsp;&nbsp;{{data.item.alias}}</v-list-item-title>
                          <v-list-item-subtitle>
                            价钱：{{data.item.sellprice}}&nbsp;&nbsp;&nbsp;&nbsp;库存：{{data.item.inventoryNm}}&nbsp;&nbsp;&nbsp;&nbsp;规格：{{data.item.spec}}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col sm="6" md="6">
                    <v-text-field
                      v-model="inputDose"
                      label="剂量"
                      dense
                      ref="mark2"
                      @keyup.enter.native="postToTb"
                      @focus="focus($event)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </template>
              <template v-slot:body.append="{ headers }">
                <tr>
                  <td :colspan="headers.length-2">
                  </td>
                  <td :colspan="2" align="right">
                    每付价钱: {{perOrdTotal}}元
                  </td>
                </tr>
              </template>
              <template v-slot:item.name1="{ item }">
                <v-chip v-if="item.name1" :color="getColor(item.count1)" outlined close @click:close="deleteMed(item.name1)">{{ item.name1 }}</v-chip>
              </template>
              <template v-slot:item.name2="{ item }">
                <v-chip v-if="item.name2" :color="getColor(item.count2)" close outlined @click:close="deleteMed(item.name2)">{{ item.name2 }}</v-chip>
              </template>
              <template v-slot:item.name3="{ item }">
                <v-chip v-if="item.name3" :color="getColor(item.count3)" close outlined @click:close="deleteMed(item.name3)">{{ item.name3 }}</v-chip>
              </template>
              <template v-slot:item.name4="{ item }">
                <v-chip v-if="item.name4" :color="getColor(item.count4)" close outlined @click:close="deleteMed(item.name4)">{{ item.name4 }}</v-chip>
              </template>
              </v-data-table>
            </material-card>
          </v-dialog>
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
  import { mapState } from 'vuex'
  export default {
    data: () => ({
      searchStr: '',
      loading: false,
      expanded: [],
      headers: [
        { text: '', value: 'data-table-expand' },
        { text: '序号', value: 'pid' },
        {
          sortable: false,
          text: '姓名',
          value: 'name'
        },
        {
          sortable: false,
          text: '症状',
          value: 'symptom'
        },
        {
          sortable: true,
          text: '状态',
          value: 'status'
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
      items: [],

      snackbar: false,
      snackbarColor: '',
      notification: '',
      addialog: false,
      sexItems: ['男', '女'],
      patientName: '',
      patient_id: null,
			patientAge: '',
      patientSex: '',
      patientPhone: '',
      patientSymptom: '',
      orderComment: '',
      orderDialog: false,
      orderHeaders: [{sortable: false, text: '名称', value: 'name1', width: '15%'}, {sortable: false,text: '数量', value: 'count1', width: '10%'}, {sortable: false,text: '名称', value: 'name2', width: '15%'}, {sortable: false,text: '数量', value: 'count2', width: '10%'}, 
                 {sortable: false,text: '名称', value: 'name3', width: '15%'}, {sortable: false,text: '数量', value: 'count3', width: '10%'}, {sortable: false,text: '名称', value: 'name4', width: '15%'}, {sortable: false,text: '数量', value: 'count4', width: '10%'}],
      medRadio: '草药',
      cardColor: 'primary',
      medItems: [],
      components: [],
      cacheMedData: [],
      orderMed1PerObj: [],
      inputMed: '',
      inputDose: '',
      medString: '',
      perOrdTotal: 0,
      notzero: v=> v > 0 || '不能是0',
      printOrderDialog: false,
      gaofangRecordId: null,
      isSavingIntake: false,
      patientMatchDialog: false,
      patientMatchResults: [],
      patientSearchDialog: false,
      patientSearchResults: [],
      patientMatchHeaders: [
        { text: '姓名', value: 'name', sortable: false },
        { text: '性别', value: 'sex', sortable: false },
        { text: '年龄', value: 'age', sortable: false },
        { text: '电话', value: 'phone', sortable: false },
        { text: '就医次数', value: 'visitTimes', sortable: false },
      ],
    }),
    computed: {
      ...mapState('page', ['offset']),
    },
    methods: {
      //搜索
      filterText (value, search) {
        return value != null && search != null && typeof value === 'string' && value.indexOf(search) !== -1;
      },
      //得到焦点的时候高亮文字
      focus(event) {
        event.currentTarget.select();
			},
      // 根据类型获取药品数据
      getAllMed: function() {
        this.$http.get('/api/getAllMedbyType',{
          params: {
            dbs : this.$store.state.user.dbs_prefix+'medlist',
						medtype : this.medRadio
					}
        }).then( (res) => {
          this.cacheMedData = res.data;
        })
      },
      openAddDialog: function(){
        this.addialog = true;
        this.patientName = '';
        this.patientSex = '';
        this.patientAge = '';
        this.patientPhone = '';
        this.patientSymptom = '';
        this.patient_id = null;
      },

      cancelDialog: function(){
        this.addialog = false
        this.patientName = '';
        this.patientSex = '';
        this.patientAge = '';
        this.patientPhone = '';
        this.patientSymptom = '';
        this.patient_id = null;
      },

      saveDialog: function(){
        if (!this.patientName || this.isSavingIntake) return;
        if (this.patient_id) {
          this.doSaveIntake();
          return;
        }
        this.$http.get('/api/searchPatients', {
          params: {
            dbPrefix: this.$store.state.user.dbs_prefix,
            name: this.patientName,
            page: 1,
            pageSize: 20,
          }
        }).then((res) => {
          const patients = (res.data && res.data.items) || [];
          const sameName = patients.filter((p) => p.name === this.patientName);
          if(sameName.length == 0){
            this.doSaveIntake();
          }else{
            this.patientMatchResults = sameName;
            this.patientMatchDialog = true;
          }
        }).catch(() => {
          this.doSaveIntake();
        });
      },

      chooseMatchedPatient: function(patient) {
        this.patientMatchDialog = false;
        this.patient_id = patient.id;
        this.patientSex = patient.sex;
        this.patientAge = patient.age;
        this.patientPhone = patient.phone;
        this.doSaveIntake();
      },

      createNewMatchedPatient: function() {
        this.patientMatchDialog = false;
        this.doSaveIntake();
      },

      searchPatient: function() {
        const keyword = (this.patientName || this.patientPhone || '').trim();
        if(!keyword){
          alert('请先输入姓名或电话');
          return;
        }
        this.$http.get('/api/searchPatients', {
          params: {
            dbPrefix: this.$store.state.user.dbs_prefix,
            name: keyword,
            page: 1,
            pageSize: 20,
          }
        }).then((res) => {
          this.patientSearchResults = (res.data && res.data.items) || [];
          this.patientSearchDialog = true;
        }).catch(() => {
          alert('查找失败，请重试');
        });
      },

      chooseSearchedPatient: function(patient) {
        this.patientSearchDialog = false;
        this.patientName = patient.name;
        this.patientSex = patient.sex;
        this.patientAge = patient.age;
        this.patientPhone = patient.phone;
        this.patient_id = patient.id;
      },

      doSaveIntake: function(){
        this.isSavingIntake = true;
        const intakeSnapshot = {
          patient: {
            id: this.patient_id || null,
            name: this.patientName,
            namePinyin: '',
            sex: this.patientSex,
            age: !this.patientAge ? 0 : parseFloat(this.patientAge),
            phone: this.patientPhone ? String(this.patientPhone).trim() : null,
          },
          record: {
            symptom: this.patientSymptom,
            comment: this.orderComment,
            date: getNowFormatDate(),
          },
        };
        this.$http.post('/api/saveGaofangIntake', {
          dbPrefix: this.$store.state.user.dbs_prefix,
          patient: intakeSnapshot.patient,
          record: intakeSnapshot.record,
        }).then(() => {
          this.addialog = false;
          this.snackbar = true;
          this.notification = '添加成功';
          this.snackbarColor = 'green';
          this.cancelDialog();
          this.getAll();
        }).catch(err => {
          console.log(err);
          const message = err.response && err.response.data && err.response.data.error;
          alert(message || '保存失败，请重试');
        }).finally(() => {
          this.isSavingIntake = false;
        });
      },
      deleteItem(oneOrder){
        if (!window.confirm('确认删除这条膏方记录吗？')) return;
        this.$http.delete('/api/deleteOrdbyId',{
          params: {
            dbs : this.$store.state.user.dbs_prefix+'gaofang',
            id : oneOrder.id,
          }
        }).then( (res) => {            
          this.snackbar = true;
          this.notification = '删除成功';
          this.snackbarColor = 'green';
          this.getAll();
        }).catch(err => {
          console.log(err);
          alert('删除失败，请重试');
        })

      },
      updateStatus: function(item){
        if(item.status == '已录入'){
          this.gaofangRecordId = item.id;
          this.orderDialog = true;
          if(item.medarray){
            this.$http.get('/api/getAllMedbyType',{
              params: {
                dbs : this.$store.state.user.dbs_prefix+'medlist',
                medtype : this.medRadio
              }
            }).then( (res) => {
              this.cacheMedData = res.data;
              let existInDb;
              for(let item of item.medarray) {
                item = JSON.parse(item);
                if(typeof(item.name1) == 'undefined')
                  break;
                else{
                  existInDb = this.cacheMedData.find(function(p){
                  return p.medname === item.name1;
                  })
                  if(typeof(existInDb) != 'undefined'){
                    this.orderMed1PerObj.push({
                    name: item.name1,
                    count: parseInt(item.count1),
                    spec: existInDb.spec,
                    baseprice: existInDb.baseprice,
                    sellprice: existInDb.sellprice
                    })
                  }
                }
                if(typeof(item.name2) == 'undefined')
                  break;
                else{
                  existInDb = this.cacheMedData.find(function(p){
                  return p.medname === item.name2;
                  })
                  if(typeof(existInDb) != 'undefined'){
                    this.orderMed1PerObj.push({
                    name: item.name2,
                    count: parseInt(item.count2),
                    spec: existInDb.spec,
                    baseprice: existInDb.baseprice,
                    sellprice: existInDb.sellprice
                    })
                  }
                }
                if(typeof(item.name3) == 'undefined')
                  break;
                else{
                  existInDb = this.cacheMedData.find(function(p){
                  return p.medname === item.name3;
                  })
                  if(typeof(existInDb) != 'undefined'){
                    this.orderMed1PerObj.push({
                    name: item.name3,
                    count: parseInt(item.count3),
                    spec: existInDb.spec,
                    baseprice: existInDb.baseprice,
                    sellprice: existInDb.sellprice
                    })
                  }
                }
                if(typeof(item.name4) == 'undefined')
                  break;
                else{
                  existInDb = this.cacheMedData.find(function(p){
                  return p.medname === item.name4;
                  })
                  if(typeof(existInDb) != 'undefined'){
                    this.orderMed1PerObj.push({
                    name: item.name4,
                    count: parseInt(item.count4),
                    spec: existInDb.spec,
                    baseprice: existInDb.baseprice,
                    sellprice: existInDb.sellprice
                    })
                  }
                }
              }
              this.disPlayToTb();
            })
          }else{
            this.getAllMed()
          }
          
          
        }else if(item.status == '已开方'){
          this.$http.post('/api/updateGaofangStatus',{
            dbs : this.$store.state.user.dbs_prefix+'gaofang',
            gaofangRecordId : item.id,
            status : '已取膏',
          }).then( (resord) => {   
            this.getAll()
          })
          .catch( (err) =>{
            console.log(err);
          })
        }
        
      },
      radioChanged: function(){
        this.getAllMed()
        if(this.medRadio == "免煎")
          this.cardColor = 'teal';
        else
          this.cardColor = 'primary';
      },
      getColor (count) {
        if (typeof count === 'string' && count.substr(-1) == "克") return 'primary';
        else return 'teal';
      },
      getStatusColor: function(status){
        if(status == '已录入') return 'deep-purple';
        if(status == '已开方') return 'success';
      },
      searchChanged: function(queryText){
        if(!queryText){
          //alert(queryText);
          //this.components = [{"medname":"empty"}];
          //return;
        }
        else if(queryText.length >= 2){
          if(this.components.length == 0){
            this.components = this.cacheMedData;
          }
        }else{
          this.components = [];
        }
      },
      customFilter (item, queryText, itemText) {
        const hasValue = val => val != null ? val : '';
        const query = hasValue(queryText);

        if(queryText.length < 2) return false;
        const textOne = item.alias.toString().toLowerCase();
        return textOne.indexOf(query.toString().toLowerCase()) > -1;
      },
      moveFocusToDose: function(){
        let searchStr = this.inputMed;
        if(searchStr === ""){
          alert("不能为空");
          return;
        }
        
        //check if already exist in table
        let existInTable = this.orderMed1PerObj.find(function(p){
            return p.name === searchStr;
        });
        if(typeof(existInTable)!="undefined"){
            alert("不能重复添加药品");
            return;
        }
        
				this.$refs.mark2.$el.querySelector('input').focus();
      },
      disPlayToTb: function(){
        //this.orderMed1PerObj = JSON.parse(this.medString);
        this.medItems = [];
        let medStringTmepArray = [];
				var emptyStr = "{";
				var carry = 4;
				for(var i=0; i < this.orderMed1PerObj.length; i++){
					let tempStrName = "name" + (i%carry+1);
					let tempStrNumber = 'count' + (i%carry+1);

					emptyStr = emptyStr + '"' + tempStrName + '":"' + this.orderMed1PerObj[i].name + '","'  + tempStrNumber + '":"' + parseInt(this.orderMed1PerObj[i].count) + this.orderMed1PerObj[i].spec + '",';
          if(i>=0 && (i+1) % carry == 0){
						emptyStr = emptyStr.substr(0,emptyStr.length-1);
            emptyStr = emptyStr + '}';
            let tempObj = JSON.parse(emptyStr);
            medStringTmepArray.push(emptyStr);
						this.medItems.push(tempObj);
						emptyStr = "{";
					}
				}
				if( i%carry != 0){
					emptyStr = emptyStr.substr(0,emptyStr.length-1);
          emptyStr = emptyStr + '}';
          medStringTmepArray.push(emptyStr);
					let tempObj = JSON.parse(emptyStr);
					this.medItems.push(tempObj);
        }
        this.medString = medStringTmepArray.join(";");
      },
      postToTb: function(){
        let searchStr = this.inputMed;
        if(searchStr === ""){
          alert("不能为空");
          this.$refs.mark1.$el.querySelector('input').focus();
          return;
				}
				
				if(this.inputDose === "" || this.inputDose === "0" || Number(this.inputDose) <= 0){
          alert("药品数量不能为空");
          this.$refs.mark2.$el.querySelector('input').focus();
          return;
        }

        let existInDb = this.cacheMedData.find(function(p){
            return p.medname === searchStr;
        });
        if(!existInDb){
          alert("请选择列表中的药品");
          this.$refs.mark1.$el.querySelector('input').focus();
          return;
        }

        //check if already exist in table
        let existInTable = this.orderMed1PerObj.find(function(p){
            return p.name === searchStr;
        });
        if(typeof(existInTable)!="undefined"){
            alert("不能重复添加药品");
            this.$refs.mark1.$el.querySelector('input').focus();
            return;
				}
        this.orderMed1PerObj.push({
						name: this.inputMed,
            count: this.inputDose,
            spec: existInDb.spec,
            baseprice: existInDb.baseprice,
            sellprice: existInDb.sellprice,
          })
        console.log(JSON.stringify(this.orderMed1PerObj))
        this.disPlayToTb();
        this.inputDose = 1;
        this.inputMed = '';
        this.$refs.mark1.$el.querySelector('input').focus();
      },

      postOrdToDb: function(){
        if(this.medItems.length == 0){
          alert('订单为空');
          return;
        }
        this.$http.post('/api/saveGaofangRecord',{
          dbs : this.$store.state.user.dbs_prefix+'gaofang',
          gaofangRecordId : this.gaofangRecordId,
          medarray : this.medString,
          gaofang_total: this.perOrdTotal,
          status : '已开方',
        }).then(() => {
          this.clearInfo()
          this.orderDialog = false
          this.getAll()
        })
      },
      clearInfo: function(){
        this.patientName = '';
        this.patientSex = '';
        this.patientAge = '';
        this.patientPhone = '';
        this.patientSymptom = '';
        this.orderComment = '';
        this.medRadio = '草药';
        this.medItems = [];
        this.total = '';
        this.perOrdTotal = 0;
        this.inputDose = '';
        this.orderMed1PerObj = [];
        this.medString = '';
      },


      deleteMed(deleteMed) {
        let existInTable = this.orderMed1PerObj.find(function(p){
          return p.name === deleteMed;
        });
        var index = this.orderMed1PerObj.indexOf(existInTable);
        this.orderMed1PerObj.splice(index, 1);
        this.disPlayToTb();
      },
      startPrint: function(){
				this.$print(this.$refs.print);
			},
      reuse: function(item){
        this.$http.post('/api/reuseGaofangRecord',{
          dbs : this.$store.state.user.dbs_prefix+'gaofang',
          patient_id : item.patient_id,
          medarray: item.medarray.join(";"),
          gaofang_total: item.gaofang_total,
          symptom : item.symptom,
          order_comment : item.order_comment,
          date : getNowFormatDate(),
        }).then( (resord) => {   
          this.snackbar = true;
          this.notification = '添加成功';
          this.snackbarColor = 'green';
          this.getAll()
        })
      },
      loadMore: function(){
        const offset = this.offset;
        let idStartFrom = offset;
        this.$http.get('/api/getGaofangRecord',{
          params: {
            dbs : this.$store.state.user.dbs_prefix+'gaofang',
            offset : offset,
					}
        }).then( (res) => {
          const records = Array.isArray(res.data) ? res.data : [];
          this.$store.commit('page/NEXT_PAGE', records.length);
          for(let element of records) {
            if(element.medarray)
              element.medarray = element.medarray.split(";");      
            idStartFrom = idStartFrom + 1;
            element.pid = idStartFrom;
            this.$http.get('/api/getPatientInfo',{
              params: {
                dbs : this.$store.state.user.dbs_prefix+'patient',
                patient_id: element.patient_id,
              }
            }).then( (res) => {
              const patient = res.data && res.data[0];
              if (!patient) return;
              this.$set(element,'name',patient.name);
              this.$set(element,'sex',patient.sex);
              this.$set(element,'age',patient.age);
              this.$set(element,'phone',patient.phone);
            }).catch(err => {
              console.log(err);
            })
          }
          this.items = this.items.concat(records)
        })
      },
      getAll: function() {
        let idStartFrom = 0;
        this.$http.get('/api/getGaofangRecord',{
          params: {
            dbs : this.$store.state.user.dbs_prefix+'gaofang',
            offset : 0,
					}
        }).then( (res) => {
          const records = Array.isArray(res.data) ? res.data : [];
          this.$store.commit('page/GO_PAGE', records.length);
          for(let element of records) {
            if(element.medarray)
              element.medarray = element.medarray.split(";");      
            idStartFrom = idStartFrom + 1;
            element.pid = idStartFrom;
            this.$http.get('/api/getPatientInfo',{
              params: {
                dbs : this.$store.state.user.dbs_prefix+'patient',
                patient_id: element.patient_id,
              }
            }).then( (res) => {
              const patient = res.data && res.data[0];
              if (!patient) return;
              this.$set(element,'name',patient.name);
              this.$set(element,'sex',patient.sex);
              this.$set(element,'age',patient.age);
              this.$set(element,'phone',patient.phone);
            }).catch(err => {
              console.log(err);
            })
          }
          this.items = records;
        })
      },
    },
    watch: {
      orderMed1PerObj: function(){
        this.perOrdTotal = 0;
        for(let item of this.orderMed1PerObj) {
          let sellPriceOfMed = item.sellprice;
          let medDose = parseInt(item.count);
          this.perOrdTotal = parseFloat((this.perOrdTotal + parseFloat((sellPriceOfMed*medDose).toFixed(2))).toFixed(2));
        }
      },
    },
    mounted: function() {
      const patientItem = this.$route.params && this.$route.params.gaofang_item;
      if (patientItem && patientItem.name) {
        this.openAddDialog();
        this.patientName = patientItem.name;
        this.patientSex = patientItem.sex;
        this.patientAge = patientItem.age;
        this.patientPhone = patientItem.phone;
        this.patient_id = patientItem.patient_id || null;
      }
      this.getAll();
    }



  }
</script>
<style scoped>
  .smallHeight .v-data-table td{
    height: 20px;
    font-size: 14px;
  }

  .patient-match-table tbody tr {
    cursor: pointer;
  }
</style>
