<script setup lang="ts">
type ProductMedia = { url?: string; alt?: string; path?: string }
const route = useRoute()
const { data: product, error } = await useFetch<any>(() => `/api/products/${route.params.slug}`)
if (error.value) throw createError({ statusCode: 404, statusMessage: 'Product not found' })

useSeoMeta({
  title: () => product.value?.name_en || product.value?.name || 'Product',
  description: () => product.value?.summary || product.value?.description || 'UAV product details',
})

const selectedImage = ref(0)
const media = computed<ProductMedia[]>(() =>
  (Array.isArray(product.value?.media) ? product.value.media : [])
    .filter((item: ProductMedia) => typeof item?.url === 'string' && item.url.startsWith('https://')),
)
const activeImage = computed(() => media.value[selectedImage.value] || media.value[0] || null)
const specs = computed(() =>
  Object.entries(product.value?.specifications || {}).filter(([, value]) =>
    value !== null && value !== undefined && value !== '',
  ),
)
const applications = computed(() => {
  const labels: Record<string, string> = {
    mapping: 'Aerial mapping & surveying',
    surveillance: 'Surveillance',
    public_safety: 'Public safety',
    oil_and_gas_pipeline_inspection: 'Oil & gas pipeline inspection',
    infrastructure_inspection: 'Infrastructure inspection',
    wide_area_monitoring: 'Wide-area monitoring',
  }
  return (product.value?.applications || []).map((item: string) => labels[item] || item.replaceAll('_', ' '))
})
const prettyKey = (key: string) => key.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
const prettyValue = (value: unknown) => Array.isArray(value)
  ? value.join(' · ')
  : typeof value === 'object' && value !== null
    ? JSON.stringify(value)
    : String(value)
watch(media, () => { selectedImage.value = 0 })
</script>

<template>
  <section class="page-intro product-detail-intro">
    <div class="eyebrow">{{ product?.brand || 'Manufacturer' }} · Product details</div>
    <h1>{{ product?.name_en || product?.name }}</h1>
    <p>{{ product?.summary || product?.description }}</p>
    <div class="product-identity">
      <span v-if="product?.model">Model {{ product.model }}</span>
      <span v-if="product?.category">{{ product.category.replaceAll('_', ' ') }}</span>
      <span v-if="product?.product_type">{{ product.product_type.replaceAll('_', ' ') }}</span>
    </div>
  </section>

  <section class="section product-detail-section">
    <div class="product-detail-layout">
      <div class="product-main-column">
        <div class="product-gallery">
          <div class="product-gallery-main">
            <img
              v-if="activeImage"
              :src="activeImage.url"
              :alt="activeImage.alt || product?.name_en || product?.name"
              class="product-gallery-image"
              fetchpriority="high"
            >
            <div v-else class="product-gallery-empty">
              <span>UAV</span>
              <small>Product imagery is being prepared</small>
            </div>
            <span v-if="media.length" class="gallery-count">{{ selectedImage + 1 }} / {{ media.length }}</span>
          </div>
          <div v-if="media.length > 1" class="product-gallery-thumbs" aria-label="Product images">
            <button
              v-for="(image, index) in media"
              :key="image.path || image.url || index"
              type="button"
              class="product-gallery-thumb"
              :class="{ active: selectedImage === index }"
              :aria-label="`Show product image ${index + 1}`"
              :aria-pressed="selectedImage === index"
              @click="selectedImage = index"
            >
              <img :src="image.url" :alt="image.alt || `Product image ${index + 1}`" loading="lazy">
            </button>
          </div>
          <p v-if="media.length" class="gallery-credit">Images hosted by Partdro · Original product imagery from the manufacturer</p>
        </div>

        <div class="detail-panel product-overview-panel">
          <div class="detail-section-heading">
            <span class="eyebrow">Product overview</span>
            <h2>Built for long-range professional missions</h2>
          </div>
          <p class="product-description">{{ product?.description || product?.summary || 'Product information is being prepared.' }}</p>
          <div v-if="product?.features?.length" class="product-subsection">
            <h3>Key features</h3>
            <ul class="feature-list">
              <li v-for="(feature, index) in product.features" :key="index">{{ typeof feature === 'string' ? feature : prettyValue(feature) }}</li>
            </ul>
          </div>
          <div v-if="applications.length" class="product-subsection">
            <h3>Applications</h3>
            <div class="application-tags">
              <span v-for="application in applications" :key="application">{{ application }}</span>
            </div>
          </div>
        </div>
      </div>

      <aside class="detail-panel product-spec-panel">
        <span class="tag">{{ product?.category || 'UAV' }}</span>
        <h2>Technical specifications</h2>
        <p class="spec-intro">Manufacturer-published product data</p>
        <div v-if="specs.length" class="spec-grid">
          <div v-for="[key, value] in specs" :key="key" class="spec">
            <small>{{ prettyKey(key) }}</small>
            <strong>{{ prettyValue(value) }}</strong>
          </div>
        </div>
        <p v-else class="spec-empty">Technical specifications are being verified.</p>

        <div v-if="product?.supplier" class="manufacturer-card">
          <small class="manufacturer-label">MANUFACTURER</small>
          <h3>{{ product.supplier.name_en || product.supplier.name }}</h3>
          <p>{{ [product.supplier.city, product.supplier.province].filter(Boolean).join(', ') }}</p>
          <NuxtLink v-if="product.supplier.slug" class="text-link" :to="`/suppliers/${product.supplier.slug}`">
            View supplier profile <span aria-hidden="true">↗</span>
          </NuxtLink>
        </div>
      </aside>
    </div>
  </section>
</template>
