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
							title="Edit Profile"
							text="Complete your profile"
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
											<v-btn color="blue" @click.stop="onSubmit">
												提交
											</v-btn>
										</v-col>
									</v-row>
								</v-container>
							</v-form>
							<v-snackbar
								v-model="snackbar"
								:color="snackbarColor"
								:timeout="3000"
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
  export default {
    data () {
      return {
				patientName: '',
      	patientAge: '',
      	sexItems: ['男', '女'],
      	patientSex: '',
				patientPhone: '',
				snackbar: false,
      	snackbarColor: '',
      	notification: '',
      }
    },

    methods: {
			jumpHome: function(){
        this.$router.push({ path: '/' });
			},

			onSubmit: function(){				
        if(this.patientName == ''){
          alert('姓名不能为空');
          return;
        }

				this.$http.post('/api/registerPatient',{
					dbs : 'qcui_registerPatient',
					name : this.patientName,
					sex : this.patientSex,
					age : !this.patientAge? 0 : parseFloat(this.patientAge),
					phone : !this.patientPhone? 0 : parseInt(this.patientPhone),
					date : getNowFormatDate(),
					time : getTime()
				}).then( (res) => {
					this.snackbar = true;
          this.notification = '排号成功';
					this.snackbarColor = 'green';
					
					//clear
					this.patientName = '';
        	this.patientSex = '';
        	this.patientAge = '';
        	this.patientPhone = '';
				}).catch( (err) =>{
          alert(err);
        })
			}
    },

    mounted: function() {
      
      
		}
  }
</script>