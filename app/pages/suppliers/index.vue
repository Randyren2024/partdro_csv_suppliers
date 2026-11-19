<script setup lang="ts">
const search = ref('')
const { data, pending, refresh } = await useFetch<{items:any[],total:number}>('/api/suppliers')
const items = computed(() => (data.value?.items || []).filter(s => !search.value || [s.name,s.name_en,s.city,s.province].some(v => String(v || '').toLowerCase().includes(search.value.toLowerCase()))))
</script>
<template>
  <section class="page-intro"><div class="eyebrow">Manufacturer network</div><h1>Meet the makers behind the machines.</h1><p>Explore UAV manufacturers and specialist suppliers across the industry.</p></section>
  <section class="section"><div class="toolbar"><input v-model="search" class="field" placeholder="Search company or location…" /></div><p style="color:#718079;margin-bottom:22px">{{ items.length }} suppliers listed</p><div v-if="pending" class="empty">Loading suppliers…</div><div v-else class="card-grid"><NuxtLink v-for="s in items" :key="s.id" class="supplier-card" :to="s.slug ? `/suppliers/${s.slug}` : '/suppliers'"><div class="product-content"><span class="tag">{{ s.category_label || s.category || 'UAV supplier' }}</span><h3>{{ s.name_en || s.name }}</h3><p>{{ [s.city,s.province,s.region].filter(Boolean).join(' · ') }}</p><div class="card-meta"><span>{{ (s.product_models || []).length }} known models</span><span>Company ↗</span></div></div></NuxtLink></div><div v-if="!items.length" class="empty">No suppliers match your search.</div></section>
</template>
