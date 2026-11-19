<script setup lang="ts">
const route = useRoute()
const { data: product, error } = await useFetch<any>(() => `/api/products/${route.params.slug}`)
if (error.value) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
useSeoMeta({ title: () => product.value?.name_en || product.value?.name || 'Product', description: () => product.value?.summary || product.value?.description || 'UAV product details' })
const specs = computed(() => Object.entries(product.value?.specifications || {}).filter(([,v]) => v !== null && v !== ''))
</script>
<template>
  <section class="page-intro"><div class="eyebrow">Product details</div><h1>{{ product?.name_en || product?.name }}</h1><p>{{ product?.summary || product?.description }}</p></section>
  <section class="section"><div class="detail-layout"><div><div class="product-art" style="height:360px;border-radius:18px;font-size:80px">UAV</div><div class="detail-panel" style="margin-top:18px"><h2>Overview</h2><p style="color:#718079;line-height:1.8">{{ product?.description || product?.summary || 'Product information is being prepared.' }}</p><h3>Applications</h3><p>{{ (product?.applications || []).join(' · ') || 'Contact us for application details.' }}</p><h3>Features</h3><ul><li v-for="feature in product?.features || []" :key="feature">{{ typeof feature === 'string' ? feature : JSON.stringify(feature) }}</li></ul></div></div><aside class="detail-panel"><span class="tag">{{ product?.category || 'UAV' }}</span><h2>Technical specifications</h2><div class="spec-grid"><div v-for="[key,value] in specs" :key="key" class="spec"><small>{{ key.replaceAll('_',' ') }}</small><strong>{{ typeof value === 'object' ? JSON.stringify(value) : value }}</strong></div></div><div v-if="product?.supplier" style="margin-top:28px;padding-top:20px;border-top:1px solid #edf0ed"><small style="color:#7b8981">MANUFACTURER</small><h3>{{ product.supplier.name_en || product.supplier.name }}</h3><p>{{ [product.supplier.city,product.supplier.province].filter(Boolean).join(', ') }}</p><NuxtLink v-if="product.supplier.slug" class="text-link" :to="`/suppliers/${product.supplier.slug}`">View supplier ↗</NuxtLink></div></aside></div></section>
</template>
