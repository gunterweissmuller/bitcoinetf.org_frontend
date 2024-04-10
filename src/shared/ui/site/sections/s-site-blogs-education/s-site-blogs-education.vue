<template>
  <section class="s-site-blogs-education">
    <div class="l-site">
      <h1 class="s-site-blogs-education__title site-title-h3">{{ title }}</h1>
      <div class="s-site-blogs-education__description">{{ description }}</div>
      <m-site-tabs :tabs="categories" @get-active="getActive" />
      <div class="s-site-blogs-education__items">
        <template v-for="(blog, id) in newsList" :key="id">
          <m-site-blog
            v-if="activeTab === 'All' || blog.tags.includes(activeTab)"
            :index="3"
            :blog="blog"
            :sectionSlug="sectionSlug"
          />
        </template>
      </div>
    </div>
  </section>
  <div class="pagination__wrapper">
    <a-pagination
      v-if="newsList.length > 0"
      :per-page="8"
      :total-items="newsLength"
      :current-page
      :disabled-pagination
      :click-callback="
        (page: number) => {
          disabledPagination ? null : $emit('change-page', page)
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import MSiteBlog from '~/src/shared/ui/site/molecules/m-site-blog/m-site-blog.vue'
import MSiteTabs from '~/src/shared/ui/site/molecules/m-site-tabs/m-site-tabs.vue'
import APagination from '~/src/shared/ui/atoms/a-pagination/a-pagination.vue'
import { ref } from 'vue'

interface Props {
  title: string
  description: string
  newsList: any
  sectionSlug: any
  categories: string[] | null
  currentPage: number
  newsLength?: number
  disabledPagination?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  newsList: '',
  sectionSlug: '',
  categories: null,
  currentPage: 0,
  newsLength: 0,
  disabledPagination: false,
})

defineEmits(['change-page'])

const activeTab = ref(props.categories?.[0] || 'All')

const getActive = (value: string) => {
  activeTab.value = value
}
</script>

<style src="./s-site-blogs-education.scss" lang="scss" />
