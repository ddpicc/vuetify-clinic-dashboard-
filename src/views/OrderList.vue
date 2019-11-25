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
              @click="outDbEnable"
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </template>
          <!--  need a key of id -->
          <v-data-table
            v-model="selected"
            :show-select="selectEnabled"
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
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-close
            </v-icon>
          </template>
          <template v-if="selectEnabled" v-slot:body.append="{ headers }">
            <tr>
              <td :colspan="headers.length-2">
              </td>
              <td :colspan="1" align="right">
                <v-btn text small>确认</v-btn>
              </td>
              <td :colspan="1" align="left">
                <v-btn text small>取消</v-btn>
              </td>
            </tr>
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
                        <td :colspan="2"><p>年龄： {{item.patient}}</p></td>
                        <td :colspan="2"><p>性别： {{item.patient}}</p></td>
                        <td :colspan="2"><p>电话:  {{item.patient}}</p></td>
                      </tr>
                      <tr>
                        <td  :colspan="6" style="border-bottom:1px solid"><p>症状： {{item.patient}}</p></td>
                        <td  :colspan="2" style="border-bottom:1px solid"><p>备注： {{item.patient}}</p></td>
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
                        <td :colspan="2" style="border-bottom:1px solid"><p>价钱： {{item.total}}</p></td>
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
  var pinyin = require("pinyin");
  export default {
    data: () => ({
      searchStr: '',
      selected: [],
      selectEnabled: false,
      loading: false,
      expanded: [],
      headers: [
        { text: '', value: 'data-table-expand' },
        { text: '序号', value: 'id' },
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
        this.$http.get('/api/getAllOrd',{
          params: {
            dbs : 'qcui_ordlist'
					}
        }).then( (res) => {
          this.items = res.data;
          for(let element of this.items) {
            element.medarray = element.medarray.split(";");
          }
          this.loading = false;
        })
      },

      outDbEnable: function(){
        if(this.selectEnabled)
          this.selectEnabled = false;
        else
          this.selectEnabled = true;
      },

      getColor (medtype) {
        if (medtype == '免煎') return 'lime darken-2'
        else if (medtype == '西药') return 'blue lighten-2'
        else return 'green'
      },
    },

    mounted: function() {
			this.getAll();
		}

    
  }
</script>
