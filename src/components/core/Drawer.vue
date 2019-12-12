<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    :src="image"
    app
    color="grey darken-2"
    dark
    floating
    mobile-break-point="991"
    persistent
    width="180"
  >
    <template v-slot:img="attrs">
      <v-img
        v-bind="attrs"
        gradient="to top, rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)"
      />
    </template>

    <v-list-item two-line>
      <v-list-item-avatar color="white">
        <v-img
          src="https://cdn.vuetifyjs.com/images/logos/v.png"
          height="34"
          contain
        />
      </v-list-item-avatar>
      <v-list-item-title class="title">
        云杰诊所
      </v-list-item-title>
    </v-list-item>

    <v-divider class="mx-3 mb-3" />

    <v-list nav>
      <!-- Bug in Vuetify for first child of v-list not receiving proper border-radius -->
      <div />

      <v-list-item
        v-for="(link, i) in links"
        :key="i"
        :to="link.to"
        active-class="primary white--text"
      >
        <v-list-item-action>
          <v-icon>{{ link.icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-title v-text="link.text" />
      </v-list-item>
    </v-list>

    <!--<template v-slot:append>
      <v-list nav>
        <v-list-item
          to="/upgrade"
        >
          <v-list-item-action>
            <v-icon>mdi-package-up</v-icon>
          </v-list-item-action>

          <v-list-item-title class="font-weight-light">
            Upgrade To PRO
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </template> -->
  </v-navigation-drawer>
</template>

<script>
// Utilities
  import {
    mapMutations,
    mapState
  } from 'vuex'

  export default {
    props: {
      opened: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      links: [
        {
          to: '/dashboard',
          icon: 'mdi-view-dashboard',
          text: 'Dashboard'
        },
        {
          to: '/med-list',
          icon: 'mdi-pill',
          text: '药品管理'
        },
        {
          to: '/ord-list',
          icon: 'mdi-clipboard-outline',
          text: '处方管理'
        },
        {
          to: '/create-ord',
          icon: 'mdi-format-font',
          text: '生成处方'
        },
        {
          to: '/patient-list',
          icon: 'mdi-human-male-female',
          text: '病人管理'
        },
        {
          to: '/detail-info',
          icon: 'mdi-human-male-female',
          text: '详细账单'
        }
      ]
    }),

    computed: {
      ...mapState('app', ['image', 'color']),
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
    }
  }
</script>
