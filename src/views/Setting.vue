<template>
  <v-container
    fluid
    fill-height
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col cols="12">
        <material-card 
        color="green"
        :title=clinicName
        >
          <v-list
            subheader
            two-line
          >
            <v-subheader>用户</v-subheader>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>名称 <v-icon small @click.stop="canEdit = !canEdit">mdi-pencil</v-icon> </v-list-item-title>                
              </v-list-item-content>
              <v-list-item-action>
                <v-text-field
                  v-model="clinicName"
                  :readonly="canEdit"
                  clearable
                ></v-text-field>
              </v-list-item-action>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>密码 <v-icon small @click.stop="canEditPass = !canEditPass">mdi-pencil</v-icon> </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-text-field
                  v-model="password"
                  :readonly="canEditPass"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show ? 'text' : 'password'"
                  hint="At least 8 characters"
                  counter
                  @click:append="show = !show"
                ></v-text-field>
              </v-list-item-action>
            </v-list-item>

            <v-list-item>
              
              <v-list-item-content>
                    <v-list-item-title>Notifications</v-list-item-title>
                    
                  </v-list-item-content>
              <v-list-item-action>
                <v-file-input
                  :rules="[rules.fileSize]"
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="上传logo"
                  prepend-icon="mdi-camera"
                  full-width
                ></v-file-input>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list
            flat
            subheader
            three-line
          >
            <v-subheader>General</v-subheader>

            <v-list-item-group
              v-model="settings"
              multiple
              active-class=""
            >
              <v-list-item>
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox v-model="active"></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title>Notifications</v-list-item-title>
                    <v-list-item-subtitle>Notify me about updates to apps or games that I downloaded</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>

              <v-list-item>
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox v-model="active"></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title>Sound</v-list-item-title>
                    <v-list-item-subtitle>Auto-update apps at any time. Data charges may apply</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>

              <v-list-item>
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox v-model="active"></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title>Auto-add widgets</v-list-item-title>
                    <v-list-item-subtitle>Automatically add home screen widgets when downloads complete</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        settings: [],
        canEdit: true,
        canEditPass: true,
        show: false,
        clinicName: "云杰诊所",
        password: 'Password',
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
          emailMatch: () => ('The email and password you entered don\'t match'),
          fileSize: value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
        },
      }
    },

    methods: {
      kk(){
        alert("fsd");
      }
    }
  }
</script>