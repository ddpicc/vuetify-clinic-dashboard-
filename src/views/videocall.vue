<template>
  <v-row align="center">
    <v-col cols="3">
      <div class="video-wrapper">
      <div id="local-video"></div>
      <div id="remote-video"></div>
    </div>
    </v-col>
    
    <v-col cols="9" >
        <material-card flat full-width :color=cardColor>
          <template v-slot:header>
            <v-row align="center">
              <v-col sm="4" md="4">
                <div class="px-3">
                  <div class="title font-weight-light mb-2">
                    <v-radio-group v-model="medRadio" :mandatory="false" row @change="radioChanged">
                      <v-radio label="草药" value="草药" color="grey darken-1"></v-radio>
                      <v-radio label="免煎" value="免煎" color="grey darken-1"></v-radio>
                      <v-radio label="西药" value="西药" color="grey darken-1"></v-radio>
                      <v-radio v-if="enableYaowan" label="药丸" value="药丸" color="grey darken-1"></v-radio>
                    </v-radio-group>
                  </div>
                </div>
              </v-col>
              <v-divider
                class="mx-2"
                vertical
              ></v-divider>
              <v-col>
                <v-container>
                  <v-row dense>
                    <v-col sm="4" md="4">
                      <v-text-field v-model="patientName" @blur="nameLostFoucs()"
                        label="姓名"
                      ></v-text-field>
                    </v-col>
                    <v-col sm="4" md="3">
                      <v-select v-model="patientSex"
                        :items="sexItems"
                        label="性别"
                      ></v-select>
                    </v-col>
                    <v-col sm="4" md="3">
                      <v-text-field v-model="patientAge"
                        label="年龄"
                      ></v-text-field>
                    </v-col>
                    <v-col sm="1.5" md="1.5"
                    align="right">
                      <v-btn
                        absolute
                        dark
                        fab
                        top
                        right
                        color="amber"
                        @click="postOrdToDbSure"
                      >
                        <v-icon>fa-plus</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row 
                  dense
                  >
                    <v-col sm="5" md="5">
                      <v-text-field v-model="patientPhone"
                        label="电话"
                      ></v-text-field>
                    </v-col>
                    <v-col sm="5" md="5">
                      <v-text-field v-model="patientSymptom"
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
            :custom-filter="filterText"
            hide-default-footer
          >
          <template v-slot:top>
            <v-row 
            dense
            >
              <v-col sm="6" md="6">
                <v-autocomplete
                  label="药品"
                  :items="components"
                  :filter="customFilter"
                  dense
                  clearable
                  ref="mark1"
                  @keyup.enter.native="moveFocusToDose"
                  @update:search-input="searchChanged"
                  item-text="medname"
                  item-value="medname"
                  v-model="inputMed"
                  @focus="focus($event)"
                >
                <template v-slot:item="data">
                  <template>
                    <v-list-item-content>
                      <v-list-item-title>{{data.item.medname}}&nbsp;&nbsp;&nbsp;&nbsp;{{data.item.alias}}</v-list-item-title>
                      <v-list-item-subtitle>
                        价钱：{{data.item.sellprice}}&nbsp;&nbsp;&nbsp;&nbsp;库存：{{data.item.inventoryNm}}&nbsp;&nbsp;&nbsp;&nbsp;规格：{{data.item.spec}}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </template>
                </v-autocomplete>
              </v-col>
              <v-col v-if="!howToUseOn" sm="6" md="6">
                <v-text-field
                  v-model="inputDose"
                  label="剂量"
                  dense
                  ref="mark2"
                  @keyup.enter.native="postToTb"
                  @focus="focus($event)"
                ></v-text-field>
              </v-col>
              <v-col v-if="howToUseOn" sm="3" md="3">
                <v-text-field
                  v-model="useage"
                  label="用法用量"
                  dense
                  ref="mark2"
                  @keyup.enter.native="afterUseage"
                  @focus="focus($event)"
                  @blur="useageLostFoucs"
                ></v-text-field>
              </v-col>
              <v-col v-if="howToUseOn" sm="3" md="3">
                <v-text-field
                  v-model="inputDose"
                  label="剂量"
                  dense
                  ref="mark3"
                  @keyup.enter.native="postToTb"
                  @focus="focus($event)"
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.count1="props">
            <v-edit-dialog
              :return-value.sync="props.item.count1"
              large
              persistent
              @save="save(props.item.count1, props.item.name1)"
              @cancel="cancel"
            >
              <div>{{ props.item.count1 }}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.count1"
                  :rules="[notzero]"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.count2="props">
            <v-edit-dialog
              :return-value.sync="props.item.count2"
              large
              persistent
              @save="save(props.item.count2, props.item.name2)"
              @cancel="cancel"
            >
              <div>{{ props.item.count2 }}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.count2"
                  :rules="[notzero]"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.count3="props">
            <v-edit-dialog
              :return-value.sync="props.item.count3"
              large
              persistent
              @save="save(props.item.count3, props.item.name3)"
              @cancel="cancel"
            >
              <div>{{ props.item.count3 }}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.count3"
                  :rules="[notzero]"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:item.count4="props">
            <v-edit-dialog
              :return-value.sync="props.item.count4"
              large
              persistent
              @save="save(props.item.count4, props.item.name4)"
              @cancel="cancel"
            >
              <div>{{ props.item.count4 }}</div>
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.count4"
                  :rules="[notzero]"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:body.append="{ headers }">
            <tr>
              <td :colspan="headers.length-2">
              </td>
              <td :colspan="2" align="right">
                每付价钱: {{perOrdTotal}}元
              </td>
            </tr>
          </template>
          <template v-slot:item.name1="{ item }">
            <v-chip v-if="item.name1" :color="getColor(item.count1)" outlined close @click:close="deleteMed(item.name1)">{{ item.name1 }}</v-chip>
          </template>
          <template v-slot:item.name2="{ item }">
            <v-chip v-if="item.name2" :color="getColor(item.count2)" close outlined @click:close="deleteMed(item.name2)">{{ item.name2 }}</v-chip>
          </template>
          <template v-slot:item.name3="{ item }">
            <v-chip v-if="item.name3" :color="getColor(item.count3)" close outlined @click:close="deleteMed(item.name3)">{{ item.name3 }}</v-chip>
          </template>
          <template v-slot:item.name4="{ item }">
            <v-chip v-if="item.name4" :color="getColor(item.count4)" close outlined @click:close="deleteMed(item.name4)">{{ item.name4 }}</v-chip>
          </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-row>
              <v-col sm="3" md="4"></v-col>
              <v-col sm="2" md="2">
                <v-select
                  dense
                  v-model="doctor"
                  :items="doctorList"
                ></v-select>
              </v-col>
              <v-col sm="4" md="3">
                <v-text-field dense v-model="orderComment"
                  label="处方备注" placeholder="备注"
                ></v-text-field>
              </v-col>
              <v-col sm="1" md="1">
                <v-text-field dense v-if="!isYaowan" v-model="orderCount"
                  label="几付" suffix="付" placeholder=" " @focus="focus($event)"
                ></v-text-field>
              </v-col>
              <v-col sm="2" md="2">
                <v-text-field @focus="focus($event)" dense suffix="元" v-model="total"
                label="总价" placeholder=" " append-icon="fa-check" @click:append="addMoney"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
          <v-dialog v-model="selectPatientDialog" scrollable max-width="800px">
            <v-card>
              <v-card-title>
                <span class="headline"></span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-data-table
                    :headers="findPatientHeader"
                    :items="cacheFindedPatient"
                    hide-default-footer
                  >
                    <template v-slot:item.action="{ item }">
                      <v-btn color="blue darken-1" text @click="choosePatient(item)">选择</v-btn>
                      <v-btn color="blue darken-1" text @click="jumpToPDetail(item.id)">详情</v-btn>
                    </template>
                  </v-data-table>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-model="selectUseageDialog" scrollable max-width="300px">
            <v-card>
              <v-card-title>
                <span class="headline"></span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-data-table
                    :headers="useageHeader"
                    :items="useageList"
                    hide-default-footer
                  >
                    <template v-slot:item.action="{ item }">
                      <v-btn color="blue darken-1" text @click="chooseUseage(item)">选择</v-btn>
                    </template>
                  </v-data-table>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-model="printOrderDialog" max-width="1000">
            <v-card>
              <div ref="print" class="smallHeight">
                <h4 style="text-align:center;">宛城云杰诊所</h4>
                <h4 style="text-align:center;">处&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;方</h4>
                <hr style="margin-top:5px;height:1px;border:none;border-top:1px solid #555555;" />
                  <v-simple-table v-if="medString != ''">
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <td :colspan="2"><p>姓名:{{patientName}} </p></td>
                        <td :colspan="1"><p>性别:{{patientSex}}</p></td>
                        <td :colspan="1"><p>年龄:{{patientAge}}</p></td>
                      </tr>
                      <tr>
                        <td :colspan="4" ><p>症状:{{patientSymptom}}</p></td>
                      </tr>
                      <tr>
                        <td :colspan="2" style="border-bottom:1px solid"><p>电话:{{patientPhone}}</p></td>
                        <td :colspan="2" style="border-bottom:1px solid"><p>备注:{{orderComment}}</p></td>
                      </tr>
                      <tr v-for="element in medString.split(';')" :key="element.name">
                        <td style="width:23%" v-if="!JSON.parse(element).medComment1">{{ JSON.parse(element).name1 }} {{ JSON.parse(element).count1 }}</td>
                        <td style="width:50%" v-if="JSON.parse(element).medComment1">{{ JSON.parse(element).name1 }} {{ JSON.parse(element).count1 }}</td>
                        <td style="width:30%" v-if="JSON.parse(element).medComment1">{{ JSON.parse(element).medComment1 }}</td>
                        <td style="width:10%" v-if="JSON.parse(element).medComment1"></td> 
                        <td style="width:10%" v-if="JSON.parse(element).medComment1"></td> 
                        <td style="width:23%">{{ JSON.parse(element).name2 }} {{ JSON.parse(element).count2 }}</td>
                        <td style="width:23%">{{ JSON.parse(element).name3 }} {{ JSON.parse(element).count3 }}</td>
                        <td style="width:31%">{{ JSON.parse(element).name4 }} {{ JSON.parse(element).count4 }}</td>
                      </tr>
                      <tr><td></td></tr>
                      <tr v-if="!isYaowan">
                        <td :colspan="3"></td>
                        <td :colspan="1"><p>{{orderCount}}付</p></td>
                      </tr>
                      <tr>
                        <td :colspan="3" style="border-bottom:1px solid"></td>
                        <td :colspan="1" style="border-bottom:1px solid"><p>价钱： {{total}}元</p></td>
                      </tr>
                      <tr>
                        <td :colspan="2"><p>处方医师：  {{doctor}}</p></td>
                        <td :colspan="2"><p>日期： {{todayDate}}</p></td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="printIt">打印</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </material-card>
      </v-col>
  </v-row>
