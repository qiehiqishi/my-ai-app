<template>
  <div class="prompts">
    <van-nav-bar title="提示词管理">
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
              v-for="prompt in prompts"
              :key="prompt.id"
              :title="prompt.name"
              :label="prompt.category"
              is-link
              @click="editPrompt(prompt)"
            >
              <template #right-icon>
                <van-icon name="delete-o" @click.stop="confirmDelete(prompt)" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 创建/编辑对话框 -->
    <van-dialog
      v-model:show="showCreateDialog"
      :title="editingPrompt ? '编辑提示词' : '创建提示词'"
      show-cancel-button
      @confirm="savePrompt"
    >
      <van-form>
        <van-cell-group inset>
          <van-field
            v-model="formData.name"
            label="名称"
            placeholder="请输入名称"
          />
          <van-field
            v-model="formData.content"
            label="内容"
            type="textarea"
            rows="5"
            placeholder="请输入提示词内容"
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
import { Prompt } from '@/types'

const store = useStore()
const active = ref(2)
const loading = ref(false)
const finished = ref(true)
const refreshing = ref(false)
const showCreateDialog = ref(false)
const editingPrompt = ref<Prompt | null>(null)

const formData = ref({
  name: '',
  content: '',
  category: '',
  variables: []
})

const prompts = computed(() => store.state.prompts)

const onRefresh = async () => {
  await store.dispatch('fetchPrompts')
  refreshing.value = false
}

const editPrompt = (prompt: Prompt) => {
  editingPrompt.value = prompt
  formData.value = {
    name: prompt.name,
    content: prompt.content,
    category: prompt.category,
    variables: prompt.variables
  }
  showCreateDialog.value = true
}

const savePrompt = async () => {
  try {
    if (editingPrompt.value) {
      await store.dispatch('updatePrompt', {
        ...editingPrompt.value,
        ...formData.value
      })
      showSuccessToast('更新成功')
    } else {
      await store.dispatch('createPrompt', formData.value)
      showSuccessToast('创建成功')
    }
    resetForm()
    // 刷新列表
    await store.dispatch('fetchPrompts')
  } catch (error) {
    showFailToast('操作失败')
  }
}

const confirmDelete = (prompt: Prompt) => {
  showConfirmDialog({
    title: '确认删除',
    message: `确定要删除 "${prompt.name}" 吗？`
  }).then(async () => {
    try {
      await store.dispatch('deletePrompt', prompt.id)
      showSuccessToast('删除成功')
      // 刷新列表
      await store.dispatch('fetchPrompts')
    } catch (error) {
      showFailToast('删除失败')
    }
  }).catch(() => {})
}

const resetForm = () => {
  editingPrompt.value = null
  formData.value = {
    name: '',
    content: '',
    category: '',
    variables: []
  }
}

onMounted(() => {
  store.dispatch('fetchPrompts')
})
</script>

<style scoped>
.prompts {
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
