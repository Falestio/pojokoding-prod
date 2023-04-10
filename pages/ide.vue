<template>
    <div>
        <h2>Text Editor</h2>

        <div class="flex">
            <div class="p-4 w-[200px]">
                <div class="mb-4">
                    {{ latihan.prompt }}
                </div>

                <div class="flex flex-col gap-4">
                    <div v-for="testCase in testCases" :key="testCase._key" class="w-[500px]">
                        <va-card :stripe="getStripeStatus(testCase.status)" :stripe-color="getStripeColor(testCase.status)">
                            <va-card-title class="">
                                <div class="flex gap-2 align-center justify-between w-full">
                                    <span class="text-base mr-3">{{ testCase.testTitle }}</span>
                                    <div class="text-end">
                                        <span v-if="testCase.status === 'success'" class="text-sm text-green-500">Test Berhasil</span>
                                        <span v-else-if="testCase.status === 'failed'" class="text-sm text-red-500">Test Gagal</span>
                                        <span v-else-if="testCase.status === 'running'" class="text-sm text-slate-800">Menjalankan Test</span>
                                    </div>
                                </div>
                            </va-card-title>
                            <va-card-content>
                                <p class="mb-4">
                                    {{ testCase.testDesc }}
                                </p>
                                <p class="font-bold">Contoh Input</p>
                                <div class="bg-slate-100 rounded p-2">
                                    {{ testCase.input }}
                                </div>
        
                                <p class="font-bold">Contoh Output</p>
                                <div class="bg-slate-100 rounded p-2">
                                    {{ testCase.expectedOutput }}
                                </div>
                            </va-card-content>
                        </va-card>
                    </div>
                </div>
            </div>
            <div>
                <codemirror v-model="code" placeholder="Code goes here..." :autofocus="true" :indent-with-tab="true" :style="{ height: '400px', width: '600px' }" :extensions="extensions" />
                <va-button @click="runTests()">Submit</va-button>
            </div>
        </div>

    </div>
</template>

<script setup>
import axios from 'axios'
import * as base64 from "base-64"
import { Codemirror } from "vue-codemirror";
// import { material } from '@uiw/codemirror-theme-material'
import { javascript } from "@codemirror/lang-javascript";

const extensions = [javascript()];

const compileCode = ref(`
let readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', function(line){
    greet(line)
})
`)

const startingCode = ref(`
function greet(name){
    console.log("Hallo", name)
}
`)

const latihan = ref({
    _createdAt: "2023-03-08T08:17:37Z",
    _id: "cf97c4c1-4f3a-4669-950f-4646d853dd32",
    _rev: "LKHcCiwWFCTdJG3aaSHMvl",
    _type: "content",
    _updatedAt: "2023-03-08T08:36:29Z",
    contentType: "exercise",
    course: {
        _ref: "05a58cb4-d523-430f-bee9-37087b44c366",
        _type: "reference",
    },
    lang: 63,
    orderRank: "0|100014:",
    prompt: 'Pada text editor sudah terbuat fungsi bernama beliBaju() yang menerima parameter harga dan uang\n\nbuatlah fungsional dari fungsi sebagai berikut\n\n1. Jika lebih besar tampilkan pesan `Uang kamu cukup`\n2. Jika uang lebih kecil dari harga tampilkan ``Uang kamu tidak cukup"',
    slug: {
        _type: "slug",
        current: "latihan-git-push",
    },
    testCases: [
        {
            _key: "af6a7357afe2",
            expectedOutput: 'Hallo Tio',
            input: "Tio",
            testDesc: 'Tampilkan pesan "Hallo Tio"',
            testTitle: "Tio",
            status: "initial",
        },
        {
            _key: "421738b01e5c",
            expectedOutput: 'Hallo yang lain',
            input: "yang lain",
            testDesc: 'Tampilkan pesan "Hallo yang lain"',
            testTitle: "Hallo yang lain",
            status: "initial",
        },
    ],
    title: "Fungsi pengecek angka satu",
    startingCode: startingCode.value,
    compileCode: compileCode.value
});

const testCases = ref(latihan.value.testCases);

const code = ref(latihan.value.startingCode);

const stderr = ref("")

const stdout = ref("")

async function execCode(userCode, input) {
    console.log("(EXEC CODE FUNCTION)");
    
    const config = {
        headers: { "Content-Type": "application/json" },
    };

    const data = {
        source_code: base64.encode(userCode),
        language_id: latihan.value.lang, // replace with the ID for the language you want to use
        stdin: base64.encode(input),
    };

    console.log("Request Payload:", data)

    try {
        const response = await axios.post("http://103.13.207.174:2358/submissions/?base64_encoded=true&wait=true", data, config);

        if (response.status !== 201) {
            throw new Error("Failed to execute code.");
        }
        
        console.log("Encrypted Response:", response.data)

        response.data.stdout = base64.decode(response.data.stdout)
        response.data.stderr = base64.decode(response.data.stderr)
        response.data.message = base64.decode(response.data.message)
        console.log("Response:", response.data);
        
        return response.data
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function runTests() {
    console.log("runTests()");
    let updatedTests = [];
    
    console.log("The test Cases:", testCases.value);

    testCases.value.forEach((test) => {
        test.status = "running";
    });

    console.log("Updated test cases with running status", testCases.value[0].status);

    const finalCode = code.value + latihan.value.compileCode

    for (let i = 0; i < testCases.value.length; i++) {
        let status;
        console.log("RUNNING TEST NUMBER", i + 1);
        const test = testCases.value[i];

        const executeResponse = await execCode(finalCode, test.input);

        const actualOutput = executeResponse.stdout.trim()
        console.log("CODE OUTPUT", actualOutput);

        if (actualOutput === test.expectedOutput) {
            status = "success";
        } else {
            status = "failed";
        }
        console.log("The final status of the test:", status);

        updatedTests.push({ ...test, ...executeResponse,status });
        console.log("Updated Tests:", updatedTests);
    }

    testCases.value = updatedTests;
    console.log("The final testCases object:", testCases.value);
}

const getStripeStatus = (status) => {
    if (status === "initial" || status === "running") {
        return false;
    } else {
        return true;
    }
};

const getStripeColor = (status) => {
    if (status === "success"){
      return "success"
    } else if(status === "failed") {
      return "danger"
    }
}
</script>