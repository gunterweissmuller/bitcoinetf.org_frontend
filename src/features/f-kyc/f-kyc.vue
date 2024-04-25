<template>
  <div>
    <div class="f-kyc" v-if="!alreadyPassedForm && screens.length">
      <div class="f-kyc__back">
        <a-icon width="24" :name="Icon.MonoChevronLeft" @click="$router.back()" />
      </div>
      <m-stepper v-if="currentScreen" :steps-count="totalScreens" v-model:step="currentStep" @select-step="selectStep">
        <template #[currentStep]>
          <div class="f-kyc__step">
            <h2 class="f-kyc__step-title">{{ currentScreen.title }}</h2>
            <h6 class="f-kyc__step-description">{{ currentScreen.subtitle }}</h6>
            <div
              v-if="currentScreen.fields?.length"
              :class="['f-kyc__inputs', { 'f-kyc__inputs--grid': currentScreen.fields?.length > 2 }]"
            >
              <div
                :class="['f-kyc__input', { 'f-kyc__input-radio-group': input.type === 'radio-group' }]"
                v-for="input in currentScreen.fields"
              >
                <a-input
                  v-if="input.type === 'text'"
                  :label="input.label"
                  v-model="input.model"
                  :error-text="input.errorText"
                  @update:modelValue="onChangeInput(input)"
                />
                <a-input
                  v-else-if="input.type === 'date'"
                  type="date"
                  :label="input.label"
                  v-model="input.model"
                  :error-text="input.errorText"
                  @update:model-value="onChangeInput(input)"
                />
                <a-checkbox
                  v-else-if="input.type === 'checkbox'"
                  :id="input.name"
                  :name="input.name"
                  :label="input.label"
                  single
                  :model-value="input.model || false"
                  :error-text="input.errorText"
                  @label-click="onLabelCheckboxClick($event, input)"
                  @update:model-value="input.model = $event"
                />
                <div v-else-if="input.type === 'select'">
                  <m-select
                    v-if="input.name === 'country'"
                    :label="input.label"
                    v-model="input.model"
                    :options="input.options"
                    :disabled="false"
                    :error-text="input.errorText"
                    @update:model-value="getCountryStates(input)"
                  />
                  <template v-else-if="input.name === 'state'">
                    <m-select
                      v-if="countryStates.length"
                      :key="stateKey"
                      :label="input.label"
                      v-model="input.model"
                      :options="countryStates"
                      :error-text="input.errorText"
                      @update:modelValue="onChangeInput(input)"
                    />
                  </template>
                  <m-select
                    v-else
                    :label="input.label"
                    v-model="input.model"
                    :options="input.options"
                    :error-text="input.errorText"
                    @update:modelValue="onChangeInput(input)"
                  />
                </div>
                <template v-else-if="input.type === 'radio-group'">
                  <a-radio
                    :class="['f-kyc__input-radio', { 'f-kyc__input-radio--active': input.model === option.value }]"
                    v-for="option in input.options"
                    v-model="input.model"
                    :name="currentScreen.title"
                    :id="option.value"
                    :required="true"
                    :value="option.value"
                    :label="option.label"
                    :error-text="input.errorText"
                  />
                  <p class="f-kyc__input-error" v-if="input.errorText">{{ input.errorText }}</p>
                </template>
                <div v-else-if="input.type === 'file'" :key="filesKey">
                  <ul class="f-kyc__input__files">
                    <li v-if="input.model?.length" v-for="(file, index) in input.model" :key="file" class="f-kyc__input__file">
                      <img class="f-kyc__input__file-img" :src="generateThumbnail(file)" alt="" />
                      <div class="f-kyc__input__file-text">{{ file.name }}</div>
                      <a-progressbar class="f-kyc__input__progressbar" is-auto-progress :duration="500" />
                      <a-icon
                        width="16"
                        height="16"
                        class="f-kyc__input__file-delete"
                        :name="Icon.MonoActionClose"
                        @click="deleteFile(index, input.model)"
                      />
                    </li>
                  </ul>
                  <m-dropfile
                    class="f-kyc__input-dropfile"
                    :model-value="input.model"
                    v-if="input.type === 'file' && input.model.length < 5"
                    @update:modelValue="updateFileHandler($event, input)"
                  />
                  <a-button
                    class="f-kyc__input__camera"
                    text="Choose file"
                    variant="secondary"
                    :icon="Icon.ColorfulCamera"
                    @click="open"
                  />
                  <p class="f-kyc__input-error" v-if="input.errorText">{{ input.errorText }}</p>
                </div>
              </div>
            </div>
            <a-button class="f-kyc__button" text="Continue" :disabled="continueDisabled || saveButtonEnable" @click="onContinueClick" :loading="saveButtonEnable"/>
          </div>
        </template>
      </m-stepper>
    </div>
    <div v-else-if="alreadyPassedForm">
      <e-kyc-thanks-modal v-model="finishKycModel" @accept="onFinishKycClick" @close="onFinishKycClick" />
    </div>
    <e-kyc-start-modal
      v-model="startKycModel"
      @accept="onAcceptStartKyc"
      @cancel="onCancelStartKyc"
      @close="onCancelStartKyc"
    />
  </div>
