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
        >
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="id"
            :items-per-page="15"
            :search="searchStr"
            :custom-filter="filterText"
            :loading="loading"
          >
          <template v-slot:top>
            <v-text-field v-model="searchStr" label="搜索..." class="mx-4"></v-text-field>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn @click.stop="jumpDetail(item.id)" text color="green">详情
    			  </v-btn>
            <v-btn @click.stop="deletePatient(item.id)" text color="green">删除
    			  </v-btn>
          </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-btn block color="green" dark class="mt-5" :disabled="loading || !hasMore" @click="getAll(1)">读取更多</v-btn>
          </div>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
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
          text: '就医次数',
					value: 'visitTimes',
					width: '25%'
        },
        {
          sortable: false,
          text: '操作',
					value: 'action',
					width: '20%'
        },
      ],
      items: [],
      hasMore: true
    }),
    computed: {
      ...mapState('patientpage', ['offset']),
    },

    methods: {
      //搜索
      filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().indexOf(search) !== -1
      },

      // 获取系统中所有病人
      getAll: function(_offset = 0) {
        if (this.loading) return;
        this.loading = true;
        if(_offset === 0){
          this.$store.commit('patientpage/GO_PAGE', 0);
          this.items = [];
          this.hasMore = true;
        }
        this.$http.get('/api/loadPatientMore',{
          params: {
            dbs : this.$store.state.user.dbs_prefix+'patient',
            offset : this.offset,
					}
        }).then((res) => {
          const patients = Array.isArray(res.data) ? res.data : [];
          this.$store.commit('patientpage/NEXT_PAGE', patients.length);
          this.items = this.items.concat(patients);
          this.hasMore = patients.length === 3000;
        }).catch(() => {
          this.hasMore = true;
        }).then(() => {
          this.loading = false;
        });
      },

      backTop() {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
			},
			
			jumpDetail: function(id){
        this.$router.push({name: 'Patient Profile', params: {pt_id: id}});
      },
      
      deletePatient: function(id){
        this.$http.delete('/api/deletePatientbyId',{
          params: {
            dbs : this.$store.state.user.dbs_prefix+'patient',
						patient_id : id
					}
        }).then( (res) => {
          this.snackbar = true;
          this.notification = '删除成功';
          this.snackbarColor = 'green';
          this.getAll(0);
        })
      }
    },

    mounted: function() {
			this.getAll(0);
		}

    
  }
</script>
