<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card flat full-width color="green">
          <template v-slot:header>
            <div class="px-3">
              <div class="title font-weight-light mb-2">
                <v-radio-group v-model="medRadio" :mandatory="false" row>
                  <v-radio label="免煎药" value="免煎药" color="grey darken-1"></v-radio>
                  <v-radio label="草药" value="草药" color="grey darken-1"></v-radio>
                  <v-radio label="西药" value="西药" color="grey darken-1"></v-radio>
                </v-radio-group>
              </div>
            </div>

            <v-spacer />   

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
              @click.stop="adddialog = true"
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
          </template>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="name"
            :items-per-page="5"
            :search="searchStr"
            :custom-filter="filterOnlyCapsText"            
          >
          <template v-slot:top>
            <v-text-field v-model="searchStr" label="搜索..." class="mx-4"></v-text-field>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-close
            </v-icon>
          </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-btn block color="green" dark class="mr-2" @click="backTop">回到顶部</v-btn>
          </div>
          <v-dialog v-model="adddialog" persistent max-width="600px">
            <v-card>
              <v-card-title>
                <span class="headline">User Profile</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field label="Legal first name*" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Legal last name*"
                        hint="example of persistent helper text"
                        persistent-hint
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="Email*" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="Password*" type="password" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        :items="['0-17', '18-29', '30-54', '54+']"
                        label="Age*"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                        label="Interests"
                        multiple
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="adddialog = false">Close</v-btn>
                <v-btn color="blue darken-1" text @click="adddialog = false">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
      medRadio: '免煎药',
      transition: 'slide-y-reverse-transition',
      adddialog: false,
      headers: [
        {
          sortable: false,
          text: '药品名称',
          value: 'name'
        },
        {
          sortable: false,
          text: '别名',
          value: 'alias'
        },
        {
          sortable: false,
          text: '规格',
          value: 'spec'
        },
        {
          sortable: false,
          text: '袋/盒',
          value: 'bagperbox',
        },
        {
          sortable: true,
          text: '数量',
          value: 'count',
        },
        {
          sortable: false,
          text: '进价',
          value: 'baseprice',
        },
        {
          sortable: false,
          text: '零售价',
          value: 'sellprice',
        },
        {
          sortable: false,
          text: '监测',
          value: 'checked',
        },
        {
          sortable: false,
          text: '操作',
          value: 'action',
        },
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

      backTop() {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      },
    }

    
  }
</script>
