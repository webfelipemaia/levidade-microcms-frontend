<template>
    <AppNavigation @click="notifySidebar" />
    <div class="d-flex align-items-strech">
      <AppSidebar :is-active="sidebarActiveValue"  @updateValue="handleSidebarNotification"  />
      <AppHome>
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
      </AppHome>
    </div>
    <app-footer/>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import AppHome from './components/AppHome.vue'
import AppNavigation from './components/AppNavigation.vue'
import AppFooter from './components/AppFooter.vue'
import AppSidebar from './components/AppSidebar.vue'

const emit = defineEmits(['update-value']);

const notifySidebar = () => {
  
  var sidebarElem = document.querySelector(".sidebar");
  sidebarElem.classList.add('show');
  console.log(sidebarElem);
  handleSidebarNotification(true)
      emit('update-value', true);
    };

const sidebarActiveValue = ref('false');

const handleSidebarNotification = (value) => {
  sidebarActiveValue.value = value;
};

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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #4e4d58;
}

#app .navbar a,
#app .navbar .nav-link {
  color: #524aac;
}

#app .navbar a:hover,
#app .navbar .nav-link:hover {
  color: #524aac;
  text-decoration: none;
}

#app .navbar a:after {
  content: '';
  display: block;
  transform: scaleX(0);
  border-bottom: 2px solid #524aac;
  background: #2d5972;
  transition: transform 0.5s ease;
  transform-origin: left;
}


#app a:hover::after {
  transform: scaleX(1);
}

.navbar {
  background-color: #ffffff;
  color: #222222;
  border-bottom: 1px solid rgba(76,103,118,.15);
}

/**
primary: #766AF7 - rgb(118,106,247) hsl(245.1,89.8%,69.2%)
secondary: #6A6878 - #4e4d58 - rgb(106,104,120) hsl(247.5,7.1%,43.9%)
info: #6AB8F7 ok - rgb(106,184,247) hsl(206.8,89.8%,69.2%)
success: #85CD7A - rgb(133,205,122) hsl(112,45.4%,64.1%)
yellow: #F2F76A - rgb(242,247,106) hsl(62.1,89.8%,69.2%)
orange: #F7C06A - rgb(247,192,106) hsl(36.6,89.8%,69.2%)
red: #F76F6A - rgb(247,111,106) hsl(2.1,89.8%,69.2%)
pink: #F76AE6 - rgb(247,106,230) hsl(307.2,89.8%,69.2%)
blue: #4975AB - rgb(73,117,171) hsl(213.1,40.2%,47.8%)
purple: #bd6af7 - rgb(189,106,247) hsl(275.3,89.8%,69.2%)
*/



@media (max-width: 768px) {

  .leve.offcanvas-md {
    position: fixed;
    bottom: 0;
    z-index: var(--bs-offcanvas-zindex);
    display: flex;
    flex-direction: column;
    max-width: 100%;
    color: var(--bs-offcanvas-color);
    visibility: hidden;
    background-color: var(--bs-offcanvas-bg);
    background-clip: padding-box;
    outline: 0;
    transition: var(--bs-offcanvas-transition);
  }

  .leve.offcanvas-md.offcanvas-start {
    top: 0;
    left: 0;
    width: var(--bs-offcanvas-width);
    border-right: var(--bs-offcanvas-border-width) solid var(--bs-offcanvas-border-color);
    transform: translateX(-100%);
  }

  .leve.offcanvas-md.show:not(.hiding), .offcanvas-md.showing {
    transform: none;
  }

  .leve.offcanvas-md.hiding, .offcanvas-md.show, .offcanvas-md.showing {
    visibility: visible;
  }
}

.sidebar {
    transition: all .2s;
    background: #fff;
    /*box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15);*/
    border-right: 1px solid rgba(76,103,118,.15);
    z-index: 2;
}

.sidebar .nav .nav-item .nav-link {
  color: #524aac;
  font-weight: bold;
}

.sidebar .nav .nav-item .subnav .nav-link {
color: #6A6878;
  font-weight: 400;
}

