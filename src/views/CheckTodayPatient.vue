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
          title="今日病人"
        >
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="name"
            :items-per-page="15"
            loading="loading"
          >
          <template v-slot:item.action="{ item }">
						<v-btn @click.stop="selectPatient(item)" text color="green">选择</v-btn>
            <v-btn v-if="canFinish(item.isFinished)" @click.stop="finishPatient(item.id)" text color="green">完成</v-btn>
          </template>
					<template v-slot:item.name="{ item }">
            <v-chip :color="getColor(item.isFinished)" dark>{{ item.name }}</v-chip>
          </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-btn block color="green" dark class="mr-2" @click="displayAll">{{displayBtnText}}</v-btn>
          </div>
        </material-card>
				<v-dialog v-model="selectPatientDialog" scrollable persistent max-width="800px">
					<material-card class="v-card-profile">
						<v-data-table
							:headers="ordHeaders"
							:items="ordItems"
							item-key="id"
							show-expand
							single-expand
							:expanded.sync="expanded"
							:items-per-page="15"
							loading 
							loading-text="没有找到该病人"
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
						<div class="text-center pt-2">
							<v-btn block color="green" dark class="mr-2" @click="usePIngoreOrd">跳过,直接生成新病人</v-btn>
          	</div>
        	</material-card>
				</v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
	let socket;
  export default {
    data: () => ({
      headers: [
				{ text: '序号', value: 'id' },
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
					width: '15%'
				},
				{
          sortable: false,
          text: '性别',
					value: 'sex',
					width: '15%'
        },
        {
          sortable: false,
          text: '时间',
					value: 'time',
					width: '15%'
        },
        {
          sortable: false,
          text: '操作',
					value: 'action',
					width: '30%'
        },
      ],
			items: [],
			ordHeaders: [
				{ text: '', value: 'data-table-expand' },
				{
          sortable: false,
          text: '姓名',
          value: 'patient'
        },
        {
          sortable: false,
          text: '类型',
          value: 'medtype'
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
      ordItems: [],
      expanded: [],
			finishEnabled: true,
			displayBtnText: '显示全部',
			selectPatientDialog: false,
			patientName: '',
      patientSex: '',
      patientAge: '',
			patientPhone: '',
			lockReconnect: false
    }),

    methods: {
      // 获取今日没有看过的病人
      getNotFinished: function() {
        this.$http.get('/api/getAllPatientNotFinished',{
          params: {
						dbs : this.$store.state.user.dbs_prefix+'registerPatient',
						isFinished : 0
					}
        }).then( (res) => {
          this.items = res.data;
        })
			},
			// 获取今日所有的病人
			getAll: function() {
        this.$http.get('/api/getAllPatient',{
          params: {
            dbs : this.$store.state.user.dbs_prefix+'registerPatient',
					}
        }).then( (res) => {
          this.items = res.data;
        })
			},

			getColor: function(isFinished){
				if (isFinished == '1') return 'lime darken-2'
				else return 'green'
			},

			canFinish: function(isFinished){
				if(isFinished){
					return false;
				}else{
					return true;
				}
			},

			usePIngoreOrd: function(){
				let onlyNameObj = {
					patient : this.patientName,
					age : this.patientAge,
					sex : this.patientSex,
					phone : this.patientPhone,
				}
				this.patientName = '';
        this.patientAge = '';
        this.patientSex = '';
        this.patientPhone = '';
				this.$router.push({name: '生成处方', params: {ord_item: onlyNameObj}});
			},
			
			displayAll: function() {
				if(this.displayBtnText === '显示全部'){
					this.displayBtnText = '隐藏';
					this.getAll();
				}else{
					this.displayBtnText = '显示全部';
					this.getNotFinished();
				}
			},
      
      finishPatient: function(id){
        this.$http.post('/api/setPatientFinished',{
					dbs : this.$store.state.user.dbs_prefix+'registerPatient',
					isFinished : 1,
					patient_id : id
        }).then( (res) => {
					this.getNotFinished();
					this.onSubmit();
        })
			},

			selectPatient: function(item){
				this.selectPatientDialog = true;
				this.patientName = item.name;
        this.patientAge = item.age;
        this.patientSex = item.sex;
        this.patientPhone = item.phone;
				this.$http.get('/api/selectOrdByPatientName',{
          params: {
            dbs_a : this.$store.state.user.dbs_prefix+'ordlist',
            dbs_b : this.$store.state.user.dbs_prefix+'patient',
            patient_name: item.name
            }
				}).then( (respond) => {
					this.ordItems = respond.data;
					for(let element of respond.data) {
						element.medarray = element.medarray.split(";");
					}
				})
			},

			reuse: function(selectedItem){
        this.$router.push({name: '生成处方', params: {ord_item: selectedItem}});
      },
			
			createWebSocket() {
				try {
						// 创建Web Socket 连接
						socket = new WebSocket("ws://127.0.0.1:8081");
						// 初始化事件
						this.initEventHandle(socket);
				} catch (e) {
						// 出错时重新连接
						this.reconnect("ws://127.0.0.1:8081");
				}
			},
			
      initEventHandle(socket) {
				// 连接关闭时触发
				socket.onclose = () => {
						console.log("连接关闭");
				};
				// 通信发生错误时触发
				socket.onerror = () => {
						// 重新创建长连接
						this.reconnect();
				};
				// 连接建立时触发
				socket.onopen = () => {
						console.log("连接成功");
				};
				// 客户端接收服务端数据时触发
				socket.onmessage = msg => {
						// 业务逻辑处理
						console.log(msg.data, "ws:data");
				};
			},
			reconnect() {
				if (this.lockReconnect) {
						return;
				}
				this.lockReconnect = true;

				// 没连接上会一直重连，设置延迟避免请求过多
				setTimeout(() => {
						this.lockReconnect = false;
						this.createWebSocket("ws://127.0.0.1:8081");
				}, 2000);
			},
			onSubmit() {
				// 给服务器发送一个字符串:
				// ws.send("Hello!");
				socket.send("reload");
			}
    },

    mounted: function() {
			this.getNotFinished();
			this.createWebSocket();
		}

    
  }
</script>
