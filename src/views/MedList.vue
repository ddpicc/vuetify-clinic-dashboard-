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
              @click="adddialog = true"
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
              @click="deleteItem(item)"
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
                <span class="headline">User Profile</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field label="Legal first name*" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Legal last name*"
                        hint="example of persistent helper text"
                        persistent-hint
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="Email*" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="Password*" type="password" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        :items="['0-17', '18-29', '30-54', '54+']"
                        label="Age*"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                        label="Interests"
                        multiple
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="adddialog = false">Close</v-btn>
                <v-btn color="blue darken-1" text @click="adddialog = false">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
      adddialog: false,
      loading: false,
      cardColor: 'green',
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
      items: []
    }),

    methods: {
      //搜索
      filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().indexOf(search) !== -1
      },

      // 获取全部数据
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
      }
    },

    mounted: function() {
			this.getAll();
		}

    
  }
</script>
