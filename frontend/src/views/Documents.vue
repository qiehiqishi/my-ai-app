<template>
  <div class="documents">
    <van-nav-bar title="文档管理">
      <template #right>
        <van-icon name="plus" size="18" @click="showUploadDialog = true" />
      </template>
    </van-nav-bar>

    <div class="content">
      <!-- 上传按钮 -->
      <van-cell-group inset style="margin-bottom: 16px;">
        <van-cell title="上传文档" is-link @click="triggerUpload">
          <template #icon>
            <van-icon name="description" style="margin-right: 8px;" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 文档列表 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
        >
          <van-cell-group inset>
            <van-cell
              v-for="doc in documents"
              :key="doc.id"
              :title="doc.title"
              :label="formatSize(doc.size)"
              is-link
              @click="editDocument(doc)"
            >
              <template #icon>
                <van-icon name="description" style="margin-right: 8px;" />
              </template>
              <template #right-icon>
                <van-icon name="down" @click.stop="downloadDocument(doc)" style="margin-right: 8px;" />
                <van-icon name="delete-o" @click.stop="confirmDelete(doc)" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 隐藏的文件上传输入框 -->
    <input
      ref="fileInput"
      type="file"
      accept=".md,.markdown,.txt"
      style="display: none;"
      @change="handleFileUpload"
    />

    <!-- 编辑对话框 -->
    <van-dialog
      v-model:show="showEditDialog"
      :title="editingDoc ? '编辑文档' : '新建文档'"
      show-cancel-button
      @confirm="saveDocument"
      @closed="resetForm"
    >
      <div style="padding: 16px;">
        <van-field
          v-model="formData.title"
          label="标题"
          placeholder="请输入文档标题"
        />
        <van-field
          v-model="formData.category"
          label="分类"
          placeholder="请输入分类"
        />
      </div>
    </van-dialog>

    <!-- Markdown 编辑器弹窗 -->
    <van-popup
      v-model:show="showEditor"
      position="bottom"
      :style="{ height: '90%' }"
    >
      <div class="editor-popup">
        <van-nav-bar
          :title="currentDoc?.title || 'Markdown 编辑器'"
          left-text="关闭"
          right-text="保存"
          @click-left="showEditor = false"
          @click-right="saveContent"
        />
        <div class="editor-wrapper">
          <MarkdownEditor v-model="editorContent" />
        </div>
      </div>
    </van-popup>

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
import { showConfirmDialog, showSuccessToast, showFailToast, showLoadingToast } from 'vant'
import { Document } from '@/types'
import MarkdownEditor from '@/components/MarkdownEditor.vue'

const active = ref(3)
const loading = ref(false)
const finished = ref(true)
const refreshing = ref(false)
const showEditDialog = ref(false)
const showEditor = ref(false)
const showUploadDialog = ref(false)
const editingDoc = ref<Document | null>(null)
const currentDoc = ref<Document | null>(null)
const editorContent = ref('')
const fileInput = ref<HTMLInputElement>()

const formData = ref({
  title: '',
  category: 'markdown'
})

const documents = ref<Document[]>([])

// 格式化文件大小
const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

// 获取文档列表
const fetchDocuments = async () => {
  try {
    const response = await fetch('/api/documents')
    const result = await response.json()
    if (result.success && result.data) {
      documents.value = result.data
    }
  } catch (error) {
    console.error('Failed to fetch documents:', error)
  }
}

// 刷新
const onRefresh = async () => {
  await fetchDocuments()
  refreshing.value = false
}

// 触发文件上传
const triggerUpload = () => {
  fileInput.value?.click()
}

// 处理文件上传
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  const toast = showLoadingToast({
    message: '上传中...',
    forbidClick: true,
    duration: 0
  })

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    
    if (result.success) {
      showSuccessToast('上传成功')
      await fetchDocuments()
    } else {
      showFailToast(result.message || '上传失败')
    }
  } catch (error) {
    showFailToast('上传失败')
    console.error('Upload error:', error)
  } finally {
    toast.clear()
    // 清空文件输入
    if (target) {
      target.value = ''
    }
  }
}

// 编辑文档
const editDocument = async (doc: Document) => {
  currentDoc.value = doc
  editorContent.value = doc.content
  showEditor.value = true
}

// 保存内容
const saveContent = async () => {
  if (!currentDoc.value) return

  try {
    const response = await fetch(`/api/documents/${currentDoc.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: editorContent.value
      })
    })

    const result = await response.json()
    
    if (result.success) {
      showSuccessToast('保存成功')
      await fetchDocuments()
      showEditor.value = false
    } else {
      showFailToast('保存失败')
    }
  } catch (error) {
    showFailToast('保存失败')
    console.error('Save error:', error)
  }
}

// 下载文档
const downloadDocument = (doc: Document) => {
  window.open(`/api/documents/download/${doc.id}`, '_blank')
}

// 确认删除
const confirmDelete = (doc: Document) => {
  showConfirmDialog({
    title: '确认删除',
    message: `确定要删除 "${doc.title}" 吗？`
  }).then(async () => {
    try {
      const response = await fetch(`/api/documents/${doc.id}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      
      if (result.success) {
        showSuccessToast('删除成功')
        await fetchDocuments()
      } else {
        showFailToast('删除失败')
      }
    } catch (error) {
      showFailToast('删除失败')
      console.error('Delete error:', error)
    }
  }).catch(() => {})
}

// 保存文档
const saveDocument = async () => {
  if (!editingDoc.value) return
  
  try {
    const response = await fetch(`/api/documents/${editingDoc.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value)
    })

    const result = await response.json()
    
    if (result.success) {
      showSuccessToast('更新成功')
      await fetchDocuments()
    } else {
      showFailToast('更新失败')
    }
  } catch (error) {
    showFailToast('操作失败')
    console.error('Save error:', error)
  }
}

// 重置表单
const resetForm = () => {
  editingDoc.value = null
  formData.value = {
    title: '',
    category: 'markdown'
  }
}

onMounted(() => {
  fetchDocuments()
})
</script>

<style scoped>
.documents {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 16px;
  padding-bottom: 60px;
}

.editor-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-wrapper {
  flex: 1;
  overflow: hidden;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.editor-wrapper :deep(.markdown-editor) {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
