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
                      <v-text-field v-model="patientName" @blur="nameLostFoucs()"
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
                        <v-icon>fa-plus</v-icon>
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
                  v-model="useage"
                  label="用法用量"
                  dense
                  ref="mark2"
                  @keyup.enter.native="afterUseage"
                  @focus="focus($event)"
                  @blur="useageLostFoucs"
                ></v-text-field>
              </v-col>
              <v-col v-if="howToUseOn" sm="3" md="3">
                <v-text-field
                  v-model="inputDose"
                  label="剂量"
                  dense
                  ref="mark3"
                  @keyup.enter.native="postToTb"
                  @focus="focus($event)"
                ></v-text-field>
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
          <template v-slot:item.count2="props">
            <v-edit-dialog
              :return-value.sync="props.item.count2"
              large
              persistent
              @save="save(props.item.count2, props.item.name2)"
              @cancel="cancel"
            >
              <div>{{ props.item.count2 }}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.count2"
                  :rules="[notzero]"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.count3="props">
            <v-edit-dialog
              :return-value.sync="props.item.count3"
              large
              persistent
              @save="save(props.item.count3, props.item.name3)"
              @cancel="cancel"
            >
              <div>{{ props.item.count3 }}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.count3"
                  :rules="[notzero]"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.count4="props">
            <v-edit-dialog
              :return-value.sync="props.item.count4"
              large
              persistent
              @save="save(props.item.count4, props.item.name4)"
              @cancel="cancel"
            >
              <div>{{ props.item.count4 }}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.count4"
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
              <v-col sm="3" md="4"></v-col>
              <v-col sm="2" md="2">
                <v-select
                  dense
                  v-model="doctor"
                  :items="doctorList"
                ></v-select>
              </v-col>
              <v-col sm="4" md="3">
                <v-text-field dense v-model="orderComment"
                  label="处方备注" placeholder="备注"
                ></v-text-field>
              </v-col>
              <v-col sm="1" md="1">
                <v-text-field dense v-if="!isYaowan" v-model="orderCount"
                  label="几付" suffix="付" placeholder=" " @focus="focus($event)"
                ></v-text-field>
              </v-col>
              <v-col sm="2" md="2">
                <v-text-field @focus="focus($event)" dense suffix="元" v-model="total"
                label="总价" placeholder=" " append-icon="fa-check" @click:append="addMoney"
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
          <v-dialog v-model="selectUseageDialog" scrollable max-width="300px">
            <v-card>
              <v-card-title>
                <span class="headline"></span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-data-table
                    :headers="useageHeader"
                    :items="useageList"
                    hide-default-footer
                  >
                    <template v-slot:item.action="{ item }">
                      <v-btn color="blue darken-1" text @click="chooseUseage(item)">选择</v-btn>
                    </template>
                  </v-data-table>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-model="printOrderDialog" max-width="1000">
            <v-card>
              <div ref="print" class="smallHeight">
                <h4 style="text-align:center;">宛城云杰诊所</h4>
                <h4 style="text-align:center;">处&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方</h4>
                <hr style="margin-top:5px;height:1px;border:none;border-top:1px solid #555555;" />
                  <v-simple-table v-if="medString != ''">
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <td :colspan="2"><p>姓名:{{patientName}} </p></td>
                        <td :colspan="1"><p>性别:{{patientSex}}</p></td>
                        <td :colspan="1"><p>年龄:{{patientAge}}</p></td>
                      </tr>
                      <tr>
                        <td :colspan="4" ><p>症状:{{patientSymptom}}</p></td>
                      </tr>
                      <tr>
                        <td :colspan="2" style="border-bottom:1px solid"><p>电话:{{patientPhone}}</p></td>
                        <td :colspan="2" style="border-bottom:1px solid"><p>备注:{{orderComment}}</p></td>
                      </tr>
                      <tr v-for="element in medString.split(';')" :key="element.name">
                        <td style="width:23%" v-if="!JSON.parse(element).medComment1">{{ JSON.parse(element).name1 }} {{ JSON.parse(element).count1 }}</td>
                        <td style="width:50%" v-if="JSON.parse(element).medComment1">{{ JSON.parse(element).name1 }} {{ JSON.parse(element).count1 }}</td>
                        <td style="width:30%" v-if="JSON.parse(element).medComment1">{{ JSON.parse(element).medComment1 }}</td>
                        <td style="width:10%" v-if="JSON.parse(element).medComment1"></td> 
                        <td style="width:10%" v-if="JSON.parse(element).medComment1"></td> 
                        <td style="width:23%">{{ JSON.parse(element).name2 }} {{ JSON.parse(element).count2 }}</td>
                        <td style="width:23%">{{ JSON.parse(element).name3 }} {{ JSON.parse(element).count3 }}</td>
                        <td style="width:31%">{{ JSON.parse(element).name4 }} {{ JSON.parse(element).count4 }}</td>
                      </tr>
                      <tr><td></td></tr>
                      <tr v-if="!isYaowan">
                        <td :colspan="3"></td>
                        <td :colspan="1"><p>{{orderCount}}付</p></td>
                      </tr>
                      <tr>
                        <td :colspan="3" style="border-bottom:1px solid"></td>
                        <td :colspan="1" style="border-bottom:1px solid"><p>价钱： {{total}}元</p></td>
                      </tr>
                      <tr>
                        <td :colspan="2"><p>处方医师：  {{doctor}}</p></td>
                        <td :colspan="2"><p>日期： {{todayDate}}</p></td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="printIt">打印</v-btn>
              </v-card-actions>
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

  var xiyaoHeader=[{sortable: false,text: '名称', value: 'name1'}, {sortable: false,text: '数量', value: 'count1'}, {sortable: false,text: '用法', value: 'medComment1'}];
    var useages = [{use: '5ml tid.po'}, {use: '半片 tid.po'}, {use: '一片 tid.po'}, {use: '2片 tid.po'}, {use: '3片 tid.po'},
                  {use: '半片 bid.po'}, {use: '一片 bid.po'}, {use: '2片 bid.po'}, {use: '3片 bid.po'}];
  var yaowanHeader=[{sortable: false,text: '名称', value: 'name1',width: '50%'}, {sortable: false,text: '数量', value: 'count1',width: '50%'}];
  var reuseOrd=[];
  import { dateToString, stringToDate, getNowFormatDate} from '../utils/handleDate';
  import { saveToLocal, loadFromLocal} from '../utils/handleLocalStorage';

  export default {
    inject: ['reload'],
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
      useage: '',
      todayDate: getNowFormatDate(),
      isYaowan: false,
      enableYaowan: false,
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
      doctor: '',
      doctorList: ['崔云杰','谢双阳','王同迅'],
      selectPatientDialog: false,
      selectUseageDialog: false,
      printOrderDialog: false,
      cacheFindedPatient: [],
      notzero: v=> v > 0 || '不能是0',
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
      ],
      useageHeader: [{ text: '用法', value: 'use' },{ text: '操作', value: 'action' }],
      useageList: useages,
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
        this.$http.get('/api/getAllMedbyType',{
          params: {
            dbs : this.$store.state.user.dbs_prefix+'medlist',
						medtype : this.medRadio
					}
        }).then( (res) => {
          this.cacheMedData = res.data;
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
        if (parseInt(count) === 1 && this.medRadio == "草药") return 'red';
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

      afterUseage: function(){
        this.$refs.mark3.$el.querySelector('input').focus();
      },

      useageLostFoucs: function(){
        this.selectUseageDialog = true;
        this.useageList = useages.filter((e) => {
          return e.use.indexOf(this.useage) !== -1;
        });
      },

      chooseUseage: function(item){
        this.useage = item.use;
        this.useageList = useages;
        this.selectUseageDialog = false;
        this.$refs.mark3.$el.querySelector('input').focus();
      },

      //medString = [{"name":"xx","count":"xx"},{"name":"xx","count":"xx"}....]
      disPlayToTb: function(){
        //this.orderMed1PerObj = JSON.parse(this.medString);
        this.items = [];
        let medStringTmepArray = [];
				var emptyStr = "{";
				var carry = 4;
				if(this.medRadio == "西药")
					carry = 1;
				for(var i=0; i < this.orderMed1PerObj.length; i++){
					let tempStrName = "name" + (i%carry+1);
					let tempStrNumber = 'count' + (i%carry+1);
					let tempStrMedComment = 'medComment' + (i%carry+1);
					if(this.medRadio == "草药")
						emptyStr = emptyStr + '"' + tempStrName + '":"' + this.orderMed1PerObj[i].name + '","'  + tempStrNumber + '":"' + parseInt(this.orderMed1PerObj[i].count) + this.orderMed1PerObj[i].spec + '",';
					else if(this.medRadio == "免煎")
						emptyStr = emptyStr + '"' + tempStrName + '":"' + this.orderMed1PerObj[i].name + '","'  + tempStrNumber + '":"' + this.orderMed1PerObj[i].count + '",';
					else if(this.medRadio == "西药")
						emptyStr = emptyStr + '"' + tempStrName + '":"' + this.orderMed1PerObj[i].name + '","'  + tempStrNumber + '":"' + parseInt(this.orderMed1PerObj[i].count) + this.orderMed1PerObj[i].spec + '","' + tempStrMedComment + '":"' + this.orderMed1PerObj[i].medComment + '",';
					else if(this.medRadio == "药丸")
						emptyStr = emptyStr + '"' + tempStrName + '":"' + this.orderMed1PerObj[i].name + '","'  + tempStrNumber + '":"' + parseInt(this.orderMed1PerObj[i].count) + this.orderMed1PerObj[i].spec + '",';
          if(i>=0 && (i+1) % carry == 0){
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
            sellprice: existInDb.sellprice,
            medComment: this.useage,
          })
        this.disPlayToTb();
        if(this.orderCount === '')
          this.orderCount = 1;
        this.inputDose = 1;
        this.inputMed = '';
        this.useage = '';
        this.$refs.mark1.$el.querySelector('input').focus();
      },

      postOrdToDbSure:function() {
        if(this.items.length == 0){
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
        this.printOrderDialog = true;
      },

      addMoney: function(){
        this.total = (parseFloat(this.total) + 5).toFixed(2);
      },

      printIt: function(){
        this.printOrderDialog = false;
        this.$print(this.$refs.print);
        let ordProfit = '';
        if(this.medRadio == '药丸' && this.total != 0){
          this.orderCount = 1;
        }
        ordProfit = (parseFloat(this.total) - parseFloat((this.perOrdBase * this.orderCount).toFixed(2))).toFixed(2);
        if(this.medRadio == '药丸'){
          if(this.perOrdBase == 0)
            ordProfit = this.total * 0.75;
          var yaowanTotal = this.total;
        }

        //decide if save the order to fake database
        let saveToTest = false
        let toTestTotal = 0
        if(this.medRadio == '西药'){
          saveToTest = true
          toTestTotal = parseFloat(this.total)
        }else if(this.medRadio == '免煎'){
          if(Math.random() > 0.65){
            saveToTest = true
            toTestTotal = parseFloat(this.total)
          }
        }else if(this.medRadio == '草药'){
          if(Math.random() > 0.75){
            console.log(Math.random())
            saveToTest = true
            let fakePriceDict = {
              '艾叶':0.03,
              '巴戟':0.166,
              '白豆蔻':0.28,
              '白矾':0.02,
              '白果':0.04,
              '白花蛇舌草':0.07,
              '白芨':0.5,
              '白芥子':0.055,
              '白莲子':0.12,
              '白茅根':0.032,
              '白芍':0.045,
              '白术':0.051,
              '白头翁':0.25,
              '白薇':0.12,
              '白英':0.05,
              '白芷':0.048,
              '百合':0.051,
              '柏子仁':0.255,
              '板蓝根':0.06,
              '薄荷':0.027,
              '北柴胡':0.195,
              '北沙参':0.12,
              '萆薢':0.06,
              '萹蓄':0.03,
              '槟榔':0.1,
              '补骨脂':0.047,
              '蚕沙':0.03,
              '草豆蔻':0.09,
              '草果':0.21,
              '侧柏叶':0.015,
              '蝉蜕':0.93,
              '炒白扁豆':0.027,
              '炒白术':0.15,
              '炒苍耳子':0.025,
              '川楝子':0.02,
              '炒刺猬皮':0.8,
              '炒冬瓜子':0.043,
              '炒谷芽':0.04,
              '炒山药':0.048,
              '炒鸡内金':0.043,
              '炒苦杏仁':0.07,
              '炒萊服子':0.052,
              '炒牵牛子':0.078,
              '六神曲':0.052,
              '炒酸枣仁':0.8,
              '炒栀子':0.032,
              '枳壳':0.082,
              '炒枳实':0.15,
              '车前子':0.23,
              '沉香粉':0.8,
              '赤芍':0.15,
              '赤小豆':0.05,
              '茺蔚子':0.08,
              '川贝母':8.42,
              '川木通':0.024,
              '川牛膝':0.069,
              '穿山甲':9.4,
              '磁石':0.01,
              '刺五加':0.06,
              '醋北柴胡':0.26,
              '香附':0.031,
              '醋延胡索':0.16,
              '大腹皮':0.015,
              '大黄':0.055,
              '大蓟':0.03,
              '丹参':0.052,
              '胆南星':0.1,
              '淡豆豉':0.03,
              '当归':0.106,
              '党参':0.128,
              '地肤子':0.039,
              '地骨皮':0.18,
              '地龙':0.7,
              '地榆':0.033,
              '独活':0.06,
              '法半夏':0.17,
              '番泻叶':0.04,
              '防风':0.86,
              '蜂房':0.95,
              '佛手':0.12,
              '茯苓':0.069,
              '浮小麦':0.02,
              '覆盆子':0.39,
              '甘草':0.04,
              '甘松':0.18,
              '干姜':0.042,
              '藁本':0.25,
              '葛根':0.06,
              '功劳叶':0.08,
              '钩藤':0.16,
              '枸杞子':0.09,
              '骨碎补':0.12,
              '瓜蒌皮':0.06,
              '瓜蒌子':0.07,
              '藿香':0.05,
              '鬼箭羽':0.32,
              '桂枝':0.025,
              '海浮石':0.03,
              '海金沙':0.66,
              '海螵蛸':0.15,
              '海桐皮':0.03,
              '海藻':0.05,
              '旱莲草':0.06,
              '合欢花':0.1,
              '合欢皮':0.04,
              '牵牛子':0.03,
              '附片':0.13,
              '红参片':1.2,
              '红花':0.54,
              '红景天':0.13,
              '大血藤':0.03,
              '胡黄连':0.6,
              '葫芦巴':0.05,
              '虎杖':0.028,
              '琥珀':0.34,
              '花椒':0.3,
              '滑石粉':0.008,
              '牛膝':0.08,
              '槐花':0.06,
              '槐角':0.04,
              '黄精':0.22,
              '黄芪':0.037,
              '黄芩':0.058,
              '黄药子':0.05,
              '火麻仁':0.05,
              '鸡内金':0.04,
              '鸡失藤':0.04,
              '鸡血藤':0.04,
              '蒺藜':0.085,
              '炒六神曲':0.04,
              '姜半夏':0.1,
              '姜黄':0.033,
              '降香':0.03,
              '金钱草':0.06,
              '金银花':0.27,
              '金樱子':0.08,
              '荆芥':0.033,
              '韭菜子':0.12,
              '桔梗':0.093,
              '菊花':0.117,
              '橘核':0.036,
              '橘红':0.06,
              '决明子':0.04,
              '柯子':0.04,
              '苦参':0.038,
              '昆布':0.04,
              '莱菔子':0.05,
              '老鹤草':0.03,
              '荔枝核':0.04,
              '连翘':0.22,
              '细辛':0.35,
              '刘寄奴':0.05,
              '龙骨':0.35,
              '龙眼肉':0.16,
              '漏芦':0.06,
              '芦根':0.06,
              '鹿角胶':2.5,
              '鹿角片':1.5,
              '路路通':0.03,
              '罗布麻':0.05,
              '麻黄':0.036,
              '麻黄根':0.054,
              '麦冬':0.2,
              '麦芽':0.012,
              '蔓荆子':0.15,
              '芒硝':0.05,
              '没药':0.26,
              '蜜百部':0.12,
              '蜜麻黄':0.046,
              '蜜紫苑':0.065,
              '木瓜':0.052,
              '木香':0.045,
              '南沙参':0.18,
              '牛蒡子':0.048,
              '女贞子':0.02,
              '藕节':0.06,
              '胖大海':0.3,
              '炮姜':0.08,
              '佩兰':0.03,
              '枇杷叶':0.018,
              '蒲黄':0.15,
              '芡实':0.17,
              '茜草':0.12,
              '秦艽':0.1,
              '秦皮':0.08,
              '青黛':0.08,
              '青蒿':0.02,
              '青皮':0.029,
              '全蝎':5,
              '拳参':0.14,
              '人参':1.2,
              '忍冬藤':0.01,
              '肉苁蓉':0.16,
              '肉豆蔻':0.2,
              '肉桂':0.055,
              '乳香':0.09,
              '三棱':0.066,
              '三七':1,
              '桑白皮':0.09,
              '桑寄生':0.088,
              '桑皮':0.08,
              '桑螵蛸':1.5,
              '桑椹':0.09,
              '桑叶':0.018,
              '桑枝':0.013,
              '沙苑子':0.08,
              '砂仁':0.35,
              '山慈菇':0.52,
              '北豆根':0.05,
              '山茱萸':0.108,
              '射干':0.12,
              '伸筋草':0.033,
              '升麻':0.25,
              '生地':0.18,
              '生牡蛎':0.01,
              '生山楂':0.04,
              '生栀子':0.06,
              '石菖蒲':0.22,
              '石膏':0.01,
              '石斛':0.132,
              '石见穿':0.06,
              '熟地黄':0.09,
              '水牛角':0.1,
              '水蛭':3.1,
              '丝瓜络':0.115,
              '苏木':0.04,
              '太子参':0.24,
              '桃仁':0.115,
              '天冬':0.25,
              '天花粉':0.1,
              '天麻':0.5,
              '天竺黄':0.12,
              '葶苈子':0.06,
              '通草':0.52,
              '透骨草':0.04,
              '土鳖虫':0.22,
              '土茯苓':0.07,
              '菟丝子':0.059,
              '瓦楞子':0.02,
              '王不留':0.04,
              '威灵仙':0.3,
              '乌梅':0.11,
              '乌药':0.04,
              '吴茱萸':0.28,
              '蜈蚣':7,
              '五倍子':0.09,
              '五加皮':0.05,
              '五灵脂':0.11,
              '五味子':0.166,
              '西青果':0.11,
              '豨签草':0.06,
              '夏枯草':0.05,
              '仙鹤草':0.019,
              '仙茅':0.18,
              '香薷':0.05,
              '香橼':0.05,
              '小茴香':0.04,
              '小蓟':0.03,
              '薤白':0.18,
              '辛夷':0.09,
              '徐长卿':0.15,
              '续断':0.076,
              '玄参':0.04,
              '旋复花':0.17,
              '阳起石':0.035,
              '首乌藤':0.03,
              '益母草':0.018,
              '益智仁':0.16,
              '薏苡仁':0.045,
              '茵陈':0.026,
              '银柴胡':0.15,
              '银杏叶':0.05,
              '淫羊藿':0.2,
              '鱼腥草':0.05,
              '玉竹':0.08,
              '郁金':0.09,
              '皂角刺':0.165,
              '泽兰':0.023,
              '翟麦':0.03,
              '浙贝母':0.125,
              '珍珠母':0.02,
              '知母':0.062,
              '制草乌':0.1,
              '制川乌':0.09,
              '制马钱子':0.2,
              '制首乌':0.08,
              '制远志':0.24,
              '炙甘草':0.035,
              '蜜款冬花':0.18,
              '朱砂':1.5,
              '猪苓':0.25,
              '猪牙皂角':0.15,
              '竹茹':0.035,
              '竹叶':0.035,
              '紫草':0.14,
              '紫河车':2.8,
              '紫花地丁':0.06,
              '紫石英':0.02,
              '紫苏梗':0.06,
              '紫苏叶':0.06,
              '紫苏子':0.07,
              '丁香':0.2,
              '苍术':0.46,
              '黄连':0.38,
              '黄柏':0.1,
              '乌梢蛇':2,
              '僵蚕':0.45,
              '防己':0.4,
              '羌活':0.285,
              '蒲公英':0.032,
              '石决明':0.06,
              '狗脊':0.03,
              '前胡':0.1,
              '白前':0.11,
              '白鲜皮':0.21,
              '灯芯草':0.38,
              '马齿苋':0.03,
              '厚朴':0.04,
              '锁阳':0.22,
              '石韦':0.06,
              '酒大黄':0.12,
              '浮萍':0.03,
              '大青叶':0.02,
              '荆芥穗':0.09,
              '白附子':0.12,
              '川芎':0.08,
              '炒山楂':0.018,
              '海哈粉':0.02,
              '油松节':0.04,
              '寻骨风':0.04,
              '金礞石':0.02,
              '鹿角霜':0.11,
              '夜明砂':0.05,
              '牡丹皮':0.15,
              '海风藤':0.05,
              '代赭石':0.01,
              '茯神':0.17,
              '木蝴蝶':0.1,
              '鳖甲':0.5,
              '壁虎':0.8,
              '阿魏':0.15,
              '败酱草':0.03,
              '盐杜仲':0.05,
              '穿山龙':0.06,
              '炒白芍':0.055,
              '凤凰衣':0.06,
              '木槿花':0.5,
              '守宫散':1.2,
              '高良姜':0.06,
              '姜枣引':2,
              '扁蓄':0.03,
              '软蜂房':1.5,
              '煎药':3,
              '莲子心':0.26,
              '荆芥炭':0.07,
              '青蒙石':0.05,
              '龟板':0.75,
              '炒麦芽':0.016,
              '自然铜':0.018,
              '山药':0.055,
              '清半夏':0.1,
              '鹿茸':6,
              '炒麦子':0.03,
              '荷叶':0.035,
              '甜菜叶':0.5,
              '重楼':4.2,
              '免煎 沉香':3,
              '免煎   阿胶':7,
              '饴糖':0.05,
              '饴糖':0.5,
              '生附子':0.12,
              '免煎 补骨脂':2.6,
              '过桥草':1.8,
              '卷柏':0.12,
              '西洋参':1.2,
              '炒枳壳':0.072,
              '血余炭':0.15,
              '泽泻':0.1,
              '免煎  蜂房':4.5,
              '莪术':0.036,
              '免煎  鬼箭羽':3,
              '免煎 柏子仁':3.8,
              '免煎 炒刺猥皮':5.5,
              '免煎  紫河车':5.8,
              '免煎  水蛭':7,
              '免煎 炒酸枣仁':6,
              '甜叶菊':2,
              '陈皮':0.027,
              '黑蒲黄':0.4,
              '大黄炭':0.08,
              '地榆炭':0.08,
              '檀香免煎':3,
              '免煎 龙骨':6,
              '猫爪草':0.25,
              '半枝莲':0.05,
              '贯仲':0.045,
              '免煎  红花':3.3,
              '莲子芯':0.05,
              '龙胆':0.177,
              '黄芩炭':0.16,
              '白术炭':0.15,
              '生地炭':0.095,
              '黄柏炭':0.2,
              '贯仲炭':0.07,
              '桔叶':0.12,
              '木贼':1.5,
              '玫瑰花':1.1,
              '檀香':2.76,
              '煅磁石':1.68,
              '炒刺猥皮':3.72,
            }
            let perOrdTotal = 0
            for(let oneMed of this.orderMed1PerObj){
              let sellPriceOfMed = fakePriceDict[oneMed.name]? fakePriceDict[oneMed.name] : 0
              let medDose = parseInt(oneMed.count);
              perOrdTotal = parseFloat((perOrdTotal + parseFloat((sellPriceOfMed*medDose).toFixed(2))).toFixed(2));
            }
            toTestTotal = (perOrdTotal * this.orderCount).toFixed(2);
          }
        }

        if(this.medRadio == '免煎' || this.medRadio == '西药'){
          //如果是免煎药或者是西药，更新药品库存
          let sqlStatement = '';
          for(let oneMed of this.orderMed1PerObj){
            let countCost = oneMed.count * this.orderCount;
            let oneSqlString = 'UPDATE ' + this.$store.state.user.dbs_prefix+'medlist' +  ' SET inventoryNm = inventoryNm - ' + countCost + " WHERE medname = '" + oneMed.name + "';";
            sqlStatement = sqlStatement + oneSqlString;
          }
          this.$http.post('/api/updateMedInventory',{
            sqlStatement : sqlStatement,
          }).then( (res) => {
            console.log('update med success');
          })
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
                total : this.medRadio == '药丸'? yaowanTotal : parseFloat(this.total),
                totalprofit : ordProfit,
                date : getNowFormatDate(),
              }).then( (resord) => {   
                if(saveToTest){
                  this.$http.post('/api/insertPatientOrderPage',{
                    dbs : 'test_patient',
                    name : this.patientName,
                    name_pinyin : pinyin(this.patientName,{style: pinyin.STYLE_NORMAL}).join(""),
                    sex : this.patientSex,
                    age : !this.patientAge? 0 : parseFloat(this.patientAge),
                    phone : !this.patientPhone? 0 : parseInt(this.patientPhone),
                    lastVisit : getNowFormatDate(),
                  }).then( (res) => {
                    this.$http.post('/api/insertOrd',{
                      dbs : 'test_ordlist',
                      patient : this.patientName,
                      patient_id : res.data.insertId,
                      symptom : this.patientSymptom,
                      order_comment : this.orderComment,
                      medtype : this.medRadio,
                      dose : this.orderCount,
                      medarray : this.medString,
                      total : toTestTotal,
                      totalprofit : ordProfit,
                      date : getNowFormatDate(),
                    }).then( res => {
                      this.clearInfo();
                      this.radioChanged();
                    })
                  })
                }else{
                  this.clearInfo();
                  this.radioChanged();
                }
              })
              .catch( (err) =>{
                console.log(err);
              })
            })
            .catch( (err) =>{
              console.log(err);
            })
        }else{
          //update lastvistit
          this.$http.post('/api/updatePatientTimes',{
            dbs : this.$store.state.user.dbs_prefix+'patient',
            patient_id: this.patient_id,
            change: 1,
          }).then( (res) => {
            this.$http.post('/api/updatePatientOrderPage',{
              dbs : this.$store.state.user.dbs_prefix+'patient',
              sex : this.patientSex,
              age : !this.patientAge? 0 : parseFloat(this.patientAge),
              phone : !this.patientPhone? 0 : parseInt(this.patientPhone),
              patient_id: this.patient_id,
            })
            this.$http.post('/api/insertOrd',{
              dbs : this.$store.state.user.dbs_prefix+'ordlist',
              patient : this.patientName,
              patient_id : this.patient_id,
              symptom : this.patientSymptom,
              order_comment : this.orderComment,
              medtype : this.medRadio,
              dose : this.orderCount,
              medarray : this.medString,
              total : this.medRadio == '药丸'? yaowanTotal : parseFloat(this.total),
              totalprofit : ordProfit,
              date : getNowFormatDate(),
            }).then( (resord) => {
              this.clearInfo();
              this.radioChanged();
              if(saveToTest){
                this.$http.post('/api/insertOrd',{
                  dbs : 'test_ordlist',
                  patient : this.patientName,
                  patient_id : this.patient_id,
                  symptom : this.patientSymptom,
                  order_comment : this.orderComment,
                  medtype : this.medRadio,
                  dose : this.orderCount,
                  medarray : this.medString,
                  total : toTestTotal,
                  totalprofit : ordProfit,
                  date : getNowFormatDate(),
                }).then( res => {
                  this.clearInfo();
                  this.radioChanged();
                })
              }else{
                this.clearInfo();
                this.radioChanged();
              }
            })
            .catch( (err) =>{
              console.log(err);
            })
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
        this.useage = '';
        this.orderMed1PerObj = [];
        this.medString = '';
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
        console.log('lost focus')
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
        this.$router.push({name: 'Patient Profile', params: {pt_id: id}});
      },
      unpackOrdFromOutside: function(ordItem){
        this.medRadio = ordItem.medtype;
        this.patientName = ordItem.patient;
				this.patientAge = ordItem.age;
        this.patientSex = ordItem.sex;
        this.patientSymptom = ordItem.symptom;
        this.orderComment = ordItem.order_Comment;
        this.patientPhone = ordItem.phone;
        this.patient_id = ordItem.patient_id;
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
              var existInDb = this.cacheMedData.find(function(p){
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
              var existInDb = this.cacheMedData.find(function(p){
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
              var existInDb = this.cacheMedData.find(function(p){
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
      },

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
      if(reuseOrd != undefined){
        if(Object.keys(reuseOrd).length < 10){
          this.patientName = reuseOrd.patient;
          this.patientAge = reuseOrd.age;
          this.patientSex = reuseOrd.sex;
          this.patientPhone = reuseOrd.phone;
          //this.getAll();
        }else{
          this.unpackOrdFromOutside(reuseOrd);
        }        
      }else{
        this.getAll();
      }
      let userSetting = loadFromLocal(this.$store.state.user.user_id,'userSetting', []);
      this.enableYaowan = userSetting[0]['displayYaowan'];
      this.doctor = userSetting[0]['defaultDoctor'];
    },

    created() {
      reuseOrd = this.$route.params.ord_item;
    }

    
  }
</script>
<style scoped>
  .smallHeight .v-data-table td{
    height: 20px;
    font-size: 14px;
  }
</style>
