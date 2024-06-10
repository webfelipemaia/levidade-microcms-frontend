<template>
        <section>
          <div class="heading">
            <h2>Vestibulum</h2>
            <p>Vestibulum lorem sed risus ultricies. Quisque id diam vel quam elementum. </p>
          </div>

          <div class="snippets">

            <h3 class="snippets_heading">consectetur adipisicing elit</h3>
            <div class="snippets_short-description">
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur magni doloremque nostrum culpa tempora.</p>
            </div>

            <h4 class="snippets_heading">Accessibility</h4>
            <div class="snippets_short-description">
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi adipisci hic aspernatur numquam, labore quod dolorem neque temporibus recusandae qui iure suscipit inventore.</p>
              <p> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <div class="tip">
                <p class="tip_title">Lorem ipsum</p>
                <p class="tip_body"> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </div>

            <div class="snippets_item">
              <h3 class="snippets_item-title">Pellentesque dignissim</h3>
              <div class="snippets_item-description">
                <p>Ut placerat orci nulla pellentesque dignissim enim sit amet. Fringilla est ullamcorper eget nulla facilisi etiam dignissim. Mauris a diam maecenas sed enim ut sem viverra. Posuere sollicitudin aliquam ultrices sagittis orci a scelerisque.</p>
              </div>

              <div class="snippets_item-code">
                <pre v-highlightjs><code class="javascript">{{ headingBadgeCode }}</code></pre>
              </div>
              
              <div class="snippets_item-code">
                <pre v-highlightjs><code class="html">{{ htmlCode }}</code></pre>
              </div>
            </div>
          </div>
        </section>
</template>

<script setup>
import { ref } from 'vue';
//const levetipTheme = ref(['primary','secondary','success','danger','warning','info','light','dark']);
const headingBadgeCode = ref(`
this.$fire({
  title: "Title",
  text: "text",
  type: "success",
  timer: 3000
}).then(r => {
 console.log(r.value);
});
          `);

const htmlCode = ref(`
<div class="flex flex-row">
  <div class="basis-1/4">01</div>
  <div class="basis-1/4">02</div>
  <div class="basis-1/2">03</div>
</div>          
          `);

</script>

<style scoped>

</style>
