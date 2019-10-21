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
                处方
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
            v-model="selected"
            show-select
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
      selected: [],
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
      }
    }

    
  }
</script>
