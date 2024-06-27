<template>
    <section>
      <div class="heading">
        <h2>Começando com o Levidade Doc</h2>
        <p>Levidade Doc é uma simples aplicação JavaScript para documentar rapidamente qualquer coisa.</p>
      </div>

      <div class="snippets">

        <h3 class="snippets_heading">Organização da documentação</h3>
        <div class="snippets_short-description">
            <p>Em uma página você encontra uma breve descrição dos componentes utilizados para 
            construir documentos através deste aplicativo.</p>
            <p>É importante saber que todo o código CSS, HTML e parte do JavaScript é baseado no 
            framework <a href="https://getbootstrap.com/">Bootstrap</a>. Portanto, o que você
            não encontrar aqui, a respeito de orientação de uso, você pode consultar a documentação 
            sugerida e adicionar livremente.</p>
            <p>A construção das páginas obedece uma organização simples. Cria-se uma categoria que 
            será um item de menu. Cada subcategoria, obviamente, um subitem desse menu. Após 
            criadas as categorias e subcategorias, cria-se uma página e atribui-se a ela a 
            categoria desejada. Assim, a estrutura do documento fica organizada deste modo:<br>
                <ul>
                    <li>Seção + título + descrição</li>
                    <li>Categoria + título + descrição + exemplos</li>
                    <li>Subcategoria + título + descrição + exemplos</li>
                </ul>                    
            </p>
        </div>


        <h3 class="snippets_heading">Componentes</h3>
        <div class="snippets_short-description">
            <p>Aproveitando a estilização do Bootstrap, com poucas modificações, criamos alguns componentes 
                reutilizáveis para facilitar o trabalho na hora de documentar. Estes componentes são fáceis
            de usar e modificar. Optamos por usar uma codificação simples em nossos arquivos Vue.js, cuja 
            <a href="https://vuejs.org/guide/introduction.html">documentação pode ser consultada</a>.</p>
        </div>

        <div class="snippets_item">
          <h3 class="snippets_item-title">Alerta</h3>
          <div class="snippets_item-description">
            <p>Utilizado para exibir mensagens de alerta ou notificar o que você quiser.</p>
          </div>

          <app-alert v-for="alert in alertTheme" :key="`${alert.type}`" :type="alert.type">{{ alert.message }}</app-alert>

          <h4 class="snippets_item-howto">Como utilizar</h4>
          <p>Importar componente:</p>
          <div class="snippets_item-code">
            <pre v-highlightjs><code class="javascript">{{ alertImport }}</code></pre>
          </div>
          <p>Código HTML:</p>
          <div class="snippets_item-code">
            <pre v-highlightjs><code class="html">{{ alertCode }}</code></pre>
          </div>
          <p>Props:</p>
          <app-table head="light" :columns="tableColumns" :data="tableRows"></app-table>
        </div>
      </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import AppAlert from '@/components/layout/ui/AppAlert.vue';
import AppTable from '@/components/layout/ui/table/AppTable.vue';

// Alerts
const alertTheme = ref([
    {   type: 'primary', message: 'Mensagem com tema primário.' },
    {   type: 'secondary', message: 'Tema secundário para este alerta.' },
    {   type: 'success', message: 'Sucesso ao executar a ação!' },
    {   type: 'danger', message: 'Erro ao tentar atualizar.' },
    {   type: 'warning', message: 'Uma atividade requer sua atenção.' },
    {   type: 'info', message: 'O download iniciará em breve.' },
    {   type: 'light', message: 'Lorem ipsum dolor sit amet.' },
    {   type: 'dark', message: 'Um exemplo de alerta.' },
]);
const alertImport = ref(`import AppAlert from '@/components/layout/ui/AppAlert.vue';`);
const alertCode = ref(`<app-alert type="success">Success! Lorem ipsum dolor sit amet</app-alert>`);

// Alert API
const tableColumns = ['Option','Type','Required','Default Value', 'Description']
const tableRows = [
  {
    id: 1, option: 'type', type: 'String', required: 'false', default: 'success', description: 'Define o estilo adequado usando as classes habituais para templates de cores.'
  },
  {
    id: 2, option: 'noIcon', type: 'Boolean', required: 'false', default: 'false', description: 'Utilize como no-icon ou :no-icon=false para esconder os ícones.'
  },
] 

</script>

<style scoped>

</style>
