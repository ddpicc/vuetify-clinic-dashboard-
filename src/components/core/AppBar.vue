<template>
  <v-app-bar
    id="core-app-bar"
    absolute
    app
    color="transparent"
    flat
    height="88"
  >
    <v-toolbar-title class="secondary--text font-weight-light align-self-center">
      <v-btn
        icon
        @click.stop="onClick"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      {{ title }}
    </v-toolbar-title>

    <v-spacer />

    <v-toolbar-items>
      <v-row
        align="center"
        class="mx-0"
      >

        <v-btn
          icon
          to="/settings"
          title="设置"
        >
          <v-icon color="secondary">
            mdi-cog
          </v-icon>
        </v-btn>

        <v-btn
          title="退出登录"
          @click="logout"
          icon
        >
          <v-icon color="secondary">
            mdi-logout
          </v-icon>
        </v-btn>
      </v-row>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
  // Utilities
  import {
    mapMutations
  } from 'vuex'

  export default {
    data: () => ({
      title: null,
      responsive: false
    }),

    watch: {
      '$route' (val) {
        this.title = val.name
      }
    },

    mounted () {
      this.onResponsiveInverted()
      window.addEventListener('resize', this.onResponsiveInverted)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.onResponsiveInverted)
    },

    methods: {
      ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
      onClick () {
        this.setDrawer(!this.$store.state.app.drawer)
      },
      onResponsiveInverted () {
        if (window.innerWidth < 991) {
          this.responsive = true
        } else {
          this.responsive = false
        }
      },

      logout: function(e){
        e.preventDefault();
        this.$store.dispatch('user/FedLogOut').then(() => {
          this.$router.push({ path: '/login' });
        }).catch(err => {
          this.$message.error(err);
        });
      }
    },
  }
</script>

<style>
  /* Fix coming in v2.0.8 */
  #core-app-bar {
    width: auto;
  }

  #core-app-bar a {
    text-decoration: none;
  }
</style>
