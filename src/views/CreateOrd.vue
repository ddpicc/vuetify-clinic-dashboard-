<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12" >
        <material-card flat full-width :color=cardColor>
          <template v-slot:header>
            <v-row 
              justify="center"
              align="center"
            >
              <v-col 
              sm="4" md="3"             
              justify="center"
              align="center"
              >
                <div class="px-3">
                  <div class="title font-weight-light mb-2">
                    <v-radio-group v-model="medRadio" :mandatory="false" row @change="radioChanged">
                      <v-radio label="草药" value="草药" color="grey darken-1"></v-radio>
                      <v-radio label="免煎" value="免煎" color="grey darken-1"></v-radio>
                      <v-radio label="西药" value="西药" color="grey darken-1"></v-radio>
                    </v-radio-group>
                  </div>
                </div>
              </v-col>
              <v-col cols="1"></v-col>
              <v-divider
                class="mx-2"
                vertical
              ></v-divider>
              <v-col>
                <v-container>
                  <v-row 
                  justify="left"
                  align="left"
                  dense
                  >
                    <v-col sm="4" md="3">
                      <v-text-field v-model="patientName"
                        label="姓名"
                      ></v-text-field>
                    </v-col>
                    <v-col sm="4" md="3">
                      <v-select v-model="patientSex"
                        :items="sexItems"
                        label="性别"
                      ></v-select>
                    </v-col>
                    <v-col sm="3" md="3">
                      <v-text-field v-model="patientAge"
                        label="年龄"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="1.5"></v-col>
                    <v-col sm="1.5" md="1.5"
                    align="right">
                      <v-speed-dial
                          v-model="fab"
                          bottom
                          right
                          small
                          :direction="direction"
                          open-on-hover
                          :transition="transition"
                        >
                        <template v-slot:activator>
                          <v-btn
                            v-model="fab"
                            color="amber"
                            dark
                            fab
                          >
                            <v-icon v-if="fab">mdi-close</v-icon>
                            <v-icon v-else>mdi-account-circle</v-icon>
                          </v-btn>
                        </template>
                        <v-btn
                          fab
                          dark
                          small
                          color="green"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          fab
                          dark
                          small
                          color="indigo"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                        <v-btn
                          fab
                          dark
                          small
                          color="red"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-speed-dial>
                    </v-col>
                  </v-row>
                  <v-row 
                  justify="left"
                  align="left"
                  dense
                  >
                    <v-col sm="4" md="4">
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
            justify="left"
            align="left"
            dense
            >
              <v-col sm="6" md="6">
                <v-autocomplete
                  label="Components"
                  :items="components"
                  :filter="customFilter"
                  dense
                  clearable
                  ref="mark1"
                  @keyup.enter.native="moveFocusToDose"
                  @update:search-input="test"
                  item-text="medname"
                  item-value="alias"
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
                  label="剂量"
                  dense
                  ref="mark2"
                ></v-text-field>
              </v-col>
              <v-col v-if="howToUseOn" sm="3" md="3">
                <v-text-field
                  label="剂量"
                  dense
                  ref="mark2"
                ></v-text-field>
              </v-col>
              <v-col v-if="howToUseOn" sm="3" md="3">
                <v-select
                  v-if="howToUseOn"
                  :items="hotToUse"
                  dense
                  clearable
                  label="用法用量"
                ></v-select>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.name="props">
            <v-edit-dialog
              :return-value.sync="props.item.name"
            > {{ props.item.name }}
              <template v-slot:input>
                <v-autocomplete
                  label="Components"
                  :items="components"
                  dense
                  clearable
                ></v-autocomplete>
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
          </v-data-table>
          <div class="text-center pt-2">
            <v-row>
              <v-col sm="5" md="6"></v-col>
              <v-col sm="5" md="4">
                <v-text-field dense v-model="patientSymptom"
                  label="处方备注" placeholder="备注"
                ></v-text-field>
              </v-col>
              <v-col sm="1" md="1">
                <v-text-field dense v-model="patientSymptom"
                  label="几付" placeholder="几付"
                ></v-text-field>
              </v-col>
              <v-col sm="1" md="1">
                <v-text-field dense v-model="patientSymptom"
                label="总价 ："
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

  var staticHeader=[{sortable: false, text: '名称', value: 'name1'}, {sortable: false,text: '数量', value: 'count1'}, {sortable: false,text: '名称', value: 'name2'}, {sortable: false,text: '数量', value: 'count2'}, 
                 {sortable: false,text: '名称', value: 'name3'}, {sortable: false,text: '数量', value: 'count3'}, {sortable: false,text: '名称', value: 'name4'}, {sortable: false,text: '数量', value: 'count4'}];

  var xiyaoHeader=[{sortable: false,text: '名称', value: 'name1'}, {sortable: false,text: '数量', value: 'count1'}, {sortable: false,text: '用量', value: 'usage1'}, {sortable: false,text: '名称', value: 'name2'}, 
                 {sortable: false,text: '数量', value: 'count2'}, {sortable: false,text: '用量', value: 'usage2'}];

  export default {
    data: () => ({
      direction: 'bottom',
      fab: false,
      searchStr: '',
      transition: 'slide-y-reverse-transition',
      sexItems: ['男', '女'],
      patientName: '',
			patientAge: '',
      patientSex: '',
      patientPhone: '',
      patientSymptom: '',
      perOrdTotal: 0,
      howToUseOn: false,
      hotToUse: ['一天一次', '一天三次'],
      medRadio: '草药',
      cardColor: 'green',
      componentsAfter: [],
      components: [],
      headers: staticHeader,
      items: [],
      cacheMedData: []
    }),

    methods: {
      //搜索
      filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().indexOf(search) !== -1
      },

      moveFocusToDose: function(){
        this.$refs.mark2.$el.querySelector('input').focus();
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
						medtype : this.medRadio
					}
        }).then( (res) => {
          this.cacheMedData = res.data;
          this.componentsAfter = res.data;
          this.loading = false;
        })
      },

      test: function(queryText){
        if(!queryText)
          return;
        //this.components = this.componentsAfter;
        if(queryText.length >= 2){
          if(this.components.length == 0){
            this.components = this.componentsAfter;
          }
        }else{
          this.components = [];
        }
      },

      radioChanged: function(){
        this.getAll();
        if(this.medRadio == "西药"){
          this.howToUseOn = true;
          this.cardColor = 'blue lighten-2';
          this.headers = xiyaoHeader;
				}else{
          this.howToUseOn = false;
          this.headers = staticHeader;
          if(this.medRadio == "免煎")
            this.cardColor = 'lime darken-2';
          else
            this.cardColor = 'green';
				}					
      },

      customFilter (item, queryText, itemText) {
        const textOne = item.alias;
        return textOne.indexOf(queryText) > -1;
      },
    }

    
  }
</script>
