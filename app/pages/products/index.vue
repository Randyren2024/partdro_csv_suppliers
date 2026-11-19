<script setup lang="ts">
const route = useRoute()
const search = ref(typeof route.query.q === 'string' ? route.query.q : '')
const category = ref(typeof route.query.category === 'string' ? route.query.category : '')
const { data, pending, refresh } = await useFetch<{items:any[],total:number}>('/api/products', { query: computed(() => ({ q: search.value, category: category.value, limit: 48 })) })
watch([search, category], () => refresh())
const products = computed(() => data.value?.items ?? [])
</script>
<template>
  <section class="page-intro"><div class="eyebrow">Product directory</div><h1>UAVs, selected for the real world.</h1><p>Explore published aircraft and industrial drone systems from specialist manufacturers.</p></section>
  <section class="section">
    <div class="toolbar"><input v-model="search" class="field" placeholder="Search model, brand or product…" /><select v-model="category" class="field"><option value="">All categories</option><option value="agricultural">Agriculture</option><option value="cargo">Cargo & delivery</option><option value="industrial">Industrial</option></select></div>
    <div class="section-head"><p>{{ data?.total ?? 0 }} published products</p></div>
    <div v-if="pending" class="empty">Loading catalogue…</div>
    <div v-else-if="products.length" class="card-grid"><NuxtLink v-for="item in products" :key="item.id" class="product-card" :to="`/products/${item.slug}`"><div class="product-art">UAV</div><div class="product-content"><span class="tag">{{ item.category || 'UAV' }}</span><h3>{{ item.name_en || item.name }}</h3><p>{{ item.summary || item.model || 'Professional unmanned aircraft system' }}</p><div class="card-meta"><span>{{ item.brand || item.product_type || 'UAV' }}</span><span>Details ↗</span></div></div></NuxtLink></div>
    <div v-else class="empty">No published products match this search.</div>
  </section>
</template>
