<script lang="ts" setup>
import { formatDate, useFrontmatter, useSiteConfig } from 'valaxy'
import { computed } from 'vue'

const siteConfig = useSiteConfig()
const frontmatter = useFrontmatter()

const publishedDate = computed(() => {
  if (!frontmatter.value.date)
    return ''

  return formatDate(frontmatter.value.date)
})

const updatedDate = computed(() => {
  if (!frontmatter.value.updated)
    return ''

  return formatDate(frontmatter.value.updated)
})

const categories = computed(() => {
  const value = frontmatter.value.categories

  if (!value)
    return []

  return Array.isArray(value) ? value : [value]
})

const tags = computed(() => {
  const value = frontmatter.value.tags

  if (!value)
    return []

  return Array.isArray(value) ? value : [value]
})
</script>

<template>
  <div class="sakura-post-author-aside <md:hidden">
    <section class="sakura-post-author-card">
      <RouterLink to="/about" class="sakura-post-author-avatar">
        <img :src="siteConfig.author.avatar" :alt="siteConfig.author.name">
      </RouterLink>

      <RouterLink to="/about" class="sakura-post-author-name">
        {{ siteConfig.author.name }}
      </RouterLink>

      <p v-if="siteConfig.description" class="sakura-post-author-desc">
        {{ siteConfig.description }}
      </p>

      <SakuraSocialLinks class="sakura-post-author-social" />

      <div class="sakura-post-author-meta">
        <div v-if="publishedDate" class="sakura-post-author-row">
          <span class="i-ri-calendar-line sakura-post-author-icon" />
          <RouterLink to="/archives/" class="sakura-post-author-link">
            {{ publishedDate }}
          </RouterLink>
        </div>

        <div v-if="updatedDate && updatedDate !== publishedDate" class="sakura-post-author-row">
          <span class="i-ri-refresh-line sakura-post-author-icon" />
          <RouterLink to="/archives/" class="sakura-post-author-link">
            {{ updatedDate }}
          </RouterLink>
        </div>

        <div v-if="categories.length" class="sakura-post-author-row">
          <span class="i-ri-folder-2-line sakura-post-author-icon" />
          <div class="sakura-post-author-links">
            <RouterLink
              v-for="category in categories"
              :key="category"
              :to="{ path: '/categories/', query: { category } }"
              class="sakura-post-author-link"
            >
              {{ category }}
            </RouterLink>
          </div>
        </div>

        <div v-if="tags.length" class="sakura-post-author-row tags">
          <span class="i-ri-price-tag-3-line sakura-post-author-icon" />
          <div class="sakura-post-author-links">
            <RouterLink
              v-for="tag in tags"
              :key="tag"
              :to="{ path: '/tags/', query: { tag } }"
              class="sakura-post-author-link"
            >
              {{ tag }}
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.sakura-post-author-aside {
  position: sticky;
  top: calc(var(--sakura-navbar-height) + 24px);
  padding: 24px 12px 0;
}

.sakura-post-author-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 220px;
  margin-inline: auto;
  padding: 22px 18px;
  border: 1px solid color-mix(in srgb, var(--sakura-color-primary) 18%, transparent);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 82%), rgb(255 255 255 / 62%)),
    var(--sakura-color-card, var(--va-c-bg-soft));
  box-shadow: 0 12px 32px rgb(30 43 76 / 10%);
  backdrop-filter: blur(12px);
}

.dark .sakura-post-author-card {
  background:
    linear-gradient(180deg, rgb(24 28 36 / 78%), rgb(18 21 29 / 64%)),
    var(--sakura-color-card, var(--va-c-bg-soft));
  box-shadow: 0 12px 32px rgb(0 0 0 / 24%);
}

.sakura-post-author-avatar {
  display: block;
  width: 86px;
  height: 86px;
  border-radius: 50%;
  padding: 3px;
  background: color-mix(in srgb, var(--sakura-color-primary) 30%, transparent);

  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    object-fit: cover;
  }
}

.sakura-post-author-name {
  color: var(--sakura-color-text);
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
}

.sakura-post-author-desc {
  margin: 0;
  color: var(--sakura-color-text);
  font-size: 0.85rem;
  line-height: 1.55;
  opacity: 0.76;
  text-align: center;
  white-space: pre-line;
}

.sakura-post-author-social {
  margin-block: 2px 4px;
}

.sakura-post-author-meta {
  display: grid;
  gap: 9px;
  width: 100%;
  padding-top: 12px;
  border-top: 1px solid color-mix(in srgb, var(--sakura-color-text) 12%, transparent);
}

.sakura-post-author-row {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  align-items: start;
  gap: 8px;
  color: var(--sakura-color-text);
  font-size: 0.82rem;
  line-height: 1.45;
  opacity: 0.82;
  overflow-wrap: anywhere;
}

.sakura-post-author-links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.sakura-post-author-link {
  display: inline-flex;
  min-width: 0;
  max-width: 100%;
  align-items: center;
  border: 1px solid color-mix(in srgb, var(--sakura-color-primary) 24%, transparent);
  border-radius: 999px;
  padding: 3px 8px;
  color: var(--sakura-color-text);
  background: color-mix(in srgb, var(--sakura-color-primary) 8%, transparent);
  font-size: 0.78rem;
  line-height: 1.3;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: var(--sakura-color-primary);
    color: var(--sakura-color-primary);
    background: color-mix(in srgb, var(--sakura-color-primary) 14%, transparent);
    transform: translateY(-1px);
  }
}

.sakura-post-author-icon {
  width: 1rem;
  height: 1rem;
  margin-top: 2px;
  color: var(--sakura-color-primary);
}

@media (max-width: 1023px) {
  .sakura-post-author-card {
    max-width: 180px;
    padding-inline: 14px;
  }

  .sakura-post-author-avatar {
    width: 72px;
    height: 72px;
  }
}
</style>
