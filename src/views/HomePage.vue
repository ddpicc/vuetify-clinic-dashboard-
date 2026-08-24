<template>
<div id="app">
  <v-app>
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
        ></v-img>
      </v-avatar>
      <v-spacer />

      <v-toolbar-items>
        <v-row
          align="center"
          class="mx-0"
        >

          <v-btn
            text
            to="/login"
          >
            登录
          </v-btn>
        </v-row>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <section id="hero">
        <v-row no-gutters>
          <v-img
            :min-height="'calc(100vh - ' + $vuetify.application.top + 'px)'"
            src="https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1951&q=80"
          >
            <v-theme-provider dark>
              <v-container fill-height>
                <v-row
                  align="center"
                  class="white--text mx-auto"
                  justify="center"
                >
                  <v-col
                    class="white--text text-center"
                    cols="12"
                    tag="h1"
                  >
                    <span
                      class="font-weight-light"
                      :class="[$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-2']"
                    >
                      WELCOME TO
                    </span>

                    <br>

                    <span
                      :class="[$vuetify.breakpoint.smAndDown ? 'display-3': 'display-4']"
                      class="font-weight-black"
                    >
                      VUETIFY
                    </span>

                  </v-col>

                  <v-btn
                    class="align-self-end"
                    fab
                    outlined
                    @click="$vuetify.goTo('#about-me')"
                  >
                    <v-icon>mdi-chevron-double-down</v-icon>
                  </v-btn>
                </v-row>
              </v-container>
            </v-theme-provider>
          </v-img>
        </v-row>
      </section>

      <section id="about-me">
        <div class="py-12"></div>

        <v-container class="text-center">
          <h2 class="display-2 font-weight-bold mb-3">附近的诊所</h2>

          <v-responsive
            class="mx-auto mb-6"
            width="26"
          >
            <v-divider class="mb-1"></v-divider>

            <v-divider></v-divider>
          </v-responsive>
          <v-row dense>
            <v-col class="d-flex" sm="3" md="3">
              <v-select
              :items="districtItems"
              label="区"
              v-model="district"
              @change="handleDistrictChange"
              outlined
              dense
              ></v-select>
            </v-col>
            <v-col class="d-flex" sm="9" md="9">
              <v-select
              :items="clinicItems"
              label="诊所名称"
              v-model="clinicName"
              @change="handleClinicChange"
              outlined
              dense
              ></v-select>
            </v-col>
          </v-row>
          <baidu-map class="map" :center="center" :zoom="zoom" @ready="handler(112.578809,33.024595, 20)"  :scroll-wheel-zoom="true">
            <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
              <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
              <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
            </bm-marker>
          </baidu-map>
          <v-col cols="12">
            <v-btn x-large color="blue">查看更多信息</v-btn>
          </v-col>
        </v-container>

        <div class="py-12"></div>
      </section>

    </v-content>

    <v-footer
      class="justify-center"
      color="#292929"
      height="100"
    >
      <div class="title font-weight-light grey--text text--lighten-1 text-center">
        &copy; {{ (new Date()).getFullYear() }} — Made by Qian Cui
      </div>
    </v-footer>
  </v-app>
 </div>
</template>

<script>
  var wanchengItems = ['云杰诊所','惠济诊所'];
  var wolongItems = [];
  var mapLoc ={
                '云杰诊所':{'lng':112.578809,'lat':33.024595,'zoom':20},
                '惠济诊所':{'lng':112.585932,'lat':33.02125,'zoom':20}
              };
  export default {
    data () {
      return {
        center: {lng: 0, lat: 0},
        zoom: 20,
        districtItems: ['卧龙区','宛城区'],
        district: '宛城区',
        clinicItems: wanchengItems,
        clinicName: '云杰诊所',
      }
    },
    methods: {
      handler (_lng, _lat, _zoom) {
        this.center.lng = _lng;
        this.center.lat = _lat;
        this.zoom = _zoom;
      },

      handleDistrictChange: function(){
        if(this.district == '宛城区'){
          this.clinicItems = wanchengItems;
          this.clinicName = '';
        }else if(this.district == '卧龙区'){
          this.clinicItems = wolongItems;
          this.clinicName = '';
        }
      },

      handleClinicChange: function(){
        let _lng = mapLoc[this.clinicName]['lng'];
        let _lat = mapLoc[this.clinicName]['lat'];
        let _zoom = mapLoc[this.clinicName]['zoom'];
        this.handler(_lng, _lat, _zoom);
      }
    }
  }
</script>

<style>
.map {
  width: 100%;
  height: 400px;
}
</style>