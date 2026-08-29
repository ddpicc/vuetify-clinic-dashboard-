<template>
  <v-container fluid grid-list-xl>
    <v-row>
      <v-col cols="12" md="4">
        <material-card flat color="primary" title="重复患者组">
          <v-text-field v-model="search" class="mx-2" label="按姓名搜索" clearable @input="onSearch" />
          <v-data-table :headers="groupHeaders" :items="groups" :loading="loadingGroups" :items-per-page="pageSize" item-key="name" hide-default-footer @click:row="loadGroup">
            <template v-slot:item.patient_count="{ item }">{{ item.patient_count }} 条档案</template>
          </v-data-table>
          <div class="text-center pt-2" v-if="totalGroups">
            <v-pagination v-model="page" :length="pageCount" :disabled="loadingGroups" @input="loadGroups" />
          </div>
        </material-card>
      </v-col>

      <v-col cols="12" md="8">
        <material-card flat color="primary" :title="selectedName ? `合并：${selectedName}` : '选择重复姓名组'">
          <div v-if="!selectedName" class="pa-4 grey--text">从左侧选择一个姓名组，查看档案和关联记录。</div>
          <template v-else>
            <v-alert type="info" outlined dense>
              推荐保留有真实电话的第一条档案。勾选其他档案作为来源后，系统会把它们的处方和膏方一次性迁移到保留档案；来源档案只标记为“已合并”，不会删除。
            </v-alert>
            <div class="d-flex align-center mb-2">
              <v-btn small outlined color="primary" class="mr-2" @click="selectNoPhone">全选无电话档案</v-btn>
              <v-btn small text @click="clearSources">清空来源选择</v-btn>
              <span class="caption ml-auto">共 {{ patients.length }} 条档案，已选来源 {{ sourceIds.length }} 条</span>
            </div>
            <div class="patient-table-scroll">
              <v-data-table
                :headers="patientHeaders"
                :items="patients"
                :loading="loadingPatients"
                :items-per-page="patientPageSize"
                :footer-props="{ 'items-per-page-options': [10, 25, 50, 100, -1] }"
                item-key="id"
                show-select
                :value="selectedPatients"
                @input="setSelectedPatients"
              >
                <template v-slot:item.has_phone="{ item }"><v-chip x-small :color="item.has_phone ? 'green' : 'grey'" dark>{{ item.has_phone ? '有电话' : '无电话' }}</v-chip></template>
                <template v-slot:item.phone="{ item }">{{ item.phone || '未填写' }}</template>
                <template v-slot:item.order_count="{ item }">{{ item.order_count || 0 }}</template>
                <template v-slot:item.gaofang_count="{ item }">{{ item.gaofang_count || 0 }}</template>
                <template v-slot:item.last_visit="{ item }">{{ item.last_visit || '暂无' }}</template>
              </v-data-table>
            </div>

            <v-row class="mt-3" align="center">
              <v-col cols="12" sm="7">
                <v-select v-model="targetId" :items="patients" :item-text="targetText" item-value="id" label="保留患者（目标档案）" :disabled="!patients.length" hint="默认选择第一条有电话档案" persistent-hint />
              </v-col>
              <v-col cols="12" sm="5" class="text-right">
                <v-btn color="error" :disabled="!targetId || !sourceIds.length || merging" :loading="merging" @click="confirmMerge">
                  <v-icon left>mdi-account-switch</v-icon>合并 {{ sourceIds.length }} 条来源
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </material-card>
      </v-col>
    </v-row>

    <v-dialog v-model="confirmDialog" max-width="560">
      <v-card>
        <v-card-title>确认批量合并？</v-card-title>
        <v-card-text>
          将 {{ sourceIds.length }} 条来源档案的处方和膏方迁移到目标患者 ID {{ targetId }}（{{ targetPatient ? targetPatient.name : '' }}{{ targetPatient && targetPatient.phone ? ` / ${targetPatient.phone}` : '' }}）。来源档案会标记为“已合并”，不会删除；本次操作会在一个事务中完成，任一条失败都会全部回滚。
        </v-card-text>
        <v-card-actions><v-spacer /><v-btn text @click="confirmDialog = false">取消</v-btn><v-btn color="error" @click="merge">确认合并</v-btn></v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbarColor" top>{{ notification }}</v-snackbar>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    search: '', groups: [], patients: [], selectedPatients: [], selectedName: '', targetId: null,
    page: 1, pageSize: 30, patientPageSize: 25, totalGroups: 0, loadingGroups: false, loadingPatients: false,
    merging: false, confirmDialog: false, snackbar: false, snackbarColor: '', notification: '', searchTimer: null,
    groupHeaders: [
      { text: '姓名', value: 'name', sortable: false }, { text: '档案数', value: 'patient_count', sortable: false }, { text: '就诊次数', value: 'visit_times', sortable: false },
    ],
    patientHeaders: [
      { text: 'ID', value: 'id', sortable: false }, { text: '电话状态', value: 'has_phone', sortable: false }, { text: '电话', value: 'phone', sortable: false },
      { text: '性别', value: 'sex', sortable: false }, { text: '年龄', value: 'age', sortable: false }, { text: '处方', value: 'order_count', sortable: false },
      { text: '膏方', value: 'gaofang_count', sortable: false }, { text: '最近就诊', value: 'last_visit', sortable: false },
    ],
  }),
  computed: {
    pageCount () { return Math.max(1, Math.ceil(this.totalGroups / this.pageSize)); },
    sourceIds () { return this.selectedPatients.filter(patient => patient.id !== this.targetId).map(patient => patient.id); },
    targetPatient () { return this.patients.find(patient => patient.id === this.targetId); },
  },
  methods: {
    targetText (patient) { return `${patient.id} · ${patient.phone || '无电话'} · ${patient.order_count || 0} 条处方`; },
    loadGroups (page = 1) {
      this.loadingGroups = true; this.page = page;
      this.$http.get('/api/patientMergeGroups', { params: { dbPrefix: this.$store.state.user.dbs_prefix, token: this.$store.state.user.token, name: this.search, page, pageSize: this.pageSize } })
        .then(res => { const data = res.data || {}; this.groups = data.items || []; this.totalGroups = Number(data.total) || 0; })
        .catch(() => this.notify('重复患者组加载失败', 'error')).finally(() => { this.loadingGroups = false; });
    },
    onSearch () { clearTimeout(this.searchTimer); this.searchTimer = setTimeout(() => this.loadGroups(1), 300); },
    loadGroup (group) {
      this.selectedName = group.name; this.loadingPatients = true; this.patients = []; this.targetId = null; this.selectedPatients = [];
      this.$http.get('/api/patientMergeGroup', { params: { dbPrefix: this.$store.state.user.dbs_prefix, token: this.$store.state.user.token, name: group.name } })
        .then(res => { this.patients = res.data || []; const recommended = this.patients.find(patient => Number(patient.has_phone) === 1); if (recommended) this.targetId = recommended.id; })
        .catch(() => this.notify('患者组加载失败', 'error')).finally(() => { this.loadingPatients = false; });
    },
    setSelectedPatients (patients) { this.selectedPatients = patients.filter(patient => patient.id !== this.targetId); },
    selectNoPhone () { this.selectedPatients = this.patients.filter(patient => patient.id !== this.targetId && Number(patient.has_phone) !== 1); },
    clearSources () { this.selectedPatients = []; },
    confirmMerge () { this.confirmDialog = true; },
    merge () {
      this.confirmDialog = false; this.merging = true;
      this.$http.post('/api/mergePatients', { dbPrefix: this.$store.state.user.dbs_prefix, token: this.$store.state.user.token, sourcePatientIds: this.sourceIds, targetPatientId: this.targetId })
        .then(res => { const data = res.data || {}; this.notify(`合并完成：迁移处方 ${data.movedOrders || 0} 条，膏方 ${data.movedGaofang || 0} 条`, 'success'); this.loadGroup({ name: this.selectedName }); this.loadGroups(this.page); })
        .catch(error => { const message = error.response && error.response.data && error.response.data.error; this.notify(message || '合并失败', 'error'); })
        .finally(() => { this.merging = false; });
    },
    notify (message, color) { this.notification = message; this.snackbarColor = color; this.snackbar = true; },
  },
  mounted () { this.loadGroups(); }, beforeDestroy () { clearTimeout(this.searchTimer); },
};
</script>

<style scoped>
.patient-table-scroll { max-height: 620px; overflow-y: auto; border: 1px solid #e0e0e0; }
</style>
