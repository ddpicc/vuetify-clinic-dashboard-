<template>
  <v-container
    fluid
    fill-height
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col cols="12">
        <material-card 
        color="green"
        :title=clinicName
        >
          <v-list
            subheader
            two-line
          >
            <v-subheader>用户</v-subheader>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>更改名称 <v-icon small @click.stop="canEdit = !canEdit">fa-pencil</v-icon> </v-list-item-title>                
              </v-list-item-content>
              <v-list-item-action>
                <v-text-field
                  v-model="clinicName"
                  :readonly="canEdit"
                  clearable
                ></v-text-field>
              </v-list-item-action>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>更改密码<v-icon small @click.stop="canEditPass = !canEditPass">fa-pencil</v-icon> </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-text-field
                  v-model="password"
                  :readonly="canEditPass"
                  :append-icon="show ? 'fa-eye' : 'fa-eye-slashf'"
                  :rules="[rules.required, rules.min]"
                  :type="show ? 'text' : 'password'"
                  hint="At least 8 characters"
                  counter
                  @click:append="show = !show"
                ></v-text-field>
              </v-list-item-action>
            </v-list-item>

            <v-list-item>              
              <v-list-item-content>
                <v-list-item-title>更改图标</v-list-item-title>                    
              </v-list-item-content>
              <v-list-item-action>
                <v-file-input
                  :rules="[rules.fileSize]"
                  dense
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="上传logo"
                  prepend-icon="fa-camera"
                  full-width
                ></v-file-input>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list
            flat
            subheader
            three-line
          >
            <v-subheader>General</v-subheader>

            <v-list-item-group
              v-model="settings"
              multiple
              active-class=""
            >
              <v-list-item>
                <template v-slot:default="{  }">
                  <v-list-item-action>
                    <v-checkbox v-model="displayYaowan"></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title>显示药丸</v-list-item-title>
                    <v-list-item-subtitle>在生成处方页面是否显示药丸</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>

              <v-list-item>
                <template v-slot:default="{  }">
                  <v-list-item-action>
                    <v-checkbox v-model="displayProfit"></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title>显示利润</v-list-item-title>
                    <v-list-item-subtitle>是否在首页和详情页显示利润</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>

              <v-list-item>
                <template v-slot:default="{  }">
                  <v-list-item-action>
                    <v-checkbox v-model="displayTime"></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title>显示时间</v-list-item-title>
                    <v-list-item-subtitle>是否在订单页显示具体时间</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>

              <v-list-item>
                <template v-slot:default="{  }">
                  <v-list-item-action>
                    <v-checkbox v-model="displayLessMenu"></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title>隐藏菜单</v-list-item-title>
                    <v-list-item-subtitle>是否隐藏除了处方管理和生成处方之外的其他菜单项</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>
              
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>默认医师  </v-list-item-title>                
                </v-list-item-content>
                <v-list-item-action>
                  <v-select
                    dense
                    v-model="doctor"
                    :items="doctorList"
                  ></v-select>
                </v-list-item-action>
              </v-list-item>

            </v-list-item-group>
          </v-list>
          <v-btn color="blue" @click="submit">
              保存
          </v-btn>
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
              fa-bell
            </v-icon>
            {{notification}}
            <v-btn
              icon
              @click="snackbar = false"
            >
              <v-icon>
                fa-close
              </v-icon>
            </v-btn>
          </v-snackbar>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { saveToLocal, loadFromLocal} from '../utils/handleLocalStorage';
  export default {
    inject: ['reload'],
    data () {
      return {
        settings: [],
        canEdit: true,
        canEditPass: true,
        snackbar: false,
        snackbarColor: '',
        notification: '',
        show: false,
        displayYaowan: true,
        displayProfit: true,
        displayTime: true,
        displayLessMenu: true,
        clinicName: "云杰诊所",
        password: 'Password',
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
          emailMatch: () => ('The email and password you entered don\'t match'),
          fileSize: value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
        },
        doctor: '崔云杰',
        doctorList: ['崔云杰','谢双阳'],
      }
    },


    methods: {
      submit: function() {
        this.$http.post('/api/updateUserSetting',{   
          displayYaowan: this.displayYaowan? 1:0,
          displayProfit: this.displayProfit? 1:0,
          displayLessMenu: this.displayLessMenu? 1:0,
          defaultDoctor: this.doctor,
          userid: this.$store.state.user.user_id           
        }).then( (res) => {
          let userSetting = loadFromLocal(this.$store.state.user.user_id,'userSetting', []);
          userSetting[0]['displayYaowan'] = this.displayYaowan? 1:0;
          userSetting[0]['displayProfit'] = this.displayProfit? 1:0;
          userSetting[0]['displayLessMenu'] = this.displayLessMenu? 1:0;
          userSetting[0]['defaultDoctor'] = this.doctor;
          saveToLocal(this.$store.state.user.user_id,'userSetting',userSetting);
          this.snackbar = true;
          this.notification = '修改成功';
          this.snackbarColor = 'green';
          this.getSetting();
          this.reload();
        })
      },

      getSetting: function() {
        this.$http.get('/api/getUserSetting', {
          params: {
						userid : this.$store.state.user.user_id
          }
        }).then(res => {
          this.displayYaowan = res.data[0].displayYaowan;
          this.displayProfit = res.data[0].displayProfit;
          this.displayLessMenu = res.data[0].displayLessMenu;
          this.doctor = res.data[0].defaultDoctor;
        })
      }
    },

    mounted: function() {
			this.getSetting();
		}
  }
</script>