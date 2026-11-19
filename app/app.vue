<template>
  <div class="site-shell">
    <header class="site-header">
      <NuxtLink to="/" class="brand" aria-label="Partdro Products home">
        <span class="brand-mark">D</span>
        <span>PARTDRO<span class="brand-light"> / PRODUCTS</span></span>
      </NuxtLink>
      <nav class="main-nav">
        <NuxtLink to="/products">Products</NuxtLink>
        <NuxtLink to="/suppliers">Suppliers</NuxtLink>
      </nav>
      <NuxtLink class="header-cta" to="/products">Explore catalogue <span>↗</span></NuxtLink>
    </header>
    <main><NuxtPage /></main>
    <footer class="site-footer">
      <NuxtLink to="/" class="footer-brand">PARTDRO PRODUCTS</NuxtLink>
      <span>Independent UAV catalogue · Powered by verified supplier data</span>
      <span>© {{ new Date().getFullYear() }} Partdro</span>
    </footer>
  </div>
</template>
