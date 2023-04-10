<template>
    <div>
        <header>
            <TheNavbar></TheNavbar>
        </header>
        <div class="flex">
            <aside class="h-screen sticky top-0 max-w-[250px]">
                <va-sidebar>
                    <va-sidebar-item>
                        <va-sidebar-item-content>
                            <va-icon name="dashboard" />
                            <!-- User can hide item with css if he wants -->
                            <va-sidebar-item-title>Dashboard</va-sidebar-item-title>
                        </va-sidebar-item-content>
                    </va-sidebar-item>

                    <va-sidebar-item active>
                        <va-sidebar-item-content>
                            <va-icon name="room" />
                            <va-sidebar-item-title>Sidebar demo</va-sidebar-item-title>
                        </va-sidebar-item-content>
                    </va-sidebar-item>

                    <va-sidebar-item>
                        <va-sidebar-item-content>
                            <va-icon name="loop" />
                            <va-sidebar-item-title>Loop</va-sidebar-item-title>
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