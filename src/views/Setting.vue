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
        color="primary"
        :title=clinicName
        >
          <v-list
            subheader
            two-line
          >
            <v-subheader>用户</v-subheader>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>更改名称 <v-icon small @click.stop="canEdit = !canEdit">mdi-pencil</v-icon> </v-list-item-title>                
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
                <v-list-item-title>更改密码<v-icon small @click.stop="canEditPass = !canEditPass">mdi-pencil</v-icon> </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-text-field
                  v-model="password"
                  :readonly="canEditPass"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show ? 'text' : 'password'"
                  hint="至少 8 个字符"
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
                  prepend-icon="mdi-camera"
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
            <v-subheader>常规设置</v-subheader>

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
          <v-btn color="primary" @click="submit">
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
              mdi-bell
            </v-icon>
            {{notification}}
            <v-btn
              icon
              @click="snackbar = false"
            >
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-snackbar>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
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
        password: '',
        rules: {
          required: value => !!value || '必填',
          min: v => v.length >= 8 || '至少 8 个字符',
          emailMatch: () => ('两次输入的密码不一致'),
          fileSize: value => !value || value.size < 2000000 || '图片不能超过 2MB！',
        },
        doctor: '崔云杰',
        doctorList: ['崔云杰','田东霞'],
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
          this.$store.dispatch('userconfig/loadUserSetting');
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