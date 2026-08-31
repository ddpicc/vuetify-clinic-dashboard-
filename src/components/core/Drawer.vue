<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    dark
    floating
    mobile-break-point="991"
    persistent
    width="180"
  >
    <div class="drawer-background fill-height" />

    <v-list-item two-line class="drawer-content">
      <v-list-item-avatar color="white">
        <v-img
          :src="require('@/assets/logo1.png')"
          height="34"
          contain
        />
      </v-list-item-avatar>
      <v-list-item-title class="title">
        {{name}}
      </v-list-item-title>
    </v-list-item>

    <v-divider class="mx-3 mb-3 drawer-content" />

    <v-list nav class="drawer-content">
      <!-- Bug in Vuetify for first child of v-list not receiving proper border-radius -->
      <div />

      <v-list-item
        v-for="(link, i) in links"
        :key="i"
        :to="link.to"
        active-class="white--text"
        class="drawer-item"
      >
        <v-list-item-action>
          <v-icon>{{ link.icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-title v-text="link.text" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  import {
    mapMutations
  } from 'vuex'

  var moreLinks = [
    /* {
      to: '/today-patient',
      icon: 'mdi-clipboard-outline',
      text: '今日病人'
    }, */
    {
      to: '/ord-list',
      icon: 'mdi-stethoscope',
      text: '接诊开方'
    },
    {
      to: '/yaogao',
      icon: 'mdi-mortar-pestle',
      text: '定制药膏'
    },
    {
      to: '/patient-list',
      icon: 'mdi-account',
      text: '病人管理'
    },
    {
      to: '/patient-merge',
      icon: 'mdi-account-switch',
      text: '患者合并'
    },
    {
      to: '/med-list',
      icon: 'mdi-medical-bag',
      text: '药品管理'
    },
    {
      to: '/detail-info',
      icon: 'mdi-file-document-outline',
      text: '详细账单'
    },
  ];

  var lessLinks = [
    {
      to: '/ord-list',
      icon: 'mdi-stethoscope',
      text: '接诊开方'
    },
    {
      to: '/yaogao',
      icon: 'mdi-mortar-pestle',
      text: '定制药膏'
    },
  ]
  export default {
    props: {
      opened: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      links: [],
      name: '',
    }),

    computed: {
      inputValue: {
        get () {
          return this.$store.state.app.drawer
        },
        set (val) {
          this.setDrawer(val)
        }
      }
    },

    methods: {
      ...mapMutations('app', ['setDrawer', 'toggleDrawer'])
    },

    mounted: function() {
      console.log('drawer init');
      if(this.$store.state.user.user_id == 1){
        this.name = '云杰诊所'
      }else if(this.$store.state.user.user_id == 2){
        this.name = 'yunjie'
      }
      let displayLessMenu = this.$store.getters['userconfig/displayLessMenu'];
      let childrenPath = this.$store.state.permission.addRouters[0].children;
      if(displayLessMenu){
        childrenPath.forEach(element => {
          var findLinks = lessLinks.find(function(p){
            return p.to === element.path;
          })
          if(typeof(findLinks) != 'undefined'){
            this.links.push(findLinks);
          }
        });
      }else{
        if(this.$store.state.user.role != 'admin'){
          childrenPath.forEach(element => {
            var findLinks = lessLinks.find(function(p){
              return p.to === element.path;
            })
            if(typeof(findLinks) != 'undefined'){
              this.links.push(findLinks);
            }
          });
        }else{
          childrenPath.forEach(element => {
            var findLinks = moreLinks.find(function(p){
              return p.to === element.path;
            })
            if(typeof(findLinks) != 'undefined'){
              this.links.push(findLinks);
            }
          });
        }
      }      
		}
  }
</script>
<style scoped>
  #app-drawer {
    background: linear-gradient(180deg, #1B5E20 0%, #263238 100%);
  }

  #app-drawer >>> .drawer-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  #app-drawer >>> .drawer-content {
    position: relative;
    z-index: 1;
  }

  .drawer-item.v-list-item--active {
    background: rgba(255, 255, 255, 0.12);
  }
</style>
