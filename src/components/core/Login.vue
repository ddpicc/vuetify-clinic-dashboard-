<template>
  <v-app id="inspire">
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
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>登录</v-toolbar-title>
                <v-spacer />

              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Login"
                    name="login"
                    type="text"
                    v-model="loginName"
                  />

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    v-model="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue" @click.stop="loginClick">登录</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
      data () {
        return {
          loginName: '',
          password: ''
        }
      },

      methods: {
        loginClick: function(){
          if (this.loginName === '' || this.password === '') {
        alert('账号或密码不能为空');
      } else {
        var userInfo = {username: this.loginName, password: this.password};
        this.$store.dispatch('user/LoginByEmail', userInfo).then(() => {
                this.$router.push({ path: '/dashboard' });
              }).catch(err => {
              });
            } 
/*         this.$http.get('/api/getTokenFromLogin',{
          params: {
            username : this.loginName,
            password : this.password,
					}
        }).then(res => {
          console.log(res.data);
          if(res.data.length === 0){
            alert('用户名密码错误');
          }else{
            this.$router.push({ path: '/dashboard' });
          }

          //_this.userToken = 'Bearer ' + res.data.data.body.token;
          // 将用户token保存到vuex中
          //_this.changeLogin({ Authorization: _this.userToken });
          
        }).catch(error => {
          alert('错误，请重试');
          console.log(error);
        }); */
          
      }
    }
  }
</script>