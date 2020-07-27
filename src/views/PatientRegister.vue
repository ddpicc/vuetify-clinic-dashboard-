<template>
  <div id="app">
   <v-app light>
    <v-app-bar
      app
      color="white"
      height="50"
    >
      <v-avatar
        class="mr-3"
        color="grey lighten-5"
        size="50"
      >
        <v-img
          contain
          max-height="100%"
          src="../assets/logo1.png"
          @click.stop="jumpHome"
        ></v-img>
      </v-avatar>
		</v-app-bar>

    <v-content>
			<v-banner>
				<h4 style="text-align:center;">当前等待人数 ： {{waitingPatient}} 人</h4>				
			</v-banner>
			<v-container
				fill-height
				fluid
				grid-list-xl
			>
				<v-row justify="center">
					<v-col cols="12" md="6">
						<material-card
							color="green"
							title="排号"
							text="云杰诊所"
						>
							<v-form>
								<v-container class="py-0">
									<v-row>
										<v-col cols="12" md="4">
											<v-text-field
												class="purple-input"
												label="姓名"
												v-model="patientName"
											/>
										</v-col>
										<v-col cols="12" md="4">
											<v-select v-model="patientSex"
												:items="sexItems"
												label="性别"
											></v-select>
										</v-col>
										<v-col cols="12" md="4">
											<v-text-field v-model="patientAge"
												class="purple-input"
												label="年龄"
											/>
										</v-col>
										<v-col cols="12" md="12">
											<v-text-field v-model="patientPhone"
												label="电  话"
												class="purple-input"
											/>
										</v-col>
										<v-col cols="12" class="text-right">
											<v-btn color="blue" @click.stop="registerP">
												提交
											</v-btn>
										</v-col>
									</v-row>
								</v-container>
							</v-form>
							<v-snackbar
								v-model="snackbar"
								:color="snackbarColor"
								:timeout="8000"
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
    </v-content>
  </v-app>
  </div>
</template>

<script>
	import { getTime, getNowFormatDate} from '../utils/handleDate';
	let socket;
	var connectUrl = 'ws://127.0.0.1:8081';
	//"ws://49.233.152.15:8081"
  export default {
    data () {
      return {
				patientName: '',
      	patientAge: '',
      	sexItems: ['男', '女'],
      	patientSex: '男',
				patientPhone: '',
				snackbar: false,
      	snackbarColor: '',
				notification: '',
				lockReconnect: false,
				waitingPatient: 0
      }
    },

    methods: {
			jumpHome: function(){
        this.$router.push({ path: '/' });
			},

			getWaitingPatient: function(){
				this.$http.get('/api/getAllPatientNotFinished',{
          params: {
						dbs : 'qcui_registerPatient',
						isFinished : 0,
					}
        }).then( (res) => {
					this.waitingPatient = res.data.length;
				})
			},

			registerP: function(){				
        if(this.patientName == ''){
          alert('姓名不能为空');
          return;
				}
				let that = this;
				this.$http.get('/api/getAllPatientNotFinished',{
          params: {
						dbs : 'qcui_registerPatient',
						isFinished : 0,
					}
        }).then( (res) => {
					let existInWaitingList = res.data.find(function(p){
            return p.name === that.patientName;
					});
					if(typeof(existInWaitingList)!="undefined"){
						this.snackbar = true;
						this.notification = '您已经取过号了，你的号码是第' + existInWaitingList.id + '号, 你前面有' + res.data.indexOf(existInWaitingList) + '人在等待';
						this.snackbarColor = 'green';
						//clear
						this.patientName = '';
						this.patientSex = '男';
						this.patientAge = '';
						this.patientPhone = '';
					}else{
						this.$http.post('/api/registerPatient',{
							dbs : 'qcui_registerPatient',
							name : this.patientName,
							sex : this.patientSex,
							age : !this.patientAge? 0 : parseFloat(this.patientAge),
							phone : !this.patientPhone? 0 : parseInt(this.patientPhone),
							date : getNowFormatDate(),
							time : getTime()
						}).then( (resk) => {
							this.snackbar = true;
							this.notification = '排号成功,你的号码是第' + resk.data.insertId + '号';
							this.snackbarColor = 'green';
							this.onSubmit();
							//clear
							this.patientName = '';
							this.patientSex = '男';
							this.patientAge = '';
							this.patientPhone = '';
						}).catch( (err) =>{
							alert(err);
						})
					}
				})
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
						this.getWaitingPatient();
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
			this.createWebSocket();
			this.getWaitingPatient();   
		}
  }
</script>