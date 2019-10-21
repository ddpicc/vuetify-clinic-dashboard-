<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12" >
        <material-card flat full-width :color=cardColor>
          <template v-slot:header>
            <v-row 
              justify="center"
              align="center"
            >
              <v-col 
              sm="4" md="4"             
              justify="center"
              align="center"
              >
                <div class="px-3">
                  <div class="title font-weight-light mb-2">
                    <v-radio-group v-model="medRadio" :mandatory="false" row @change="radioChanged">
                      <v-radio label="免煎" value="免煎" color="grey darken-1"></v-radio>
                      <v-radio label="草药" value="草药" color="grey darken-1"></v-radio>
                      <v-radio label="西药" value="西药" color="grey darken-1"></v-radio>
                    </v-radio-group>
                  </div>
                </div>
              </v-col>
              <v-col cols="1"></v-col>
              <v-divider
                class="mx-2"
                vertical
              ></v-divider>
              <v-col>
                <v-container>
                  <v-row 
                  justify="left"
                  align="left"
                  dense
                  >
                    <v-col sm="3" md="3">
                      <v-text-field
                        label="姓名"
                      ></v-text-field>
                    </v-col>
                    <v-col sm="3" md="3">
                      <v-select
                        :items="sexItems"
                        label="性别"
                      ></v-select>
                    </v-col>
                    <v-col sm="3" md="3">
                      <v-text-field
                        label="年龄"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="1.5"></v-col>
                    <v-col sm="1.5" md="1.5"
                    align="right">
                      <v-speed-dial
                          v-model="fab"
                          bottom
                          right
                          small
                          :direction="direction"
                          open-on-hover
                          :transition="transition"
                        >
                        <template v-slot:activator>
                          <v-btn
                            v-model="fab"
                            color="amber"
                            dark
                            fab
                          >
                            <v-icon v-if="fab">mdi-close</v-icon>
                            <v-icon v-else>mdi-account-circle</v-icon>
                          </v-btn>
                        </template>
                        <v-btn
                          fab
                          dark
                          small
                          color="green"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          fab
                          dark
                          small
                          color="indigo"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                        <v-btn
                          fab
                          dark
                          small
                          color="red"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-speed-dial>
                    </v-col>
                  </v-row>
                  <v-row 
                  justify="left"
                  align="left"
                  dense
                  >
                    <v-col sm="9" md="9">
                      <v-text-field
                        label="症状"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          
            
          </template>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="name"
            :search="searchStr"
            :custom-filter="filterOnlyCapsText"
            hide-default-footer
          >
          <template v-slot:top>
            <v-row 
            justify="left"
            align="left"
            dense
            >
              <v-col sm="6" md="6">
                <v-autocomplete
                  label="Components"
                  :items="components"
                  :filter="customFilter"
                  dense
                  clearable
                  ref="mark1"
                  @keyup.enter.native="moveFocusToDose"
                  @update:search-input="test"
                >
                </v-autocomplete>
              </v-col>
              <v-col v-if="!howToUseOn" sm="6" md="6">
                <v-text-field
                  label="剂量"
                  dense
                  ref="mark2"
                ></v-text-field>
              </v-col>
              <v-col v-if="howToUseOn" sm="3" md="3">
                <v-text-field
                  label="剂量"
                  dense
                  ref="mark2"
                ></v-text-field>
              </v-col>
              <v-col v-if="howToUseOn" sm="3" md="3">
                <v-select
                  v-if="howToUseOn"
                  :items="hotToUse"
                  dense
                  clearable
                  label="用法用量"
                ></v-select>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.name="props">
        <v-edit-dialog
          :return-value.sync="props.item.name"
        > {{ props.item.name }}
          <template v-slot:input>
            <v-autocomplete
              label="Components"
              :items="components"
              dense
              clearable
            ></v-autocomplete>
          </template>
        </v-edit-dialog>
      </template>
          </v-data-table>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      direction: 'bottom',
      fab: false,
      searchStr: '',
      transition: 'slide-y-reverse-transition',
      sexItems: ['男', '女'],
      howToUseOn: false,
      hotToUse: ['一天一次', '一天三次'],
      medRadio: '免煎',
      cardColor: 'green',
      componentsAfter: [
          'Autocompletes', 'Comboboxes', 'Forms', 'Inputs', 'Overflow Buttons', 'Selects', 'Selection Controls', 'Sliders', 'Textareas', 'Text Fields',
      ],
      components: [],
      headers: [
        {
          sortable: false,
          text: 'Name',
          value: 'name'
        },
        {
          sortable: false,
          text: 'Country',
          value: 'country'
        },
        {
          sortable: false,
          text: 'City',
          value: 'city'
        },
        {
          sortable: false,
          text: 'Salary',
          value: 'salary',
          align: 'right'
        }
      ],
      items: [
        {
          name: 'Dakota Rice',
          country: 'Niger',
          city: 'Oud-Tunrhout',
          salary: '$35,738'
        },
        {
          name: 'Minerva Hooper',
          country: 'Curaçao',
          city: 'Sinaai-Waas',
          salary: '$23,738'
        }, {
          name: 'Sage Rodriguez',
          country: 'Netherlands',
          city: 'Overland Park',
          salary: '$56,142'
        }, {
          name: 'Philip Chanley',
          country: 'Korea, South',
          city: 'Gloucester',
          salary: '$38,735'
        }, {
          name: 'Doris Greene',
          country: 'Malawi',
          city: 'Feldkirchen in Kārnten',
          salary: '$63,542'
        }, {
          name: 'Mason Porter',
          country: 'Chile',
          city: 'Gloucester',
          salary: '$78,615'
        },{
          name: 'Minerva Hooper',
          country: 'Curaçao',
          city: 'Sinaai-Waas',
          salary: '$23,738'
        }, {
          name: 'Sage Rodriguez',
          country: 'Netherlands',
          city: 'Overland Park',
          salary: '$56,142'
        }, {
          name: 'Philip Chanley',
          country: 'Korea, South',
          city: 'Gloucester',
          salary: '$38,735'
        }
      ]
    }),

    methods: {
      filterOnlyCapsText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search) !== -1
      },

      moveFocusToDose: function(){
        this.$refs.mark2.$el.querySelector('input').focus();
      },

      test: function(queryText){
        //this.components = this.componentsAfter;
        if(queryText.length >= 2){
          this.components = this.componentsAfter;
        }else{
          this.components = [];
        }        
      },

      radioChanged: function(){
        if(this.medRadio == "西药"){
          this.howToUseOn = true;
          this.cardColor = 'blue lighten-2';
				}else{
          this.howToUseOn = false;
          this.cardColor = 'green';
				}					
      },

      customFilter (item, queryText, itemText) {
        const textOne = item.toLowerCase();
        return textOne.indexOf(queryText) > -1;
      },
    }

    
  }
</script>