.sidebar .nav .nav-item .nav-link:hover,
.sidebar .nav .nav-item .subnav .nav-link:hover {
  color: #3b3b43;
}

.sidebar .nav .nav-item .subnav .nav-link:active,
.sidebar .nav .nav-item .subnav .nav-link:focus {
  background-color: rgba(118,106,247,0.10);
  border-radius: 8px;
  border: none;
  color: #524aac;
}

.sidebar a:focus-visible {
  box-shadow: none;
}

.maincontent {
  display: flex;
  overflow-x: hidden;
  width: 100%;
  min-height: calc(100vh - 72px);
  padding-top: 1rem;
  flex-wrap: wrap;
}

.maincontent section .heading {
  padding: 1rem;
  margin-bottom: 1.5rem;
}


.maincontent section .heading h2,
.maincontent section .snippets .snippets_item .snippets_item-title{
  /*color: hsl(244.9,39.8%,35%);*/
  color: #524aac;
}

.maincontent section .snippets {
  padding: 1rem;
}

.maincontent section .snippets .snippets_heading {
  margin-bottom: 1.5rem;
}
.maincontent section .snippets .snippets_short-description {
  padding-top: 0.5rem;
  margin-bottom: 1.75rem;
}

.maincontent section .snippets .snippets_item {
  padding-top: 3rem;
  padding-bottom: 1.5rem;

}

.maincontent section .snippets .snippets_short-description p,
.maincontent section .snippets .snippets_item .snippets_item-description p {
  line-height: 2rem;
}

.maincontent section .snippets .snippets_item .snippets_item-code {
  border: 1px solid rgba(118,106,247,.05);
  background-color: rgba(118,106,247,.05);
  margin-bottom: 1.5rem;
}

.maincontent section .snippets .snippets_item .snippets_item-code pre code {
  background-color: transparent;
}

.maincontent section .snippets .snippets_item .snippets_item-code pre {
  margin-bottom: 0;
}

.tip {
    margin: 28px 0;
    padding: 20px 24px 4px 42px;
    overflow-x: auto;
    transition: color .5s, background-color .5s;
    position: relative;
    font-size: 15px;
    line-height: 1.6;
    font-weight: 500;
    color: hsl(247.5,7.1%,33.9%);
    background-color: hsl(244.3,11.8%,90.3%);
    border-bottom: 4px solid hsl(244.3,11.8%,73.3%);
}

.tip .tip_title {
  font-weight: bold;
}

.tip.tip-primary {
    background-color: hsl(245.1,89.8%,95.2%);
    border-bottom: 4px solid hsl(245.1,89.8%,83.2%);
}

.tip.tip-secondary {
    background-color: hsl(247.5,7.1%,95.9%);
    border-bottom: 4px solid hsl(247.5,7.1%,83.9%);
}

.tip.tip-success {
    background-color: hsl(112,45.4%,95.1%);
    border-bottom: 4px solid hsl(112,45.4%,83.1%);
}

.tip.tip-danger {
    background-color: hsl(2.1,89.8%,95.2%);
    border-bottom: 4px solid hsl(2.1,89.8%,83.2%);
}

.tip.tip-warning {
    background-color: hsl(62.1,89.8%,93.2%);
    border-bottom: 4px solid hsl(62.1,89.8%,83.2%);
}

.tip.tip-info {
    background-color: hsl(206.8,89.8%,93.2%);
    border-bottom: 4px solid hsl(206.8,89.8%,83.2%);
}

.tip.tip-light {
    background-color: hsl(260,9.7%,98.9%);
    border-bottom: 4px solid hsl(260,9.7%,92.9%);
}

.tip.tip-dark {
    background-color: hsl(260,9.7%,38.9%);
    border-bottom: 4px solid hsl(260,9.7%,15.9%);
    color: hsl(260,9.7%,95.9%);
}

footer {
  background-color: hsl(260,9.7%,98.9%);
}

footer .nav .nav-item .nav-link {
  color: hsl(247.5,7.1%,43.9%);
}

footer .nav .nav-item .nav-link:hover {
  color: #524aac;
  text-decoration: underline;
}


</style>
