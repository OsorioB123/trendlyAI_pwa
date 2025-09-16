import { supabase } from '../lib/supabase'

/**
 * Upload an image file to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} bucket - The storage bucket name
 * @param {string} folderPath - The folder path within the bucket
 * @returns {Promise<{data: string | null, error: Error | null}>}
 */
export const uploadImage = async (file, bucket = 'avatars', folderPath = '') => {
  try {
    if (!file) {
      return { data: null, error: new Error('No file provided') }
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { data: null, error: new Error('File must be an image') }
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return { data: null, error: new Error('File size must be less than 5MB') }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2)
    const fileName = `${timestamp}_${randomString}.${fileExt}`
    
    const filePath = folderPath ? `${folderPath}/${fileName}` : fileName

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      return { data: null, error }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return { data: publicUrl, error: null }

  } catch (error) {
    console.error('Upload error:', error)
    return { data: null, error }
  }
}

/**
 * Delete a file from Supabase Storage
 * @param {string} filePath - The full path to the file
 * @param {string} bucket - The storage bucket name
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export const deleteImage = async (filePath, bucket = 'avatars') => {
  try {
    // Extract path from URL if a full URL is provided
    let pathToDelete = filePath
    if (filePath.includes('/storage/v1/object/public/')) {
      const parts = filePath.split('/storage/v1/object/public/')
      if (parts.length > 1) {
        pathToDelete = parts[1].split('/').slice(1).join('/')
      }
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([pathToDelete])

    if (error) {
      console.error('Storage delete error:', error)
      return { success: false, error }
    }

    return { success: true, error: null }

  } catch (error) {
    console.error('Delete error:', error)
    return { success: false, error }
  }
}

/**
 * Get public URL for a file in Supabase Storage
 * @param {string} filePath - The file path in storage
 * @param {string} bucket - The storage bucket name
 * @returns {string} The public URL
 */
export const getImageUrl = (filePath, bucket = 'avatars') => {
  if (!filePath) return null
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)
  
  return publicUrl
}

/**
 * Compress image before upload to optimize file size
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} quality - Image quality (0-1)
 * @returns {Promise<File>} Compressed image file
 */
export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(compressedFile)
        },
        file.type,
        quality
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

export default {
  uploadImage,
  deleteImage,
  getImageUrl,
  compressImage
}