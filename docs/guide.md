# Ponto de partida

O `App.vue` define a estrutura mestre da interface. Para criar uma aplicação web a partir dos códigos que oferecemos basta começar modificando esse arquivo de acordo o que for preciso para apresentar projetos, ideias e o que mais você quiser.

## Organização da aplicação
É na pasta src/ onde se conentra o core da aplicação:

- **src/App.vue**: Onde você define a montagem global do layout.
- **src/assets**: Onde você deve adicionar seus estilos globais.
- **src/components/layout**: Contém o esqueleto do seu app (Sidebar, Nav, Footer).

Nas demais pastas estão os pedaços de componentes que se unem para montar partes maiores, o esqueleto. A seguir, a estrutura de pastas.

### Estrutura de pastas:

```
src/
 ├─ components/
 │   ├─ layout/
 │   │   ├─ LNavbar.vue
 │   │   ├─ LSidebar.vue
 │   │   ├─ LOffcanvas.vue
 │   │   ├─ LFooter.vue
 │   │
 │   ├─ navigation/
 │   │   ├─ LNavbarBrand.vue
 │   │   ├─ LNavvarProfile.vue
 │   │   ├─ LOffcanvasButton.vue
 │   │   ├─ LSidebarGroup.vue
 │   │   ├─ LSidebarItem.vue
 │   │   ├─ LSidebarMenu.vue
 │   │
 │   ├─ feedback/
 │   │   ├─ LModal/
 │   │   │   ├─ LModal.vue
 │   │   │   ├─ LModalFooter.vue
 │   │   │   ├─ LModalHeader.vue
 │   │   ├─ LAlert.vue
 │   │
 │   ├─ data/
 │   │   ├─ table/
 │   │   │   ├─ LTable.vue
 │   │   ├─ LPagination.vue
 │   │
 │   ├─ surfaces/
 │   │   ├─ card/
 │   │   │   ├─ LCard.vue
 │   │   │   ├─ LCardlFooter.vue
 │   │   │   ├─ LCardHeader.vue
 │   │
 │   ├─ base/
 │   │   ├─ LButton.vue?
 │   │   ├─ LIcon.vue?
 │   │
 │   ├─ form/
 │   │   ├─ LInput.vue?
 │   │   ├─ LSelect.vue?
 │   │
 │   └─ index.js
 │
 ├─ composables/
 │   ├─ useBackdrop.js
 │   ├─ useBoolean.js
 │   ├─ useOffcanvas.js
 │   ├─ useSidebar.js
 │
 ├─ views/
 │   ├─ LoginView.vue
 │   ├─ DashboardView.vue
 │
 ├─ App.vue


```

## Estrutura Visual
O layout é dividido em três áreas principais:
1. **Header (LNavigation):** Fixado no topo.
2. **Body (Flex Wrapper):** Contém a `LOffcanvas` à esquerda e o conteúdo principal à direita.
3. **Footer (LFooter):** Fixado ao final do conteúdo.

## Classes de Layout
Utilizamos utilitários do Bootstrap para garantir a fluidez:
- `.d-flex`: No wrapper principal para alinhar Sidebar e Conteúdo.
- `.align-items-stretch`: Garante que a Sidebar ocupe toda a altura disponível.
- `.maincontent`: Classe customizada para gerenciar o espaçamento interno do dashboard.

A partir daí toda a composição do layout é desenhada com a personalização dos estilos do Bootstrap e seus componentes e o uso da versatilidade das ferramentas Vuejs.