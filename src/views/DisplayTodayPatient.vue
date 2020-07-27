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
				<v-container
					fill-height
					fluid
					grid-list-xl
				>
					<v-row justify="center">
						<v-col cols="12" md="6">
							<material-card
								color="green"
								title="当前候诊"
								:text="getText()"
							> 
								<v-data-table
									:headers="headers"
									:items="items"
									item-key="name"
									:items-per-page="15"
									loading="loading"
								>
								</v-data-table>
							</material-card>
						</v-col>
					</v-row>
				</v-container>
			</v-content>
  	</v-app>
  </div>
</template>

<script>
	let socket;
	var connectUrl = 'ws://127.0.0.1:8081';
	//"ws://49.233.152.15:8081"
  export default {
    data: () => ({
      headers: [
				{ text: '序号', value: 'id' },
        {
          sortable: false,
          text: '姓名',
					value: 'name',
        },
        {
          sortable: false,
          text: '时间',
					value: 'time',
        }
      ],
			items: [],
			lockReconnect: false
    }),

    methods: {
			getText: function(){
				var myDate = new Date();     //获取当前年份(2位)
        var month=myDate.getMonth();       //获取当前月份(0-11,0代表1月)
        var day=myDate.getDate();        //获取当前日(1-31)
        var dayNow=(month+1)+"月"+day+"日";
        return '云杰诊所' + dayNow;
			},

      // 获取系统中所有病人
      getAll: function() {
        this.$http.get('/api/getAllPatientNotFinished',{
          params: {
						dbs : 'qcui_registerPatient',
						isFinished : 0,
					}
        }).then( (res) => {
          this.items = res.data;
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
						this.getAll();
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
    },

    mounted: function() {
			this.getAll();
			this.createWebSocket();
		}

    
  }
</script>
