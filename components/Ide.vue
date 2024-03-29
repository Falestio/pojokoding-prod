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
import axios from "axios";
import * as base64 from "base-64";
import { Codemirror } from "vue-codemirror";
// import { material } from '@uiw/codemirror-theme-material'
import { javascript } from "@codemirror/lang-javascript";

const props = defineProps({
    latihan: Object
})

const extensions = [javascript()];

const testCases = ref(props.latihan.testCases);

const code = ref(props.latihan.startingCode);

const stderr = ref("");

const stdout = ref("");

async function execCode(userCode, input) {
    console.log("(EXEC CODE FUNCTION)");

    const config = {
        headers: {
            "content-type": "application/json",
            "Content-Type": "application/json",
            "X-RapidAPI-Key": "148bd21388msh371e4376375abbep1af45djsn1627d694daa9",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
    };

    const data = {
        source_code: base64.encode(userCode),
        language_id: props.latihan.lang, // replace with the ID for the language you want to use
        stdin: base64.encode(input),
    };

    console.log("Request Payload:", data);

    try {
        const response = await axios.post("https://judge0-ce.p.rapidapi.com/submissions/?base64_encoded=true&wait=true", data, config);

        if (response.status !== 201) {
            throw new Error("Failed to execute code.");
        }

        console.log("Encrypted Response:", response.data);

        response.data.stdout = base64.decode(response.data.stdout);
        response.data.stderr = base64.decode(response.data.stderr);
        response.data.message = base64.decode(response.data.message);
        console.log("Response:", response.data);

        return response.data;
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

    const finalCode = code.value + props.latihan.compileCode;

    for (let i = 0; i < testCases.value.length; i++) {
        let status;
        console.log("RUNNING TEST NUMBER", i + 1);
        const test = testCases.value[i];

        const executeResponse = await execCode(finalCode, test.input);

        const actualOutput = executeResponse.stdout.trim();
        console.log("CODE OUTPUT", actualOutput);

        if (actualOutput === test.expectedOutput) {
            status = "success";
        } else {
            status = "failed";
        }
        console.log("The final status of the test:", status);

        updatedTests.push({ ...test, ...executeResponse, status });
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
    if (status === "success") {
        return "success";
    } else if (status === "failed") {
        return "danger";
    }
};
</script>