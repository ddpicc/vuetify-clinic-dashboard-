<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card 
          flat
					color="green"
          title="详细统计"
        >
          <v-row>
            <v-col cols="12" sm="12" lg="4" md="4">
              <v-date-picker v-model="dates" range color="green"></v-date-picker>
            </v-col>
            <v-col cols="12" sm="12" lg="8" md="8">
              <v-text-field v-model="dateRangeText" label="时间范围" readonly append-icon="mdi-check-bold" color="blue darken-2" @click:append="dateConfirmed"></v-text-field>
              model: {{ dates }}
            </v-col>
          </v-row>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      dates: ['2019-09-10', '2019-09-20']
    }),

    methods: {
      dateConfirmed: function() {
        alert("hahaha");
      }
    },

    mounted: function() {
			this.getAll();
    },
    
    computed: {
      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },

    
  }
</script>