</template>

<script setup lang="ts">
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import MSelect from '~/src/shared/ui/molecules/m-select/m-select.vue'
import MStepper from '~/src/shared/ui/molecules/m-stepper/m-stepper.vue'
import ARadio from '~/src/shared/ui/atoms/a-radio/a-radio.vue'
import MDropfile from '~/src/shared/ui/molecules/m-dropfile/m-dropfile.vue'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import { useFileDialog } from '@vueuse/core'
import { useNuxtApp } from '#app'
import { computed, ref, watch } from 'vue'
import EKycStartModal from '~/src/entities/e-kyc-start-modal/e-kyc-start-modal.vue'
import EKycThanksModal from '~/src/entities/e-kyc-thanks-modal/e-kyc-thanks-modal.vue'
import ACheckbox from '~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue'
import AProgressbar from '~/src/shared/ui/atoms/a-progressbar/a-progressbar.vue'
import useNotification from '~/composables/useNotification'

const { addNotification } = useNotification()

const { $app } = useNuxtApp()
const router = useRouter()


const { files, open, onChange, reset } = useFileDialog()

const form = ref(null)
const alreadyPassedForm = ref(false)
const totalScreens = ref()
const currentStep = ref(0)

const screens = ref([])
const currentScreenId = ref(null)
const currentScreen = ref(null)

const filesKey = ref(1)

const startKycModel = ref(false)
const finishKycModel = ref(false)

const countryStates = ref([])

onChange((files) => {
  const fileField = currentScreen.value.fields.find((field) => field.type === 'file')
  updateFileHandler(Object.values(files), fileField)
})

const updateFileHandler = (files: any, input: any) => {
  let skip = false
  files.forEach((file) => {
    if (file.size > 10000000) {
      skip = true
    }
  })

  if (!skip) {
    input.model = files
  } else {
    addNotification({
      text: 'The maximum file size is 10 megabytes',
      type: 'error'
    })
  }
}

const deleteFile = (i, ctx) => {
  ctx.splice(i, 1)
  reset()

  // filesKey.value += 1
}

const generateThumbnail = (file) => {
  let fileSrc = URL.createObjectURL(file)
  setTimeout(() => {
    URL.revokeObjectURL(fileSrc)
  }, 1000)
  return fileSrc
}

const selectStep = (step: number) => {
  // currentStep.value = step
}

const onContinueClick = async () => {
  await saveScreen()
}

const getStepName = (index: number) => {
  return index + 1
}

const goBack = () => {
  if (currentStep.value === 1) {
    return
  }

  currentStep.value = currentStep.value - 1
}

const onLabelCheckboxClick = (value, input) => {
  input.model = value
}

const onChangeInput = (input, key) => {
  input.errorText = ''
}

const stateKey = ref(0)

const getCountryStates = async (input) => {
  await $app.api.eth.kyc.getStates({ country: input.model }).then((response) => {
    countryStates.value = response.data

    const foundStateInput = currentScreen.value.fields.find((field) => field.name === 'state')
    foundStateInput.model = ''
    stateKey.value += 1
  })
}

const continueDisabled = computed(() => {
  return currentScreen.value.fields.filter((f) => f.name !== 'state').some((field) => !field.model)
})

const getForms = async () => {
  await $app.api.eth.kyc.getForms().then((formsResponse: any) => {
    form.value = formsResponse.data[0]

    if (form.value.status === 'passed') {
      alreadyPassedForm.value = true
    }
  })
}

