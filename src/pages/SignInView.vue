<template>
    <div
        class="bg-gradient-to-t from-violet-200 to-slate-50 w-screen h-screen flex flex-col items-center justify-start gap-12 pt-14">

        <div class="flex flex-col items-center gap-12">

            <img :src="Logo" alt="Logo" class="" />

            <SignInForm />

        </div>


    </div>
</template>

<script setup>
import Logo from '../assets/images/logo.svg'
import SignInForm from '../components/SignInForm.vue'

</script>
