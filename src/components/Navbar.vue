<template>
    <div class="navbar">
        <div class="navbar-end">
            <div
                class="buttons"
                v-if="auth"
            >
                <router-link
                    class="button"
                    to="/posts/new"
                >
                    New Post
                </router-link>
                <button
                    class="button"
                    @click="signOut"
                >
                    Sign Out
                </button>
            </div>
            <div
                class="buttons"
                v-else
            >
                <button
                    class="button"
                    data-test="sign-up"
                    @click="signUp"
                >
                    Signup
                </button>
                <button
                    class="button"
                    @click="signIn"
                >
                    Sign In
                </button>
            </div>
        </div>
    </div>
    <teleport to="#modal">
        <component :is="component" />
    </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, h, markRaw } from 'vue';
import { useModal } from '../userModal';
import { useStore } from '../store';
import Signup from './Signup.vue';

export default defineComponent({
    components: {
        Signup
    },
    setup() {
        const modal = useModal();
        const store = useStore();

        const auth = computed(() => {
            return !!store.getState().authors.currentUserId
        })

        const signIn = () => {
            const Signin = defineComponent({
                setup () {
                    return () => h('div', 'SignIn')
                }
            })
            modal.component.value = markRaw(Signin)
            modal.showModal()
        }
        const signUp = () => {
            modal.component.value = markRaw(Signup)
            modal.showModal()
        }
        const signOut = () => {}

        return {
            auth,
            signIn,
            signUp,
            signOut,
            component: modal.component
        }
    }
});
</script>