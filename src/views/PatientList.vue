<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card 
        	flat
					color="green"
          title="病人管理"
          text="Complete your profile"
        >
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
            <v-btn @click.stop="jumpDetail(item.id)" text color="green">
      				<v-icon left>mdi-account-card-details</v-icon> 详情
    				</v-btn>
          </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-btn block color="green" dark class="mr-2" @click="backTop">回到顶部</v-btn>
          </div>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      searchStr: '',
      loading: false,
      headers: [
        {
          sortable: false,
          text: '姓名',
					value: 'name',
					width: '25%'
        },
        {
          sortable: false,
          text: '年龄',
					value: 'age',
					width: '10%'
        },
        {
          sortable: false,
          text: '电话',
					value: 'phone',
					width: '20%'
        },
        {
          sortable: false,
          text: '最近一次诊断',
					value: 'bagperbox',
					width: '25%'
        },
        {
          sortable: false,
          text: '操作',
					value: 'action',
					width: '20%'
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

      // 根据类型获取药品数据
      getAll: function() {
        this.loading = true;
        this.$http.get('/api/getAllPatient').then( (res) => {
          this.items = res.data;
          this.loading = false;
        })
      },

      backTop() {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
			},
			
			jumpDetail: function(id){
        this.$router.push({name: 'User Profile', params: {pt_id: id}});
			}
    },

    mounted: function() {
			this.getAll();
		}

    
  }
</script>
