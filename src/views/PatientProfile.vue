<template>
  <v-container
    fill-height
    fluid
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="5"
      >
        <material-card
          color="green"
          title="Edit Profile"
          text="Complete your profile"
        >
          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    class="purple-input"
                    label="姓名"
                    v-model="patientName"
                    :readonly="isReadonly"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select v-model="patientSex"
                    :items="sexItems"
                    label="性别"
                    :readonly="isReadonly"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="patientAge"
                    class="purple-input"
                    label="年龄"
                    :readonly="isReadonly"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="patientPhone"
                    label="电  话"
                    class="purple-input"
                    :readonly="isReadonly"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="patientWechat"
                    label="微  信"
                    class="purple-input"
                    :readonly="isReadonly"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="patienAddress"
                    label="城  市"
                    class="purple-input"
                    :readonly="isReadonly"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="patientComment"
                    class="purple-input"
                    label="备  注"
                    :readonly="isReadonly"
                  />
                </v-col>
                <v-col cols="12" class="text-right">
                  <v-btn color="blue" @click.stop="onClick">
                    {{btnName}}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </material-card>
      </v-col>
      <v-col
        cols="12"
        md="7"
      >
        <material-card class="v-card-profile">
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="id"
            show-expand
            single-expand
            :expanded.sync="expanded"
            :items-per-page="15"
            loading="loading"
          >
          <template v-slot:item.action="{ item }">
            <v-btn small @click.stop="reuse(item)" text color="green">重用</v-btn>
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
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      patientId: '',
      patientName: '',
      patientAge: '',
      sexItems: ['男', '女'],
      patientSex: '',
      patientPhone: '',
      patientWechat: '',
      patienAddress: '',
      patientComment: '',
      btnName: '更新',
      isReadonly: true,
      headers: [
        { text: '', value: 'data-table-expand' },
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
      items: [],
      expanded: []
    }),

    methods: {
      onClick () {
        if(this.btnName === '更新'){
          this.btnName = '保存';
          this.isReadonly = false;
        }else{
          //todo
          //update patient profile
          this.btnName = '更新';
        }
      },

      getAll: function() {
        this.$http.get('/api/getPatientInfo',{
          params: {
            dbs : this.$store.state.user.dbs_prefix+'patient',
						patient_id : this.patientId
					}
        }).then( (res) => {
          this.patientName = res.data[0].name;
          this.patientAge = res.data[0].age;
          this.patientSex = res.data[0].sex;
          this.patientPhone = res.data[0].phone;
          this.patientWechat = res.data[0].wechat;
          this.patienAddress = res.data[0].address;
          this.patientComment = res.data[0].comment;
          this.$http.get('/api/selectOrdByPatientId',{
          params: {
            dbs_a : this.$store.state.user.dbs_prefix+'ordlist',
            dbs_b : this.$store.state.user.dbs_prefix+'patient',
            patient_id: this.patientId
            }
          }).then( (respond) => {            
            for(let element of respond.data) {
              element.medarray = element.medarray.split(";");
            }
            this.items = respond.data;
          })
        })
      },

      reuse: function(selectedItem){
        this.$router.push({name: '生成处方', params: {ord_item: selectedItem}});
      },
    },

    mounted: function() {
			this.getAll();
    },
    
    created() {
      this.patientId = this.$route.params.pt_id;
    }
  }
</script>
