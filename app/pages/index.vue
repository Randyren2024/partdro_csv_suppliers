<script setup lang="ts">
const { data } = await useFetch<{items: any[], total: number}>('/api/products', { query: { limit: 6 } })
const { data: suppliers } = await useFetch<{items: any[], total: number}>('/api/suppliers')
const totalProducts = computed(() => data.value?.total ?? '—')
const totalSuppliers = computed(() => suppliers.value?.total ?? '—')
const featured = computed(() => data.value?.items ?? [])
</script>

<template>
  <section class="hero">
    <div class="eyebrow">The UAV sourcing platform</div>
    <h1>Find the right aircraft.<br><span style="color:#b8e75d">Build what’s next.</span></h1>
    <p>Discover professional UAVs, industrial drone systems and specialist manufacturers in one carefully structured catalogue.</p>
    <div class="hero-actions"><NuxtLink class="button-primary" to="/products">Explore products <span>↗</span></NuxtLink><NuxtLink class="button-ghost" to="/suppliers">Browse suppliers</NuxtLink></div>
    <div class="stats"><div class="stat"><strong>{{ totalProducts }}</strong><span>Published products</span></div><div class="stat"><strong>{{ totalSuppliers }}</strong><span>Supplier profiles</span></div><div class="stat"><strong>One</strong><span>Connected data source</span></div></div>
  </section>
  <section class="section">
    <div class="section-head"><div><div class="eyebrow" style="color:#64804d">Explore the catalogue</div><h2>Aircraft for every mission</h2><p>Browse by application and discover solutions built for demanding work.</p></div><NuxtLink class="text-link" to="/products">All products ↗</NuxtLink></div>
    <div class="category-grid">
      <NuxtLink class="category-card" to="/products?category=agricultural"><span class="number">01 / FIELD OPERATIONS</span><strong>Agriculture</strong><span>Crop spraying · spreading · mapping ↗</span></NuxtLink>
      <NuxtLink class="category-card" to="/products?category=cargo"><span class="number">02 / LOGISTICS</span><strong>Cargo & delivery</strong><span>Heavy lift · last-mile delivery ↗</span></NuxtLink>
      <NuxtLink class="category-card" to="/products?category=industrial"><span class="number">03 / INDUSTRIAL</span><strong>Industrial UAVs</strong><span>Inspection · cleaning · specialist work ↗</span></NuxtLink>
    </div>
  </section>
  <section class="section" style="padding-top:0">
    <div class="section-head"><div><div class="eyebrow" style="color:#64804d">Curated selection</div><h2>Featured products</h2></div><NuxtLink class="text-link" to="/products">View catalogue ↗</NuxtLink></div>
    <div v-if="featured.length" class="card-grid">
      <NuxtLink v-for="item in featured" :key="item.id" class="product-card" :to="`/products/${item.slug}`"><div class="product-art">UAV</div><div class="product-content"><span class="tag">{{ item.category || 'UAV' }}</span><h3>{{ item.name_en || item.name }}</h3><p>{{ item.summary || item.model || 'Professional unmanned aircraft system' }}</p><div class="card-meta"><span>{{ item.brand || 'Manufacturer' }}</span><span>Explore ↗</span></div></div></NuxtLink>
    </div>
    <div v-else class="empty">Published product records will appear here once the catalogue API is configured.</div>
  </section>
</template>
