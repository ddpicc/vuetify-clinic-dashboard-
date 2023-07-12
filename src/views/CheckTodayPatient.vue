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
            :loading="loading"
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
            <v-btn block color="green" dark class="mr-2" @click="displayAll()">{{displayBtnText}}</v-btn>
						<v-btn block color="green" dark class="mr-2" @click="gotoVideo()">视频</v-btn>
          </div>
        </material-card>
				<v-dialog
					v-model="selectPatientDialog"
					fullscreen
					hide-overlay
				>
					<v-card>
						<v-toolbar
							dark
							color="primary"
						>
							<v-btn
								icon
								dark
								@click="selectPatientDialog = false"
							>
								<v-icon>fa-close</v-icon>
							</v-btn>
							<v-spacer></v-spacer>
							<v-toolbar-items>
								<v-btn
									dark
									text
									@click="selectPatientDialog = false"
								>
									Save
								</v-btn>
							</v-toolbar-items>
						</v-toolbar>
						<v-container fluid>
							<div class="title">{{ patient.name }}</div>
							<v-divider></v-divider>
							<v-row>
								<v-col cols="12" md="6">
									<v-card
										class="mx-auto"
									>
										<v-card-title>
											Top western road trips
										</v-card-title>

										<v-card-subtitle>
											1,000 miles of wonder
										</v-card-subtitle>

										<v-card-actions>
											<v-btn
												color="orange lighten-2"
												text
											>
												Explore
											</v-btn>

											<v-spacer></v-spacer>

											<v-btn
												icon
												@click="show = !show"
											>
												<v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
											</v-btn>
										</v-card-actions>

										<v-expand-transition>
											<div v-show="show">
												<v-divider></v-divider>

												<v-card-text>
													I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
												</v-card-text>
											</div>
										</v-expand-transition>
									</v-card>
								</v-col>
								<v-col cols="12" md="6">
									<v-card
										class="mx-auto"
									>
										<v-card-title>
											Top western road trips
										</v-card-title>

										<v-card-subtitle>
											1,000 miles of wonder
										</v-card-subtitle>

										<v-card-actions>
											<v-btn
												color="orange lighten-2"
												text
											>
												Explore
											</v-btn>

											<v-spacer></v-spacer>

											<v-btn
												icon
												@click="show = !show"
											>
												<v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
											</v-btn>
										</v-card-actions>

										<v-expand-transition>
											<div v-show="show">
												<v-divider></v-divider>

												<v-card-text>
													I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
												</v-card-text>
											</div>
										</v-expand-transition>
									</v-card>
								</v-col>
							</v-row>
						</v-container>
					</v-card>
				</v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
	let socket;
	var connectUrl = 'ws://49.233.152.15:8081';
  export default {
    data: () => ({
			loading: false,
      headers: [
				{ text: '序号', value: 'id' },
        {
          sortable: false,
          text: '姓名',
					value: 'name',
        },
        {
          sortable: false,
          text: '年龄',
					value: 'age',
				},
				{
          sortable: false,
          text: '性别',
					value: 'sex',
        },
        {
          sortable: false,
          text: '时间',
					value: 'time',
        },
        {
          sortable: false,
          text: '操作',
					value: 'action',
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
			patient: {},
			show: false,
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
					for(let item of this.items){
						item.time = new Date(item.register_date).toLocaleString()
					}
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
					for(let item of this.items){
						item.time = new Date(item.register_date).toLocaleString()
					}
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
				this.patient = item
				/* this.$http.get('/api/selectOrdByPatientName',{
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
				}) */
			},

			reuse: function(selectedItem){
        this.$router.push({name: '生成处方', params: {ord_item: selectedItem}});
      },

			gotoVideo: function(){
        this.$router.push({ path: '/videocall' });
      },
			
			createWebSocket() {
				try {
						// 创建Web Socket 连接
						socket = new WebSocket(connectUrl);
						// 初始化事件
						this.initEventHandle(socket);
				} catch (e) {
						// 出错时重新连接
						this.reconnect(connectUrl);
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
						this.createWebSocket(connectUrl);
				}, 2000);
			},
			onSubmit() {
				// 给服务器发送一个字符串:
				// ws.send("Hello!");
				socket.send("reload");
			}
    },

    mounted: function() {
			this.getAll();
			//this.createWebSocket();
		}

    
  }
</script>
