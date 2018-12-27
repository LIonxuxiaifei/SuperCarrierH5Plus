<template>
  <div>
    <el-table :show-header="false" :data="cfg.pages" style="width: 100%" keep-alive>
      <!-- <el-table-column prop="name" label="标题" width="40">
        <template slot-scope="scope">
          <i class="el-icon-check" style="color:green" v-if="scope.row.isSelected===true"></i>
        </template>
      </el-table-column> -->


      <el-table-column prop="name" label="标题" width="180">
        <template slot-scope="scope">
          <el-input class="page-title" v-model="scope.row.name" title="单击修改页面标题"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope" class="option" width="180">
          <div class='option-bar'>
            <i class="option " :class="scope.row.isHome===true?'el-icon-star-on':'el-icon-star-off'" title="设置为首页" @click='setHomePage(scope.row.id)'></i>
            <!-- :class='scope.row.isSelected===true?"active":""' -->
            <i class="option el-icon-edit"  title="设计" @click='setEditPage(scope.row.id)'>
              <!-- {{scope.row.isSelected}} 
      {{new Date().getTime()}} -->
            </i>
            <i v-if="sup8.role.permissionLevel>1" class="option el-icon-delete" title="删除" @click='removePage(scope.row.id)'></i>
          </div>
        </template>
      </el-table-column>
    </el-table>

    
<!-- 新增时的弹框 -->
<el-button v-if="sup8.role.permissionLevel>1" type="" icon="el-icon-plus" @click='addPage' style='margin-top:10px;width:100%'>新增一页</el-button>
<el-dialog title="新增页面" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="页面名称" >
      <el-input v-model="form.name" autocomplete="off" placeholder="请输入页面名称" style="width:auto"></el-input>
    </el-form-item>
    <el-form-item label="页面类型" >
      <el-select v-model="form.type" placeholder="请选择页面类型">
        <el-option v-for="item in pageTypeList" :label="item.title" :value="item.type" :disabled="item.disabled" :key="item.id" style="width:auto" :title="item.tips"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="savePage()" :disabled="!canSave">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
import _apiHelper from "../assets/js/apiHelper.js";
export default {
  name: "PartPageList",
  props: ["cfg"],
  data() {
    return {
      canSave:false,
      pageTypeList: [],
      dialogFormVisible: false,
      //formLabelWidth: "120px",
      form: {
        name: "",
        type: ""
      }
    };
  },
  methods: {
    setHomePage(pageId) {
      console.log("PartPageList.vue::methods:setHomePage:pageId", pageId);
      this.cfg.pages.forEach(element => {
        var isCurrent = element.id === pageId;
        element.isHome = isCurrent;
        element.isSelected = isCurrent;
      });

      var page = _.find(this.cfg.pages, {
        id: pageId
      });
      console.log("PartPageList.vue::methods:setHomePage", page);

      this.$emit("changeData", {
        selectedPageId: page.id,
        selectedPage: page
      });
    },
    setEditPage(pageId) {
      console.log("PartPageList.vue::methods:setEditPage:pageId", pageId);
      this.cfg.pages.forEach(element => {
        element.isSelected = element.id === pageId;
      });
      var page = _.find(this.cfg.pages, {
        id: pageId
      });
      console.log(
        "PartPageList.vue::methods:setEditPage:pages",
        this.cfg.pages
      );
      console.log("PartPageList.vue::methods:setEditPage:page", page);
      this.$emit("changeData", {
        selectedPageId: page.id,
        selectedPage: page
      });
    },
    removePage(pageId) {
      let that = this;

      this.$confirm("删除后数据将无法恢复，是否继续？", "提示", {
        confirmButtonText: "继续",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(c => {
          that.cfg.pages = that.cfg.pages.filter(t => t.id != pageId);

          if (that.cfg.pages.length > 0) {
            that.$emit("changeData", {
              selectedPage: that.cfg.pages[0]
            });
          }
        })
        .catch(c => {});
    },
    addPage() {
      var that = this;
      this.dialogFormVisible = true;
    },

    savePage() {
      var that = this;
      this.dialogFormVisible = false;
      var sort = that.cfg.pages ? that.cfg.pages.length + 1 : 1;
      var newPage = {
        id: that.sup8.$utils.newGuid(),
        name: that.form.name,
        type: that.form.type,
        components: [],
        sort: sort
      };

      //that.cfg.pages.push(newPage);
      that.cfg.pages.splice(that.cfg.pages.length + 1, 0, newPage);
      that.$emit("changeData", {
        selectedPage: newPage
      });
    },

    getPageTypeList() {
      var that = this;
      _apiHelper.getPageTypeList(that.sup8.urlparams.eno||that.sup8.urlparams.eid, function(res) {
        that.pageTypeList = res.data || [];
        console.log("that.pageTypeList", that.pageTypeList);
        console.log("that.cfg.pages", that.cfg.pages);
        setTimeout(function() {
          _.forEach(that.cfg.pages, function(ch) {
            var pageType = _.find(that.pageTypeList, { type: ch.type });
            if (pageType) {
              pageType.disabled = true;
              pageType.tips = "该类型页面已存在";
            } else {
              pageType={};
              pageType.disabled = false;
            }
          });
        }, 2000);
      });
    }
  },
  watch: {
    'form.name': function(n, o) {
      this.canSave=!!this.form.name&&!!this.form.type
    },
    'form.type': function(n, o) {
       this.canSave=!!this.form.name&&!!this.form.type
    }
  },
  created: function() {
    this.getPageTypeList();
  },
  mounted: function() {
    console.log(
      "PartPageList.vue::methods:setEditPage:cfg.pages",
      this.cfg.pages
    );
    var that = this;
    if (that.cfg.pages === undefined) {
      that.cfg.pages = [];
    }
  }
};
</script>


<style scoped>
.option i {
  font-size: 20px;
}

.el-input__inner {
  border-color: white !important;
}

.el-icon-star-on {
  color: tomato;
}

.active {
  color: tomato;
}
</style>
