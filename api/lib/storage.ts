import { put, del, head } from '@vercel/blob'

export interface UploadResult {
  url: string
  filename: string
  size: number
}

// 上传文件到 Vercel Blob
export async function uploadFile(
  filename: string,
  content: Buffer | string,
  contentType: string = 'text/markdown'
): Promise<UploadResult> {
  const blob = await put(filename, content, {
    access: 'public',
    contentType
  })
  
  return {
    url: blob.url,
    filename: filename,
    size: content.length
  }
}

// 删除文件
export async function deleteFile(url: string): Promise<void> {
  await del(url)
}

// 获取文件信息
export async function getFileInfo(url: string) {
  const blob = await head(url)
  return blob
}

// 生成唯一文件名
export function generateUniqueFilename(originalName: string): string {
  const ext = originalName.split('.').pop() || 'md'
  const basename = originalName.replace(`.${ext}`, '')
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${basename}_${timestamp}_${random}.${ext}`
}

// 验证文件类型
export function isAllowedFile(filename: string): boolean {
  const allowedExtensions = ['.md', '.markdown', '.txt']
  const ext = `.${filename.split('.').pop()?.toLowerCase()}`
  return allowedExtensions.includes(ext)
}