</template>
<script src="ZegoExpressWebRTC-2.24.5.js"></script>
<script>
  import {ZegoExpressEngine} from 'zego-express-engine-webrtc'
  export default {
    methods: {
      init: function(){
        let appID = 324706078
        // 接入服务器地址 Server，String 类型，请从 ZEGO 控制台获取（获取方式请参考上文“前提条件”）
        let server = "wss://webliveroom324706078-api.imzego.com/ws"

        // 初始化实例
        const zg = new ZegoExpressEngine(appID, server, { scenario: 5 });
        zg.setDebugVerbose(false)
        // 房间状态更新回调
        // 此处在登录房间成功后，立即进行推流。在实现具体业务时，您可选择其他时机进行推流，只要保证当前房间连接状态是连接成功的即可。
        // 房间状态更新回调
        zg.on('roomStateChanged', async (roomID, reason, errorCode, extendedData) => {
            if (reason == 'LOGINED') {
                console.log("与房间连接成功，只有当房间状态是连接成功时，才能进行推流、拉流等操作。")
            }
        })

        zg.on('roomUserUpdate', (roomID, updateType, userList) => {
            // 其他用户进出房间的通知
        });

        zg.on('roomStreamUpdate', async (roomID, updateType, streamList, extendedData) => {
            // 房间内其他用户音视频流变化的通知
            if (updateType == 'ADD') {
                // 流新增，开始拉流
                // 此处演示拉取流新增的列表中第一条流的音视频
                const streamID = streamList[0].streamID;
                // streamList 中有对应流的 streamID
                const remoteStream = await zg.startPlayingStream(streamID);
                // 创建媒体流播放组件
                const remoteView = zg.createRemoteStreamView(remoteStream);
                remoteView.play("remote-video", {enableAutoplayDialog:true});

            } else if (updateType == 'DELETE') {
                // 流删除，通过流删除列表 streamList 中每个流的 streamID 进行停止拉流。
                const streamID = streamList[0].streamID;
                zg.stopPlayingStream(streamID)
            }
        });

        // 登录房间，成功则返回 true
        // userUpdate 设置为 true 才能收到 roomUserUpdate 回调。
        let userID = "user1"; // userID 用户自己设置，必须保证全局唯一
        let userName = "user1";// userName 用户自己设置，没有唯一性要求
        let roomID = "0001"; // roomID 用户自己设置，必须保证全局唯一
        // token 由用户自己的服务端生成，为了更快跑通流程，可以通过即构控制台 https://console.zego.im/ 获取临时的音视频 token，token 为字符串
        let token = `04AAAAAGSCBH8AEHBkcWR3OHlkcGRpZnk1bjMAoN1i13G0R2Pbgrmy5a5nCzpa2d4y4CNL/NHifNeaDZTElZ4QmaP2JtJRSGtEuxHNqiVAh4ITP3XojCrRR4UOwO3JO/AILUxiasf1ERWK7Ok8yvi2eztIWaXveRkPw/1sw9b4e1LRgR+foEaf2Xoh2A7YBIy21gMiGT5QXZH1szd7go612QsRl2FLoaTJHHHV3RgGU9yBmbtIXytwJI8WTAo=`;

        zg.loginRoom(roomID, token, { userID, userName: userID }, { userUpdate: true }).then(async result => {
            if (result == true) {
                console.log("login success");
                // 与房间连接成功，只有当房间状态是连接成功时，才能进行推流、拉流等操作。
                // 创建流、预览
                // 调用 createStream 接口后，需要等待 ZEGO 服务器返回流媒体对象才能执行后续操作
                const localStream = await zg.createStream();
                // 创建媒体流播放组件
                const localView = zg.createLocalStreamView(localStream);
                localView.play("local-video", {enableAutoplayDialog:true});
                // 开始推流，将自己的音视频流推送到 ZEGO 音视频云，此处 streamID 由用户定义，需全局唯一
                let streamID = new Date().getTime().toString();
                zg.startPublishingStream(streamID, localStream)
            }
        });
      }
    },
    mounted() {
      this.init()
    },


  }
</script>
<style scoped>
.video-wrapper{
  position: relative;
}
#remote-video{
  height: 28rem;
  width: 20rem;
}
#local-video {
  width: 7rem;
  height: 10rem;
  display: inline-block;
  position: absolute;
  top: 0.5rem;
  left: 13rem;
}

.video-wrapper video {
  height: auto;
}
</style>