const getScreens = async () => {
  await $app.api.eth.kyc
    .getScreens({ form_uuid: form.value?.uuid || '9a2a3c02-7bd7-4257-9a90-1d45eff913fb' })
    .then((screensResponse: any) => {
      totalScreens.value = screensResponse.data.total
      screens.value = screensResponse.data.screens

      if (form.value.current_screen_uuid) {
        const lastScreen = screens.value.find((screen) => screen.uuid === form.value.current_screen_uuid)
        currentScreenId.value = form.value.current_screen_uuid
        currentStep.value = lastScreen.order
      } else {
        currentScreenId.value = screensResponse.data.screens[0].uuid
        currentStep.value = 1
      }
    })
}

const getScreen = async () => {
  await $app.api.eth.kyc.getScreen({ uuid: currentScreenId.value }).then((screenResponse: any) => {
    currentScreen.value = screenResponse.data
  })
}

const uploadFiles = async (files: any, selectType: any) => {
  currentScreen.value.fields = currentScreen.value.fields.map((field) => {
    return { ...field, errorText: '' }
  })
  let uploadFilesIds: string[] = []

  for await (const file of files) {
    const formData = new FormData()
    formData.append('type', selectType || 'avatar')
    formData.append('file', file)

    await $app.api.eth.kyc
      .uploadFile(formData)
      .then((uploadFileResponse: any) => {
        uploadFilesIds.push(uploadFileResponse.data.uuid)
      })
      .catch((e) => {})
    // .catch((e) => {
    //   const validationKeys = Object.keys(e.errors.error.validation)
    //
    //
    //
    //
    //   if (validationKeys.type) {
    //     currentScreen.value.fields.find((field) => field)
    //   }
    //
    //   currentScreen.value.fields = currentScreen.value.fields.map((field) => {
    //     if (validationKeys.includes(field.name)) {
    //       return { ...field, errorText: e.errors.error.validation[field.name][0] }
    //     } else {
    //       return field
    //     }
    //   })
    //
    //
    // })
  }

  return uploadFilesIds
}
const saveButtonEnable = ref(false)
const saveScreen = async () => {
  currentScreen.value.fields = currentScreen.value.fields.map((field) => {
    return { ...field, errorText: '' }
  })

  const saveScreenPayload = await currentScreen.value.fields.reduce(async (accPromise, cField) => {
    const acc = await accPromise
    let { name, model, type, enums } = cField

    if (type === 'file') {
      let selectModel
      if (enums?.length) {
        selectModel = enums[0]
      } else {
        const foundSelect = currentScreen.value.fields.find((field) => field.type === 'select')
        selectModel = foundSelect?.model
      }
      saveButtonEnable.value = true
      model = await uploadFiles(model, selectModel)
    }

    return { ...acc, [name]: model }
  }, Promise.resolve({}))

  saveScreenPayload.uuid = currentScreen.value.uuid

  await $app.api.eth.kyc
    .saveScreen(saveScreenPayload)
    .then((savePayload: any) => {
      saveButtonEnable.value = false
      if (currentStep.value < totalScreens.value) {
        currentScreenId.value = screens.value[currentStep.value].uuid
        currentStep.value += 1
      } else {
        alreadyPassedForm.value = true
        finishKycModel.value = true
      }
    })
    .catch((e) => {
      const validationKeys = Object.keys(e.errors.error.validation)

      currentScreen.value.fields = currentScreen.value.fields.map((field) => {
        if (validationKeys.includes(field.name)) {
          return { ...field, errorText: e.errors.error.validation[field.name][0] }
        } else {
          return field
        }
      })
    })
}

watch(
  () => currentScreenId.value,
  async (value) => {
    await getScreen()
  },
)

const onAcceptStartKyc = () => {
  startKycModel.value = false
  getScreens()
}

const onCancelStartKyc = () => {
  router.go(-1)
}

const onFinishKycClick = () => {
  router.push({ name: 'personal-dividends' })
}

onMounted(async () => {
  await getForms()
  if (!alreadyPassedForm.value) {
    if (!form.value.current_screen_uuid) {
      startKycModel.value = true
    } else {
      await getScreens()
    }
  } else {
    finishKycModel.value = true
  }
})
</script>

<style lang="scss" src="./f-kyc.scss" />
