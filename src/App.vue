<template>
  <Navigation />
  <div class="d-flex align-items-strech">
    <Sidebar />
    <Home>
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
          </div>

          <div class="snippets_item">
              <h3 class="snippets_item-title">Pellentesque dignissim</h3>
            <div class="snippets_item-description">
              <p>Ut placerat orci nulla pellentesque dignissim enim sit amet. Fringilla est ullamcorper eget nulla facilisi etiam dignissim. Mauris a diam maecenas sed enim ut sem viverra. Posuere sollicitudin aliquam ultrices sagittis orci a scelerisque.</p>
            </div>

            <div class="snippets_item-code">
              &lt;p&gt;Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem consequuntur sed tempora nesciunt facilis sit, quisquam veritatis unde itaque&lt;/p&gt;
            </div>
          </div>
        </div>
      </section>
    </Home>
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

#app .navbar a,
#app .navbar .nav-link {
  color: #2d5972;
}

#app .navbar a:hover,
#app .navbar .nav-link:hover {
  color: #1c3848;
  text-decoration: none;
}

#app .navbar a:after {
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
  /*background-color: #ecf7f8;*/
  background-color: #ffffff;
  color: #222222;
  border-bottom: 1px solid rgba(76,103,118,.15);
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
    /*box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15);*/
    border-right: 1px solid rgba(76,103,118,.15);
    z-index: 2;
}

.sidebar a {
  color: #4c6776;
}

.sidebar a:focus {
  background-color: rgba(0,0,0,.10);
  border-radius: 8px;
  border: none;
}

.sidebar a:focus-visible {
  box-shadow: none;
}
.sidebar a:hover {
  color: #0e2326;
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
