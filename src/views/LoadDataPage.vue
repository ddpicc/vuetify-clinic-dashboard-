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
          max-height="70%"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        ></v-img>
      </v-avatar>    

      <v-toolbar-title class="font-weight-black headline">
        半夏
      </v-toolbar-title>
    	</v-app-bar>

			<v-content>
				<v-container
					class="fill-height"
					fluid
				>
					<v-row
						align="center"
						justify="center"
					>
						<v-col
							cols="12"
							sm="8"
							md="4"
						>
							<v-card class="elevation-12">
								<v-stepper v-model="e6" vertical>
								<v-stepper-step :complete="e6 > 1" step="1" :color="completeColor()">读取用户数据到本地</v-stepper-step>

								<v-stepper-step :complete="e6 > 2" step="2" :color="completeColor()">读取用户配置</v-stepper-step>

								<v-stepper-step :complete="e6 > 3" step="3" :color="completeColor()">配置界面</v-stepper-step>

								</v-stepper>
							</v-card>
						</v-col>
					</v-row>
				</v-container>
			</v-content>
  	</v-app>
	</div>
</template>

<script>
  import { dateToString, stringToDate, getNowFormatDate} from '../utils/handleDate';
  import { saveToLocal, loadFromLocal} from '../utils/handleLocalStorage';
  export default {
    data () {
      return {
				e6: 1,
      }
		},
		
		methods: {
      loadingData: function() {
        setTimeout( () => {this.e6 = 2;},1200);
				setTimeout( () => {this.e6 = 3;},2400);
        setTimeout( () => {this.$router.push({ path: '/dashboard' });},7600);
			},

			//todo
			loadData: function(){
        var end = dateToString(new Date(new Date().setDate(new Date().getDate()-1)));
        var start = dateToString(new Date(new Date().setDate(new Date().getDate()-90)));
        this.$http.get('/api/getOrdBetweenDates', {
          params: {
						dbs_a : this.$store.state.user.dbs_prefix+'ordlist',
						dbs_b : this.$store.state.user.dbs_prefix+'patient',
            startDate: start,
            endDate: end
          }
        }).then(response => {
          this.$nextTick( () => {
            saveToLocal(1,'cacheOrder',response.data);
          })
        })
      },
			
			completeColor: function() {
				if(this.e6 > 1)
					return 'blue';
			}
    },

    mounted: function() {
      this.loadData();
			this.loadingData();
		}
  }
</script>