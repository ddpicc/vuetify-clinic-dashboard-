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
          color="primary"
          title="病人管理"
        >
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="id"
            :items-per-page="-1"
            :loading="loading"
            hide-default-footer
          >
          <template v-slot:top>
            <v-text-field v-model="searchStr" label="按姓名或电话搜索..." class="mx-4" @input="onSearchInput"></v-text-field>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn @click.stop="jumpDetail(item.id)" text color="primary">详情
              </v-btn>
            <v-btn @click.stop="deletePatient(item.id)" text color="primary">删除
              </v-btn>
          </template>
          </v-data-table>
          <div class="text-center pt-2" v-if="total > 0">
            <v-pagination
              v-model="page"
              :length="pageCount"
              :total-visible="7"
              :disabled="loading"
              @input="onPageChange"
            />
            <div class="caption mt-2">第 {{ page }} / {{ pageCount }} 页，共 {{ total }} 位患者</div>
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
      page: 1,
      pageSize: 30,
      total: 0,
      searchTimer: null,
      requestId: 0
    }),

    computed: {
      pageCount: function() {
        return Math.max(1, Math.ceil(this.total / this.pageSize));
      }
    },

    methods: {
      loadPatients: function(requestedPage = 1) {
        this.loading = true;
        const currentPage = Number(requestedPage) || 1;
        const currentSearch = this.searchStr;
        const currentRequestId = ++this.requestId;
        this.$http.get('/api/searchPatients', {
          params: {
            dbPrefix: this.$store.state.user.dbs_prefix,
            name: currentSearch,
            page: currentPage,
            pageSize: this.pageSize,
          }
        }).then((res) => {
          if (currentRequestId !== this.requestId) return;
          const data = res.data || {};
          this.total = Number(data.total) || 0;
          this.page = currentPage;
          this.items = Array.isArray(data.items) ? data.items : [];
        }).finally(() => {
          if (currentRequestId === this.requestId) this.loading = false;
        });
      },

      onPageChange: function(page) {
        this.loadPatients(page);
      },

      onSearchInput: function() {
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => this.loadPatients(1), 300);
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
        }).then(() => {
          this.snackbar = true;
          this.notification = '删除成功';
          this.snackbarColor = 'green';
          this.loadPatients(1);
        })
      }
    },

    mounted: function() {
      this.loadPatients(1);
    },

    beforeDestroy: function() {
      clearTimeout(this.searchTimer);
    }
  }
</script>
