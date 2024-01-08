<template>
  <Navigation />
  <div class="d-flex align-items-strech">
    <Sidebar />
    <Home><p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus magnam at saepe quos ducimus. Perferendis deleniti ducimus, nemo voluptate maiores excepturi dolorem quaerat aliquid repudiandae. Unde eligendi fuga accusamus animi?</p></Home>
  </div>
 <Footer />
</template>

<script>
import Home from './components/Home.vue'
import Navigation from './components/Navigation.vue'
import Footer from './components/Footer.vue'
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Navigation,
    Footer,
    Sidebar,
    Home,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #3e464b;
}

#app a,
#app .nav-link {
  color: #2d5972;
}

#app a:hover,
#app .nav-link:hover {
  color: #1c3848;
  text-decoration: none;
}

#app a:after {
  content: '';
  display: block;
  transform: scaleX(0);
  border-bottom: 2px solid #2d5972;
  background: #2d5972;
  transition: transform 0.5s ease;
  transform-origin: left;
}


#app a:hover::after {
  transform: scaleX(1);
}

.navbar {
  background-color: #6abec9;
  color: #222222;
  border-bottom: 1px solid rgb(61,156,168);
}

.navbar a {
  color: #0e2326;
}
.navbar a:hover {
  color: #222222;
}
.navbar .nav-item:hover {
  color: #222222;
  /* background-color: rgba(255,255,255,0.35); */
  /* border-radius: 8px; */
}


/* 
sidebar link #2d5972 
subnav link #485156
*/


/**
primary: #af7575
secondary: #6abec9
info: #afd7db
success: #668633
yellow: #ded83c
orange: #ff8d23
blue: #326481
green: success
purple: #4351ab
*/

.sidebar {
    transition: all .2s;
    background: #fff;
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15);
    z-index: 2;
}
.maincontent {
  display: flex;
  overflow-x: hidden;
  width: 100%;
  min-height: calc(100vh - 72px);
  padding: 1rem;
  flex-wrap: wrap;
}
</style>
