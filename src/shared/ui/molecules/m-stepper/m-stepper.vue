<template>
  <div class='m-stepper'>
    <div class='m-stepper__progress'>
      <div
        class='m-stepper__progress-item'
        v-for='dataStep in stepsCount'
        :class='{active: step === dataStep, done: dataStep < step}'
        @click='onTabClickHandler(dataStep)'
      />
    </div>
    <div class='m-stepper__content' v-for='dataStep in stepsCount' :key='dataStep'>
      <div v-if='step === dataStep'>
        <slot :name='dataStep'/>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
const props = withDefaults(
  defineProps<{
    step: number
    stepsCount: number
  }>(),
  {
    step: 1,
  },
)

const emit = defineEmits(['select-step'])

const onTabClickHandler = (step: number) => {
  emit('select-step', step)
}
</script>


<style src='./m-stepper.scss' lang='scss'/>
