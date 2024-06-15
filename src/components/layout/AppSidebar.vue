<template>
    <div 
        :class="{'show': isActive}"
        class="sidebar leve offcanvas-md offcanvas-start" 
        tabindex="-1" 
        id="offcanvasExample" 
        aria-labelledby="offcanvasExampleLabel"
        ref="offcanvas"
        >
        <div class="offcanvas-header">
            
    <h5 class="offcanvas-title" id="offcanvasExampleLabel">Offcanvas</h5>
    <button  @click="updateValue" type="button" class="btn-close" aria-label="Close"></button>
  </div>
    <div class="offcanvas-body flex-shrink-0 p-3" style="width: 280px;">
            <ul class="nav flex-column">
                <li class="nav-item nav-item_title">
                    <div class="nav-header">
                        <div class="nav-header_title">
                            <a class="nav-link" href="#">UI Kit <span>version 0.1.0</span></a>                            
                        </div>
                        <div class="nav-header_body">
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                        </div>
                        <p>{{ isActive }}</p>
                    </div>
                </li>
                <li class="nav-item">
                    <router-link to="/roles" class="nav-link">Roles</router-link>
                    <nav class="nav subnav flex-column">
                        <router-link to="/roles/create" class="nav-link">Create Role</router-link>
                        <a class="nav-link" href="#">Sub Link</a>
                        <a class="nav-link" href="#">Sub Link</a>
                        <a class="nav-link" href="#">Sub Link</a>
                    </nav>
                </li>
                <li class="nav-item">                    
                    <a class="nav-link" href="#">Primary Link</a>
                    <nav class="nav subnav flex-column">
                        <a class="nav-link" href="#">Sub Link</a>
                        <a class="nav-link" href="#">Sub Link</a>
                        <a class="nav-link" href="#">Sub Link</a>
                        <a class="nav-link" href="#">Sub Link</a>
                    </nav>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import {  ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
    isActive: {
      type: Boolean,
      default: false
    }
});

const emit = defineEmits(['updateValue']);

const activeValue = ref(Boolean(props.isActive));
watch(() => props.isActive, (newVal) => {
  activeValue.value = newVal;
});

const updateValue = () => {
    // remove Bootstrap styles from body tag
    var bodyElem = document.getElementsByTagName("body")[0];
    bodyElem.removeAttribute("style");
    // delete element that activates overlay
    Array.from(document.getElementsByClassName("offcanvas-backdrop"))
    .forEach(element => element.remove());
    activeValue.value = false;
    // updates the value of the variable that activates the menu
    emit('updateValue', activeValue.value);
};

</script>
<style>
.nav-header {
    border-bottom: 1px solid rgba(76,103,118,.15);
    margin-bottom: 1rem;
}

.nav-header_title {
    font-size: 20px;
    font-weight: bold;
}

.nav-header_title a,
.nav-header_title .nav-link {
color: #524aac;
}

.nav-header_title span {
    font-weight: 400;
    font-size: 18px;
}
.nav-header_body {
    padding: 0.5rem 1rem;
}

</style>