<template>
    <div class="sidebar">
        <div class="flex-shrink-0 p-3" style="width: 280px;">
            <ul class="nav flex-column">
                <li class="nav-item nav-item_title">
                    <div class="nav-header">
                        <div class="nav-header_title">
                            <a class="nav-link" href="#">UI Kit <span>version 0.1.0</span></a>                            
                        </div>
                        <div class="nav-header_body">
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                        </div>
                    </div>
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
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SidebarComponent',
    props: {},
}

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

.nav-header_title span {
    font-weight: 400;
    font-size: 18px;
}
.nav-header_body {
    padding: 0.5rem 1rem;
}
</style>