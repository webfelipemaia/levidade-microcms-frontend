<template>
    <div class="sidebar">
        <div class="flex-shrink-0 p-3" style="width: 280px;">
            <ul class="nav flex-column">
                <li class="nav-item nav-item_title">
                    <a class="nav-link">Link Title</a>
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
</style>