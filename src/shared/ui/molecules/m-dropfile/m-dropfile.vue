<template>
  <div class="m-dropfile">
    <div class="m-dropfile__dropzone" @dragover="dragover" @dragleave="dragleave" @drop="drop">
      <input
        class="m-dropfile__input"
        type="file"
        name="file"
        id="fileInput"
        @change="onChange"
        ref="file"
        accept=".pdf,.jpg,.jpeg,.png"
      />

      <a-icon class="m-dropfile__icon" :name="Icon.ColorfulFolder" />
      <label for="fileInput" class="m-dropfile__file-label">
        <div v-if="isDragging">Release to drop files here.</div>
        <div v-else>Drag and drop or <u>click</u> to upload your file.</div>
      </label>
      <div v-if="files.length && showFiles" class="m-dropfile__preview-container">
        <div v-for="file in files" :key="file.name" class="m-dropfile__preview-card">
          <div>
            <img class="m-dropfile__preview-img" :src="generateThumbnail(file)" />
            <p :title="file.name">
              {{ makeName(file.name) }}
            </p>
          </div>
          <div>
            <button type="button" @click="remove(files.indexOf(file))" title="Remove file">
              <b>&times;</b>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'

const isDragging = ref(false)
// const files = ref([])
const file = ref('file')

const props = withDefaults(
  defineProps<{
    modelValue: any
    showFiles?: boolean
  }>(),
  {
    showFiles: false,
    modelValue: [],
  },
)

const files = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const emit = defineEmits(['update-files', 'update:modelValue'])
const onChange = () => {
  files.value = [...files.value, ...file.value.files]
}

const generateThumbnail = (file) => {
  let fileSrc = URL.createObjectURL(file)
  setTimeout(() => {
    URL.revokeObjectURL(fileSrc)
  }, 1000)
  return fileSrc
}

const makeName = (name) => {
  return name.split('.')[0].substring(0, 3) + '...' + name.split('.')[name.split('.').length - 1]
}

const remove = (i) => {
  files.value.splice(i, 1)
}

const dragover = (e: any) => {
  e.preventDefault()
  isDragging.value = true
}

const dragleave = () => {
  isDragging.value = false
}

const drop = (e: any) => {
  e.preventDefault()
  file.value.files = e.dataTransfer.files
  onChange()
  isDragging.value = false
}
</script>

<style src="./m-dropfile.scss" lang="scss" />
