<template>
  <div id='left-copy-1tomany'>
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="新增组件" name="first">
        <el-collapse v-model="activeCompType" accordion>
          <el-collapse-item class="moduleViewList" v-for="(val, key) in compList" :title="key" :name="key" :key="key">
            <div v-for="comp in val" class="moduleAloneArea "  :class="comp.iconUrl" draggable="true"  @click="onAddComp(comp)"
              :key="comp.id">
              <div class="moduleAloneIcon">
              </div>
              <div class="moduleAloneText">{{comp.name}}</div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>

      <el-tab-pane label="已使用" name="second">
        <el-table :show-header="false" :data="selectedPage.components" style="width: 100%">
          <!-- <el-table-column prop="name" label="标题" width="10">
            <template slot-scope="scope">
              <i class="el-icon-check" style="color:green" v-if="scope.row.isSelected===true"></i>
            </template>
          </el-table-column> -->

          <el-table-column prop="name" label="标题" width="">
            <template slot-scope="scope">
              <el-input class="page-title" v-model="scope.row.title" title="单击修改页面标题"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope" class="option">
              <div class='option-bar'>
                <i class="option el-icon-edit" :class="scope.row.isSelected===true?'':''" title="设计" @click="setEditComp(scope.row.id)"></i>
                <i class="option el-icon-delete" title="删除" @click="removeComp(scope.row.id)"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import "../assets/css/colModuleManagePanel.css";
import _ from "lodash";

export default {
  name: "PartCompList",
  props: ["cfg", "selectedPage", "selectedComp"],
  data() {
    return {
      activeCompType: [], // 表示组件列表展开哪个类型
      compList: [],
      activeTabName: "first"
    };
  },
  methods: {
    onAddComp: function(comp) {
      this.$emit("onAddComp", comp);
    },
    setEditComp(compId) {
      console.log("PartCompList::methods:setEditComp:compId", compId);
      this.selectedPage.components.forEach(element => {
        var isCurrent = element.id === compId;
        element.isSelected = isCurrent;
      });

      var c = _.find(this.selectedPage.components, {
        id: compId
      });

      this.$emit("changeData", {
        selectedComp: c,
        partRightActiveTab: "tab_compprops"
      });
    },
    removeComp(compId) {
      console.log("PartCompList::methods:removeComp:compId", compId);

      let that = this;

      this.$confirm("删除后数据将无法恢复，是否继续？", "提示", {
        confirmButtonText: "继续",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(c => {
          that.selectedPage.components = that.selectedPage.components.filter(
            t => t.id != compId
          );

          if (
            this.selectedComp.id === compId &&
            that.selectedPage.components.length > 0
          ) {
            this.$emit("changeData", {
              selectedComp: that.selectedPage.components[0]
            });
          }
        })
        .catch(c => {});
    }
  },
  created() {
    var that = this;
    let cnt=0;
    let hander = setInterval(function() {
      console.log("that.sup8._baseComponentList", that.sup8._baseComponentList);
      cnt++;
      if (that.sup8._baseComponentList||cnt>=50) {
        clearInterval(hander);
        that.compList = _.groupBy(that.sup8._baseComponentList, "typeTitle");
      }
    }, 50);
  },
  mounted: function() {}
};
</script>

<style lang="css" scoped>
.comp-icon {
  opacity: 0.5;
}

.comp-icon:hover {
  opacity: 1;
}
</style>
