<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card flat full-width :color=cardColor>
          <template v-slot:header>
            <div class="px-3">
              <div class="title font-weight-light mb-2">
                <v-radio-group v-model="medRadio" :mandatory="false" row @change="radioChanged">
                  <v-radio label="草药" value="草药" color="grey darken-1"></v-radio>
                  <v-radio label="免煎" value="免煎" color="grey darken-1"></v-radio>
                  <v-radio label="西药" value="西药" color="grey darken-1"></v-radio>
                </v-radio-group>
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
              @click="addMedShow"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="name"
            :items-per-page="5"
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
              @click="deleteItem(item.id)"
            >
              mdi-close
            </v-icon>
          </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-btn block color="green" dark class="mr-2" @click="backTop">回到顶部</v-btn>
          </div>
          <v-dialog v-model="adddialog" persistent max-width="600px">
            <v-card>
              <v-card-title>
                <span class="headline">{{dialogTitle}}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="4" md="6">
                      <v-text-field label="名称*" v-model="dialogMedName" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="3">
                      <v-text-field label="别名*" v-model="dialogAlias" hint="别名将会用在快速搜索"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="3">
                      <v-text-field label="规格" v-model="dialogSpec" ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-select v-model="dialogMedRadio" 
                        :items="medTypeItems"
                        label="类别"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-text-field label="袋/盒" v-model="dialogBagPerBox"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-text-field label="数量" v-model="dialogInventoryNm"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-text-field label="进价" v-model="dialogBaseprice"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-text-field label="零售价" v-model="dialogSellprice"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-switch v-model="dialogChecked" color="blue" label="库存监测"></v-switch>
                    </v-col>                    
                  </v-row>
                </v-container>
                <small>*表示选项是必填的</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cancelDialog">取消</v-btn>
                <v-btn color="blue darken-1" text @click="saveDialog">保存</v-btn>
              </v-card-actions>
            </v-card>
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
  export default {
    data: () => ({
      searchStr: '',
      medRadio: '草药',
      medTypeItems: ['草药','免煎','西药'],
      adddialog: false,
      loading: false,
      cardColor: 'green',
      dialogTitle: '',
      snackbar: false,
      snackbarColor: '',
      notification: '',
      headers: [
        {
          sortable: false,
          text: '药品名称',
          value: 'medname'
        },
        {
          sortable: false,
          text: '别名',
          value: 'alias'
        },
        {
          sortable: false,
          text: '规格',
          value: 'spec'
        },
        {
          sortable: false,
          text: '袋/盒',
          value: 'bagperbox',
        },
        {
          sortable: true,
          text: '数量',
          value: 'inventoryNm',
        },
        {
          sortable: false,
          text: '进价',
          value: 'baseprice',
        },
        {
          sortable: false,
          text: '零售价',
          value: 'sellprice',
        },
        {
          sortable: false,
          text: '监测',
          value: 'checked',
        },
        {
          sortable: false,
          text: '操作',
          value: 'action',
        },
      ],
      items: [],
      dialogMedName: "",
      dialogAlias: "",
      dialogSpec: "",
      dialogMedRadio: "草药",
      dialogBagPerBox: "",
      dialogInventoryNm: "",
      dialogBaseprice: "",
      dialogSellprice: "",
      dialogChecked: "",
      dialogMedId: ""
    }),

    methods: {
      //搜索
      filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().indexOf(search) !== -1
      },

      // 根据类型获取药品数据
      getAll: function() {
        this.loading = true;
        this.$http.get('/api/getAllMedbyType',{
          params: {
						medtype : this.medRadio
					}
        }).then( (res) => {
          this.items = res.data;
          this.loading = false;
        })
      },
      
      //当类型变化时改变颜色和重新读取数据
      radioChanged: function(){
        this.getAll();
        if(this.medRadio == "西药"){
          this.cardColor = 'blue lighten-2';
				}else if(this.medRadio == "免煎"){
          this.cardColor = 'lime darken-2';
				}else{
          this.cardColor = 'green';
        }					
      },

      backTop() {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      },

      addMedShow: function(){
        this.adddialog = true;
        this.dialogTitle = "新增药品";
      },

      editItem: function(item){
        this.adddialog = true;
        this.dialogTitle = "修改药品";
        this.dialogMedName = item.medname;
        this.dialogAlias = item.alias;
        this.dialogSpec = item.spec;
        this.dialogMedRadio = this.medRadio;
        this.dialogBagPerBox = item.bagperbox;
        this.dialogInventoryNm = item.inventoryNm;
        this.dialogBaseprice = item.baseprice;
        this.dialogSellprice = item.sellprice;
        this.dialogChecked = item.checked;
        this.dialogMedId = item.id;
      },

      clearVariable: function(){
        this.dialogMedName = '';
        this.dialogAlias = '';
        this.dialogSpec = '';
        this.dialogMedRadio = '草药';
        this.dialogBagPerBox = '';
        this.dialogInventoryNm = '';
        this.dialogBaseprice = '';
        this.dialogSellprice = '';
        this.dialogChecked = '';
      },

      cancelDialog: function(){
        this.clearVariable();
        this.adddialog = false;
      },

      saveDialog: function(){
        if(this.dialogTitle === "修改药品"){
          this.$http.post('/api/updateMedbyId',{            
              medname : this.dialogMedName,
              alias : this.dialogAlias,
              spec : this.dialogSpec,
              medtype : this.dialogMedRadio,
              bagperbox : this.dialogBagPerBox,
              inventoryNm : this.dialogInventoryNm,
              baseprice : this.dialogBaseprice,
              sellprice : this.dialogSellprice,
              checked : this.dialogChecked,
              id: this.dialogMedId            
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '修改成功';
            this.snackbarColor = 'green';
            this.getAll();
          })
        }else if(this.dialogTitle === "新增药品"){
          this.$http.post('/api/updateMedbyId',{            
              medname : this.dialogMedName,
              alias : this.dialogAlias,
              spec : this.dialogSpec,
              medtype : this.dialogMedRadio,
              bagperbox : this.dialogBagPerBox,
              inventoryNm : this.dialogInventoryNm,
              baseprice : this.dialogBaseprice,
              sellprice : this.dialogSellprice,
              checked : this.dialogChecked,           
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '增加成功';
            this.snackbarColor = 'green';
            this.getAll();
          })
        }
        this.adddialog = false;
        this.clearVariable();        
      }
    },

    mounted: function() {
			this.getAll();
		}

    
  }
</script>
