# AppSidebar

Este é o componente de menu lateral do Levidade CMS.

## Funcionalidades
- Menu colapsível via Bootstrap.
- Integração com `router-link` para navegação.
- Suporte a modo mobile (offcanvas).

## Exemplo Visual
(Aqui você poderá importar o componente real após configurarmos o CSS do Bootstrap no tema)

<ClientOnly>
  <AppSidebar />
</ClientOnly>

<script setup>
// Importação do componente real usando o alias @
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>
