<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row align="center">
      <v-col cols="12" >
        <material-card flat full-width :color=cardColor>
          <template v-slot:header>
            <v-row align="center">
              <v-col sm="4" md="4">
                <div class="px-3">
                  <div class="title font-weight-light mb-2">
                    <v-radio-group v-model="medRadio" :mandatory="false" row @change="radioChanged">
                      <v-radio label="草药" value="草药" color="grey darken-1"></v-radio>
                      <v-radio label="免煎" value="免煎" color="grey darken-1"></v-radio>
                      <v-radio label="西药" value="西药" color="grey darken-1"></v-radio>
                      <v-radio v-if="enableYaowan" label="药丸" value="药丸" color="grey darken-1"></v-radio>
                    </v-radio-group>
                  </div>
                </div>
              </v-col>
              <v-divider
                class="mx-2"
                vertical
              ></v-divider>
              <v-col>
                <v-container>
                  <v-row dense>
                    <v-col sm="4" md="4">
                      <v-text-field v-model="patientName" @blur="nameLostFoucs"
                        label="姓名"
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
                    <v-col sm="1.5" md="1.5"
                    align="right">
                      <v-btn
                        absolute
                        dark
                        fab
                        top
                        right
                        color="amber"
                        @click="postOrdToDbSure"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row 
                  dense
                  >
                    <v-col sm="5" md="5">
                      <v-text-field v-model="patientPhone"
                        label="电话"
                      ></v-text-field>
                    </v-col>
                    <v-col sm="5" md="5">
                      <v-text-field v-model="patientSymptom"
                        label="症状"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>           
          </template>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="name"
            :search="searchStr"
            :custom-filter="filterText"
            hide-default-footer
            v-if="!isYaowan"
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
              <v-col v-if="!howToUseOn" sm="6" md="6">
                <v-text-field
                  v-model="inputDose"
                  label="剂量"
                  dense
                  ref="mark2"
                  @keyup.enter.native="postToTb"
                  @focus="focus($event)"
                ></v-text-field>
              </v-col>
              <v-col v-if="howToUseOn" sm="3" md="3">
                <v-text-field
                  v-model="inputDose"
                  label="剂量"
                  dense
                  ref="mark2"
                  @focus="focus($event)"
                ></v-text-field>
              </v-col>
              <v-col v-if="howToUseOn" sm="3" md="3">
                <v-select
                  v-if="howToUseOn"
                  :items="hotToUse"
                  dense
                  clearable
                  ref="mark3"
                  label="用法用量"
                ></v-select>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.count1="props">
            <v-edit-dialog
              :return-value.sync="props.item.count1"
              large
              persistent
              @save="save(props.item.count1, props.item.name1)"
              @cancel="cancel"
            >
              <div>{{ props.item.count1 }}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.count1"
                  :rules="[notzero]"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
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
          <div class="text-center pt-2">
            <v-row>
              <v-col sm="5" md="6"></v-col>
              <v-col sm="5" md="4">
                <v-text-field dense v-model="orderComment"
                  label="处方备注" placeholder="备注"
                ></v-text-field>
              </v-col>
              <v-col sm="1" md="1">
                <v-text-field dense v-if="!isYaowan" v-model="orderCount"
                  label="几付" suffix="付" placeholder=" "
                ></v-text-field>
              </v-col>
              <v-col sm="1" md="1">
                <v-text-field dense suffix="元" v-model="total"
                label="总价" placeholder=" "
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
          <v-dialog v-model="selectPatientDialog" scrollable max-width="800px">
            <v-card>
              <v-card-title>
                <span class="headline"></span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-data-table
                    :headers="findPatientHeader"
                    :items="cacheFindedPatient"
                    hide-default-footer
                  >
                    <template v-slot:item.action="{ item }">
                      <v-btn color="blue darken-1" text @click="choosePatient(item)">选择</v-btn>
                      <v-btn color="blue darken-1" text @click="jumpToPDetail(item.id)">详情</v-btn>
                    </template>
                  </v-data-table>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>          
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  var pinyin = require("pinyin");
  var staticHeader=[{sortable: false, text: '名称', value: 'name1', width: '15%'}, {sortable: false,text: '数量', value: 'count1', width: '10%'}, {sortable: false,text: '名称', value: 'name2', width: '15%'}, {sortable: false,text: '数量', value: 'count2', width: '10%'}, 
                 {sortable: false,text: '名称', value: 'name3', width: '15%'}, {sortable: false,text: '数量', value: 'count3', width: '10%'}, {sortable: false,text: '名称', value: 'name4', width: '15%'}, {sortable: false,text: '数量', value: 'count4', width: '10%'}];

  var xiyaoHeader=[{sortable: false,text: '名称', value: 'name1'}, {sortable: false,text: '数量', value: 'count1'}, {sortable: false,text: '用法', value: 'usage1'}];
  var yaowanHeader=[];
  import { dateToString, stringToDate, getNowFormatDate} from '../utils/handleDate';
  import { saveToLocal, loadFromLocal} from '../utils/handleLocalStorage';

  export default {
    data: () => ({
      fab: false,
      searchStr: '',
      sexItems: ['男', '女'],
      patientName: '',
      patient_id: '',
			patientAge: '',
      patientSex: '',
      patientPhone: '',
      patientSymptom: '',
      perOrdTotal: 0,
      perOrdBase: 0,
      orderComment: '',
      orderCount: '',
      total: '',
      howToUseOn: false,
      isYaowan: false,
      enableYaowan: false,
      hotToUse: ['一天一次', '一天三次'],
      medRadio: '草药',
      cardColor: 'green',
      components: [],
      headers: staticHeader,
      items: [],
      cacheMedData: [],
      orderMed1PerObj: [],
      inputMed: '',
      inputDose: '',
      medString: '',
      selectPatientDialog: false,
      cacheFindedPatient: [],
      notzero: v=> v > 0 || '不能是0',
      reuseOrd: [],
      findPatientHeader: [
        {
          text: '姓名',
          align: 'left',
          sortable: false,
          value: 'name',
        },
        { text: '性别', value: 'sex' },
        { text: '年龄', value: 'age' },
        { text: '电话', value: 'phone' },
        { text: '最近一次', value: 'lastVisit' },
        { text: '操作', value: 'action' },
      ]
    }),

    methods: {
      //搜索
      filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().indexOf(search) !== -1
      },

      //得到焦点的时候高亮文字
      focus(event) {
        event.currentTarget.select();
			},

      // 根据类型获取药品数据
      getAll: function() {
        this.loading = true;
        this.$http.get('/api/getAllMedbyType',{
          params: {
            dbs : this.$store.state.user.dbs_prefix+'medlist',
						medtype : this.medRadio
					}
        }).then( (res) => {
          this.cacheMedData = res.data;
          this.loading = false;
        })
      },

      radioChanged: function(){
        this.getAll();
        if(this.medRadio == "西药"){
          this.howToUseOn = true;
          this.isYaowan = false;
          this.cardColor = 'blue lighten-2';
          this.headers = xiyaoHeader;
        }else if(this.medRadio == "药丸"){
          this.isYaowan = true;
          this.headers = yaowanHeader;
          this.cardColor = 'deep-purple lighten-2';
        }else{
          this.howToUseOn = false;
           this.isYaowan = false;
          this.headers = staticHeader;
          if(this.medRadio == "免煎")
            this.cardColor = 'lime darken-2';
          else
            this.cardColor = 'green';
				}
      },

      getColor (count) {
        if (parseInt(count) === 1 && this.medRadio == "草药") return 'orange';
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

      //medString = [{"name":"xx","count":"xx"},{"name":"xx","count":"xx"}....]
      disPlayToTb: function(){
        //this.orderMed1PerObj = JSON.parse(this.medString);
        this.items = [];
        let medStringTmepArray = [];
				var emptyStr = "{";
				var carry = 4;
				if(this.medRadio == "西药")
					carry = 2;
				for(var i=0; i < this.orderMed1PerObj.length; i++){
					let tempStrName = "name" + (i%carry+1);
					let tempStrNumber = 'count' + (i%carry+1);
					let tempStrMedComment = 'medComment' + (i%carry+1);
					if(this.medRadio == "草药")
						emptyStr = emptyStr + '"' + tempStrName + '":"' + this.orderMed1PerObj[i].name + '","'  + tempStrNumber + '":"' + parseInt(this.orderMed1PerObj[i].count) + this.orderMed1PerObj[i].spec + '",';
					else if(this.medRadio == "免煎")
						emptyStr = emptyStr + '"' + tempStrName + '":"' + this.orderMed1PerObj[i].name + '","'  + tempStrNumber + '":"' + this.orderMed1PerObj[i].count + this.orderMed1PerObj[i].spec + '",';
					else if(this.medRadio == "西药")
						emptyStr = emptyStr + '"' + tempStrName + '":"' + this.orderMed1PerObj[i].name + '","'  + tempStrNumber + '":"' + parseInt(this.orderMed1PerObj[i].count) + '盒","' + tempStrMedComment + '":"' + this.orderMed1PerObj[i].medComment + '",';
					if(i>0 && (i+1) % carry == 0){
						emptyStr = emptyStr.substr(0,emptyStr.length-1);
						emptyStr = emptyStr + '}';
            let tempObj = JSON.parse(emptyStr);
            medStringTmepArray.push(emptyStr);
						this.items.push(tempObj);
						emptyStr = "{";
					}
				}
				if( i%carry != 0){
					emptyStr = emptyStr.substr(0,emptyStr.length-1);
          emptyStr = emptyStr + '}';
          medStringTmepArray.push(emptyStr);
					let tempObj = JSON.parse(emptyStr);
					this.items.push(tempObj);
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
				
				if(this.inputDose === "" || this.inputDose === "0"){
          alert("药品数量不能为空");
          this.$refs.mark.$el.querySelector('input').focus();
          return;
        }

        let existInDb = this.cacheMedData.find(function(p){
            return p.medname === searchStr;
        });
        
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
						sellprice: existInDb.sellprice
          })
        this.disPlayToTb();
        if(this.orderCount === '')
          this.orderCount = 1;
        this.inputDose = 1;
        this.inputMed = '';
        this.$refs.mark1.$el.querySelector('input').focus();
      },

      postOrdToDbSure:function() {
        if(this.items.length == 0 && this.medRadio!='药丸'){
          alert('订单为空');
          return;
        }
        if(this.medRadio == '药丸' && this.total == 0){
          alert('订单为空');
          return;
        }
        if(this.patientName == ''){
          alert('姓名不能为空');
          return;
        }
        if(this.medRadio == '药丸' && this.total != 0){
          this.orderCount = 1;
        }
        if(!this.patient_id){
          this.$http.post('/api/insertPatientOrderPage',{
                //搜索全拼相同，在得到的结果中找至少有一个字相同的名字,找到了就列出来，没找到就创建一个新的病人
                dbs : this.$store.state.user.dbs_prefix+'patient',
                name : this.patientName,
                name_pinyin : pinyin(this.patientName,{style: pinyin.STYLE_NORMAL}).join(""),
                sex : this.patientSex,
                age : !this.patientAge? 0 : parseFloat(this.patientAge),
                phone : !this.patientPhone? 0 : parseInt(this.patientPhone),
                lastVisit : getNowFormatDate(),
            }).then( (res) => {
              this.$http.post('/api/insertOrd',{
                    dbs : this.$store.state.user.dbs_prefix+'ordlist',
                    patient : this.patientName,
                    patient_id : res.data.insertId,
                    symptom : this.patientSymptom,
                    order_comment : this.orderComment,
                    medtype : this.medRadio,
                    dose : this.orderCount,
                    medarray : this.medString,
                    total : parseFloat(this.total),
                    totalprofit : (parseFloat(this.total) - parseFloat((this.perOrdBase * this.orderCount).toFixed(2))).toFixed(2),
                    date : getNowFormatDate(),
              }).then( (resord) => {   
                //{"id":1,"patient":"我的天测试","medtype":"免煎","symptom":"啦啊","order_comment":"是非法","dose":1,"medarray":"{\"name1\":\"白术\",\"count1\":\"7袋\"}","total":266,"totalprofit":0,"date":"2020-02-13","sex":"女","age":13,"phone":"12525"}           
                this.clearInfo();
              })
              .catch( (err) =>{
                console.log(err);
              })
            })
            .catch( (err) =>{
              console.log(err);
            })
        }else{
          this.$http.post('/api/insertOrd',{
                dbs : this.$store.state.user.dbs_prefix+'ordlist',
                patient : this.patientName,
                patient_id : this.patient_id,
                symptom : this.patientSymptom,
                order_comment : this.orderComment,
                medtype : this.medRadio,
                dose : this.orderCount,
                medarray : this.medString,
                total : parseFloat(this.total),
                totalprofit : (parseFloat(this.total) - parseFloat((this.perOrdBase * this.orderCount).toFixed(2))).toFixed(2),
                date : getNowFormatDate(),
          }).then( (resord) => {
            this.clearInfo();
          })
          .catch( (err) =>{
            console.log(err);
          })
        }
      },

      clearInfo: function(){
        this.patientName = '';
        this.patientSex = '';
        this.patientAge = '';
        this.patientPhone = '';
        this.patientSymptom = '';
        this.orderComment = '';
        this.medRadio = '草药';
        this.orderCount = '';
        this.items = [];
        this.total = '';
        this.perOrdTotal = 0;
        this.perOrdBase = 0;
        this.inputDose = '';
      },

      save: function(count, name){
        let existInTable = this.orderMed1PerObj.find(function(p){
            return p.name === name;
        });
        var index = this.orderMed1PerObj.indexOf(existInTable);
        if(!count || !parseInt(count) || parseInt(count) == 0){
          this.orderMed1PerObj.splice(index, 1);
          this.disPlayToTb();
        }else{
          //splice can activate watch
          this.orderMed1PerObj.splice(index,1,{
            name: name,
            count: parseInt(count),
            spec: existInTable.spec,
            baseprice: existInTable.baseprice,
						sellprice: existInTable.sellprice
          })
          this.disPlayToTb();
        }
      },

      cancel: function(){

      },

      deleteMed(deleteMed) {
        let existInTable = this.orderMed1PerObj.find(function(p){
          return p.name === deleteMed;
        });
        var index = this.orderMed1PerObj.indexOf(existInTable);
        this.orderMed1PerObj.splice(index, 1);
        this.disPlayToTb();
      },

      nameLostFoucs: function(){
        if(this.patientName == '' || this.patientName.length < 2)
          return;
        let p_name_pinyin = pinyin(this.patientName,{style: pinyin.STYLE_NORMAL}).join("");
        this.$http.get('/api/findPatientByPinyin',{
          params: {
            dbs : this.$store.state.user.dbs_prefix+'patient',
            name_pinyin : '%' + p_name_pinyin + '%',
					}
        }).then( (res) => {
          this.cacheFindedPatient = [];
          let serverFindP = res.data;
          for(let item of serverFindP){
            for(var i=0; i<this.patientName.length; i++){
              let index = item.name.indexOf(this.patientName[i]);
              if(index == i){
                this.cacheFindedPatient.push(item);
                break;
              }
            }
          }
          if(this.cacheFindedPatient.length != 0 && !this.patient_id){
            this.selectPatientDialog = true;
          }
        })
      },

      choosePatient: function(item){
        this.patient_id = item.id;
        this.patientName = item.name;
        this.patientSex = item.sex;
        this.patientAge = item.age;
        this.patientPhone = item.phone;
        this.selectPatientDialog = false;   
      },

      jumpToPDetail: function(id){
        this.$router.push({name: 'User Profile', params: {pt_id: id}});
      },

      unpackOrdFromOutside: function(ordItem){
        this.medRadio = ordItem.medtype;
        this.patientName = ordItem.patient;
				this.patientAge = ordItem.age;
        this.patientSex = ordItem.sex;
        this.patientSymptom = ordItem.symptom;
        this.orderComment = ordItem.order_Comment;
        this.patient_id = ordItem.id;
        this.orderCount = ordItem.dose;
        this.radioChanged();
        this.$http.get('/api/getAllMedbyType',{
          params: {
            dbs : this.$store.state.user.dbs_prefix+'medlist',
						medtype : this.medRadio
					}
        }).then( (res) => {
          this.cacheMedData = res.data;
          for(let item of ordItem.medarray) {
            item = JSON.parse(item);
            if(typeof(item.name1) == 'undefined')
              break;
            else{
              var existInDb = this.cacheMedData.find(function(p){
              return p.medname === item.name1;
              })
              if(typeof(existInDb) != 'undefined'){
                this.orderMed1PerObj.push({
                name: item.name1,
                count: item.count1,
                spec: existInDb.spec,
                baseprice: existInDb.baseprice,
                sellprice: existInDb.sellprice
                })
              }
            }
            if(typeof(item.name2) == 'undefined')
              break;
            else{
              var existInDb = this.cacheMedData.find(function(p){
              return p.medname === item.name2;
              })
              if(typeof(existInDb) != 'undefined'){
                this.orderMed1PerObj.push({
                name: item.name2,
                count: item.count2,
                spec: existInDb.spec,
                baseprice: existInDb.baseprice,
                sellprice: existInDb.sellprice
                })
              }
            }
            if(typeof(item.name3) == 'undefined')
              break;
            else{
              var existInDb = this.cacheMedData.find(function(p){
              return p.medname === item.name3;
              })
              if(typeof(existInDb) != 'undefined'){
                this.orderMed1PerObj.push({
                name: item.name3,
                count: item.count3,
                spec: existInDb.spec,
                baseprice: existInDb.baseprice,
                sellprice: existInDb.sellprice
                })
              }
            }
            if(typeof(item.name4) == 'undefined')
              break;
            else{
              var existInDb = this.cacheMedData.find(function(p){
              return p.medname === item.name4;
              })
              if(typeof(existInDb) != 'undefined'){
                this.orderMed1PerObj.push({
                name: item.name4,
                count: item.count4,
                spec: existInDb.spec,
                baseprice: existInDb.baseprice,
                sellprice: existInDb.sellprice
                })
              }
            }
          }
          this.disPlayToTb();
        })
        

      }
    },

    watch: {
      orderMed1PerObj: function(){
        this.perOrdBase = 0;
        this.perOrdTotal = 0;
        if(this.orderMed1PerObj.length === 0)
          this.orderCount = '';
        for(let item of this.orderMed1PerObj) {
          let basePriceOfMed = item.baseprice;
          let sellPriceOfMed = item.sellprice;
          let medDose = parseInt(item.count);
          this.perOrdBase = parseFloat((this.perOrdBase + parseFloat((basePriceOfMed*medDose).toFixed(2))).toFixed(2));
          this.perOrdTotal = parseFloat((this.perOrdTotal + parseFloat((sellPriceOfMed*medDose).toFixed(2))).toFixed(2));
          let temp = (this.perOrdTotal * this.orderCount).toFixed(2);
          this.total = temp;
        }
      },

      orderCount: function(val) {
        if(val != ''){
          this.orderCount = val;
        }
        let temp = (this.perOrdTotal * this.orderCount).toFixed(2);
        this.total = temp;
      },
    },

    mounted: function() {
      if(this.reuseOrd.length != 0){
        this.unpackOrdFromOutside(this.reuseOrd);
      }else{
        this.getAll();
      }
      let userSetting = loadFromLocal(1,'userSetting', []);
      this.enableYaowan = userSetting[0]['notDisplayYaowan'];
    },

    created() {
      this.reuseOrd = this.$route.params.ord_item;
    }

    
  }
</script>
