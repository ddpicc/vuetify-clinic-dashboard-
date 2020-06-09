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
			<v-btn @click.stop="selectPatient(item.id)" text color="green">选择</v-btn>
            <v-btn @click.stop="finishPatient(item.id)" text color="green">完成</v-btn>
          </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-btn block color="green" dark class="mr-2" @click="displayAll">显示全部</v-btn>
          </div>
        </material-card>
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
      items: []
    }),

    methods: {

      // 获取系统中所有病人
      getAll: function() {
        this.$http.get('/api/getAllPatient',{
          params: {
            dbs : this.$store.state.user.dbs_prefix+'registerPatient',
					}
        }).then( (res) => {
          this.items = res.data;
        })
			},
			
			displayAll: function() {

			},
			
			jumpDetail: function(id){
        this.$router.push({name: 'Patient Profile', params: {pt_id: id}});
      },
      
      finishPatient: function(id){
        this.$http.post('/api/setPatientFinished',{
          params: {
						dbs : this.$store.state.user.dbs_prefix+'registerPatient',
						isFinished : 1,
						patient_id : id
					}
        }).then( (res) => {
					this.getAll();
					this.onSubmit();
        })
			},

			selectPatient: function(id){
				this.onSubmit();
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
				socket.send("Hello!");
			}
    },

    mounted: function() {
			this.getAll();
			this.createWebSocket();
		}

    
  }
</script>
