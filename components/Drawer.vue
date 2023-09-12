<script setup>
const props = defineProps({
    currentSidebarContent: Array
})
</script>

<template>
    <div>
        <header>
            <TheNavbar></TheNavbar>
        </header>
        <div class="flex">
            <aside class="h-screen sticky top-0 max-w-[250px]">
                <va-sidebar>
                    
                    <va-sidebar-item v-for="content in props.currentSidebarContent" :key="content.slug.current">
                        <va-sidebar-item-content>
                            <NuxtLink :to="content.slug.current">
                                <va-sidebar-item-title>{{ content.title }}</va-sidebar-item-title>
                            </NuxtLink>
                        </va-sidebar-item-content>
                    </va-sidebar-item>

                </va-sidebar>
            </aside>
            <main class="p-8">
                <slot></slot>
                <footer></footer>
            </main>
        </div>
    </div>
</template>