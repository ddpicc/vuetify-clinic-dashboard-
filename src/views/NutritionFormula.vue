<template>
  <div id="app">
  	<v-app light>
			<v-content>
				<v-container
					class="fill-height"
					fluid
				>
          <v-row justify="center">
            <v-col cols="12">
              <material-card 
                flat
                color="#4CAF50"
                title="临床能量消耗计算"
              >
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                >
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="height"
                        :rules="nameRules"
                        clearable
                        label="身高"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="weight"
                        clearable
                        :rules="nameRules"
                        label="体重"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="age"
                        clearable
                        :rules="nameRules"
                        label="年龄"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <v-radio-group
                        v-model="sex"
                        row
                        @change="reCalculate()"
                      >
                        <v-radio
                          label="男"
                          value="male"
                        ></v-radio>
                        <v-radio
                          label="女"
                          value="female"
                        ></v-radio>
                      </v-radio-group>
                      <v-radio-group
                        v-model="formula"
                        row
                        @change="reCalculate()"
                      >
                        <v-radio
                          label="Harris-Beredict公式"
                          value="formulaH"
                        ></v-radio>
                        <v-radio
                          label="Mifflin-St Jeor公式"
                          value="formulaM"
                        ></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                  <v-row class="mt-5">
                    <v-icon
                      size="50"
                      class="ml-2"
                      color="#4CAF50"
                    >
                    fa-exclamation
                    </v-icon>
                    <div class="title ml-5">
                      {{ result }}
                    </div>
                  </v-row>
                </v-form>
              </material-card>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
  export default {
    data: () => ({
      valid: true,
      height: '',
      weight: '',
      age: '',
      nameRules: [
        v => !!v || 'Required',
      ],
      sex: 'male',
      formula: 'formulaH',
      result: '请输入信息',
    }),

    methods: {
      reCalculate: function(){
        console.log('change')
        if(this.$refs.form.validate()){
          if(this.formula == 'formulaH'){
            if(this.sex == 'male'){
              this.result = (66.473 + 13.7516 * this.weight + 5.003 * this.height - 6.755 * this.age).toFixed(2)
            }else{
              this.result = (655.0955 + 9.5634 * this.weight + 1.8496 * this.height - 4.6756 * this.age).toFixed(2)
            }
          }else if(this.formula == 'formulaM'){
            if(this.sex == 'male'){
              this.result = (9.99 * this.weight + 6.25 * this.height - 4.92 * this.age + 5).toFixed(2)
            }else{
              this.result = (9.99 * this.weight + 6.25 * this.height - 4.92 * this.age - 161).toFixed(2)
            }
          }
        }
      }
    },

    mounted: function() {

		},
    watch:{
      height: function(val) {
        if(val != '' && this.$refs.form.validate()){
          this.reCalculate()
        }
      },
      weight: function(val) {
        if(val != '' && this.$refs.form.validate()){
          this.reCalculate()
        }
      },
      age: function(val) {
        if(val != '' && this.$refs.form.validate()){
          this.reCalculate()
        }
      },
    }

    
  }
</script>
