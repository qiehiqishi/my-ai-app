<template>
  <div class="skills">
    <van-nav-bar title="Skills 管理">
      <template #right>
        <van-icon name="plus" size="18" @click="showCreateDialog = true" />
      </template>
    </van-nav-bar>

    <div class="content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
        >
          <van-cell-group inset>
            <van-cell
              v-for="skill in skills"
              :key="skill.id"
              :title="skill.name"
              :label="skill.description"
              is-link
              @click="editSkill(skill)"
            >
              <template #right-icon>
                <van-icon name="delete-o" @click.stop="confirmDelete(skill)" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 创建/编辑对话框 -->
    <van-dialog
      v-model:show="showCreateDialog"
      :title="editingSkill ? '编辑 Skill' : '创建 Skill'"
      show-cancel-button
      @confirm="saveSkill"
    >
      <van-form>
        <van-cell-group inset>
          <van-field
            v-model="formData.name"
            label="名称"
            placeholder="请输入名称"
          />
          <van-field
            v-model="formData.description"
            label="描述"
            placeholder="请输入描述"
          />
          <van-field
            v-model="formData.content"
            label="内容"
            type="textarea"
            rows="5"
            placeholder="请输入内容"
          />
          <van-field
            v-model="formData.category"
            label="分类"
            placeholder="请输入分类"
          />
        </van-cell-group>
      </van-form>
    </van-dialog>

    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/skills">Skills</van-tabbar-item>
      <van-tabbar-item icon="edit" to="/prompts">提示词</van-tabbar-item>
      <van-tabbar-item icon="description" to="/documents">文档</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/settings">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { showConfirmDialog, showSuccessToast, showFailToast } from 'vant'
import { Skill } from '@/types'

const store = useStore()
const active = ref(1)
const loading = ref(false)
const finished = ref(true)
const refreshing = ref(false)
const showCreateDialog = ref(false)
const editingSkill = ref<Skill | null>(null)

const formData = ref({
  name: '',
  description: '',
  content: '',
  category: '',
  tags: []
})

const skills = computed(() => store.state.skills)

const onRefresh = async () => {
  await store.dispatch('fetchSkills')
  refreshing.value = false
}

const editSkill = (skill: Skill) => {
  editingSkill.value = skill
  formData.value = {
    name: skill.name,
    description: skill.description,
    content: skill.content,
    category: skill.category,
    tags: skill.tags
  }
  showCreateDialog.value = true
}

const saveSkill = async () => {
  try {
    if (editingSkill.value) {
      await store.dispatch('updateSkill', {
        ...editingSkill.value,
        ...formData.value
      })
      showSuccessToast('更新成功')
    } else {
      await store.dispatch('createSkill', formData.value)
      showSuccessToast('创建成功')
    }
    resetForm()
    // 刷新列表
    await store.dispatch('fetchSkills')
  } catch (error) {
    showFailToast('操作失败')
  }
}

const confirmDelete = (skill: Skill) => {
  showConfirmDialog({
    title: '确认删除',
    message: `确定要删除 "${skill.name}" 吗？`
  }).then(async () => {
    try {
      await store.dispatch('deleteSkill', skill.id)
      showSuccessToast('删除成功')
      // 刷新列表
      await store.dispatch('fetchSkills')
    } catch (error) {
      showFailToast('删除失败')
    }
  }).catch(() => {})
}

const resetForm = () => {
  editingSkill.value = null
  formData.value = {
    name: '',
    description: '',
    content: '',
    category: '',
    tags: []
  }
}

onMounted(() => {
  store.dispatch('fetchSkills')
})
</script>

<style scoped>
.skills {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 16px;
  padding-bottom: 60px;
}
</style>
