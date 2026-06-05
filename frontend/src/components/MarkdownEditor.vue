<template>
  <div class="markdown-editor">
    <div class="editor-container">
      <!-- 编辑区 -->
      <div class="editor-pane">
        <van-field
          v-model="localContent"
          type="textarea"
          :rows="20"
          placeholder="请输入 Markdown 内容"
          @input="handleInput"
          class="editor-textarea"
        />
      </div>
      
      <!-- 预览区 -->
      <div class="preview-pane">
        <div class="preview-header">预览</div>
        <div 
          class="preview-content" 
          ref="previewRef"
          v-html="renderedContent"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const previewRef = ref<HTMLElement | null>(null)
const isScrolling = ref(false)

// 初始化 Markdown 解析器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>'
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})

const localContent = ref(props.modelValue)

// 渲染后的内容
const renderedContent = computed(() => {
  return md.render(localContent.value)
})

// 处理输入
const handleInput = () => {
  emit('update:modelValue', localContent.value)
  // 内容变化后，更新预览区滚动
  nextTick(() => {
    if (previewRef.value) {
      // 预览区会自动更新内容
    }
  })
}

// 监听外部变化
watch(() => props.modelValue, (newVal) => {
  localContent.value = newVal
})

// 滚动同步处理
onMounted(() => {
  // 监听预览区滚动
  if (previewRef.value) {
    previewRef.value.addEventListener('scroll', handlePreviewScroll)
  }
  
  // 监听编辑区滚动
  nextTick(() => {
    const textarea = document.querySelector('.editor-textarea textarea') as HTMLTextAreaElement
    if (textarea) {
      textarea.addEventListener('scroll', handleEditorScroll)
    }
  })
})

// 处理编辑区滚动
const handleEditorScroll = (event: Event) => {
  if (!previewRef.value || isScrolling.value) return
  
  isScrolling.value = true
  
  const textarea = event.target as HTMLTextAreaElement
  const scrollRatio = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight)
  
  if (!isNaN(scrollRatio)) {
    // 同步预览区滚动
    previewRef.value.scrollTop = scrollRatio * (previewRef.value.scrollHeight - previewRef.value.clientHeight)
  }
  
  // 重置滚动标志
  setTimeout(() => {
    isScrolling.value = false
  }, 50)
}

// 处理预览区滚动
const handlePreviewScroll = () => {
  if (!previewRef.value || isScrolling.value) return
  
  isScrolling.value = true
  
  // 获取预览区滚动比例
  const previewElement = previewRef.value
  const scrollRatio = previewElement.scrollTop / (previewElement.scrollHeight - previewElement.clientHeight)
  
  // 找到编辑区的 textarea
  const textarea = document.querySelector('.editor-textarea textarea') as HTMLTextAreaElement
  if (textarea && !isNaN(scrollRatio)) {
    // 同步编辑区滚动
    textarea.scrollTop = scrollRatio * (textarea.scrollHeight - textarea.clientHeight)
  }
  
  // 重置滚动标志
  setTimeout(() => {
    isScrolling.value = false
  }, 50)
}

</script>

<style scoped>
.markdown-editor {
  width: 100%;
  height: 100%;
}

.editor-container {
  display: flex;
  gap: 16px;
  height: 100%;
}

.editor-pane {
  flex: 1;
  border: 1px solid #ebedf0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.editor-textarea {
  flex: 1;
  height: 100%;
}

.editor-textarea :deep(textarea) {
  height: 100% !important;
  min-height: 100% !important;
  resize: none !important;
  overflow-y: auto !important;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 transparent;
}

.editor-textarea :deep(textarea::-webkit-scrollbar) {
  width: 8px;
}

.editor-textarea :deep(textarea::-webkit-scrollbar-track) {
  background: transparent;
}

.editor-textarea :deep(textarea::-webkit-scrollbar-thumb) {
  background-color: #c1c1c1;
  border-radius: 4px;
}

.editor-textarea :deep(textarea::-webkit-scrollbar-thumb:hover) {
  background-color: #a8a8a8;
}

.preview-pane {
  flex: 1;
  border: 1px solid #ebedf0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview-header {
  padding: 12px 16px;
  background: #f7f8fa;
  border-bottom: 1px solid #ebedf0;
  font-weight: 500;
  flex-shrink: 0;
}

.preview-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  line-height: 1.6;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 transparent;
}

.preview-content::-webkit-scrollbar {
  width: 8px;
}

.preview-content::-webkit-scrollbar-track {
  background: transparent;
}

.preview-content::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 4px;
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8;
}

/* Markdown 样式 */
.preview-content :deep(h1) {
  font-size: 2em;
  margin: 0.67em 0;
  border-bottom: 1px solid #ebedf0;
  padding-bottom: 0.3em;
}

.preview-content :deep(h2) {
  font-size: 1.5em;
  margin: 0.83em 0;
  border-bottom: 1px solid #ebedf0;
  padding-bottom: 0.3em;
}

.preview-content :deep(h3) {
  font-size: 1.17em;
  margin: 1em 0;
}

.preview-content :deep(p) {
  margin: 1em 0;
}

.preview-content :deep(code) {
  background: #f7f8fa;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Courier New', Courier, monospace;
}

.preview-content :deep(pre) {
  background: #f7f8fa;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}

.preview-content :deep(blockquote) {
  border-left: 4px solid #ebedf0;
  padding-left: 16px;
  margin: 1em 0;
  color: #646566;
}

.preview-content :deep(ul),
.preview-content :deep(ol) {
  padding-left: 2em;
  margin: 1em 0;
}

.preview-content :deep(a) {
  color: #1989fa;
  text-decoration: none;
}

.preview-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.preview-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.preview-content :deep(th),
.preview-content :deep(td) {
  border: 1px solid #ebedf0;
  padding: 8px 12px;
  text-align: left;
}

.preview-content :deep(th) {
  background: #f7f8fa;
  font-weight: 500;
}

/* 代码高亮 */
.preview-content :deep(.hljs) {
  background: #f7f8fa;
}
</style>
