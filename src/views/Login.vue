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
              <v-card-title class="text-left justify-left py-6">
                <v-img
                  contain
                  max-height="150"
                  src="../assets/logo1.png"
                  @click.stop="jumpHome"
                ></v-img>
              </v-card-title>
              <v-tabs
                v-model="tab"
                fixed-tabs
                color="indigo"
              >
                <v-tab>
                  登录
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <v-card-text>
                    <v-form>
                      <v-text-field
                        label="用户名"
                        type="text"
                        v-model="loginName"
                      />
                      <v-text-field
                        id="password"
                        label="密码"
                        type="password"
                        v-model="password"
                        @keyup.enter.native="loginClick"
                      />
                      <v-card-actions>
                        <v-spacer />
                        <v-btn color="blue" @click.stop="loginClick">登录</v-btn>
                      </v-card-actions>
                    </v-form>
                  </v-card-text>
                </v-tab-item>
                  <v-tab-item>
                  <v-card-text>
                    <v-form>
                      <v-text-field
                        label="用户名"
                        type="text"
                        v-model="loginName"
                      />
                      <v-text-field
                        label="手机号"
                        type="text"
                        v-model="phoneNumber"
                      />
                      <v-text-field
                        id="password"
                        label="密码"
                        type="password"
                        v-model="password"
                      />
                      <v-card-actions>
                        <v-spacer />
                        <v-btn color="blue" @click="registerClick">注册</v-btn>
                      </v-card-actions>
                    </v-form>
                  </v-card-text>
                </v-tab-item>
              </v-tabs-items>              
            </v-card>
          </v-col>
        </v-row>
        <v-snackbar
          v-model="snackbar"
          :color="snackbarColor"
          :timeout="snackbarTimeout"
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
      </v-container>
    </v-content>
  </v-app>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loginName: '',
        password: '',
        phoneNumber: '',
        tab: null,
        loginBtnName: "登录",
        snackbar: false,
        snackbarColor: '',
        notification: '',
        snackbarTimeout: 3000
      }
    },

    methods: {
      loginClick: function(){
        if (this.loginName === '' || this.password === '') {
          alert('账号或密码不能为空');
        } else {
          var userInfo = {username: this.loginName, password: this.password};
          this.$store.dispatch('user/LoginByEmail', userInfo).then(() => {
            this.snackbar = true;
            this.notification = '登录成功';
            this.snackbarColor = 'green';
            
            this.$router.push({ path: '/loading' });
          }).catch(err => {
            this.snackbar = true;
            this.notification = '连接错误，请重试';
            console.log(err);
          });
        }         
      },

      registerClick: function(){
        this.snackbar = true;
        this.notification = '注册功能暂不能用，请联系管理员分配账号。可用的使试用账号为test，密码test';
        this.snackbarTimeout = 5000;
      },

      jumpHome: function(){
        this.$router.push({ path: '/' });
      }
    },
    mounted: function() {
      this.$store.dispatch('user/FedLogOut')
		}
  }
</script>