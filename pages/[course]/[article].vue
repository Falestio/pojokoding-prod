<script setup>
import prism from "markdown-it-prism";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import { htmlToToc } from "~/utils/content/htmlToToc";
import { saveProgress } from "~~/utils/progress/saveProgress";
import { useCurrentUser } from "~~/composables/user/useCurrentUser";
import { getProgressOneCourse } from "@/utils/progress/getProgressOneCourse";
import { runTests } from "@/utils/exercise/runTests";

definePageMeta({
    layout: "empty",
});

const currentUser = useCurrentUser();

// setup markdown renderer
const md = new markdownIt({
    linkify: true,
    typographer: true,
});
md.use(markdownItAnchor);
md.use(prism);

// Get content
const route = useRoute();
const slug = route.params.article;

const query = groq`*[_type == "content" && slug.current == "${slug}"][0]`;
const { data: contentData } = await useSanityQuery(query);
const content = contentData.value;
const postHtml = ref("");
const toc = ref([]);

if (content.contentType === "post") {
    postHtml.value = md.render(content.markdown);
    toc.value = htmlToToc(postHtml.value);
    console.log(toc);
}

// Get all content related to the course
const courseSlug = route.params.course;
console.log(courseSlug);
const sidebarContentQuery = groq`*[_type == "course" && slug.current == "${courseSlug}"]{
  "content": *[_type == "content" && course._ref == ^._id]{_id, title, slug, orderRank} | order(orderRank asc)
}`;
const { data: sidebarContentData } = await useSanityQuery(sidebarContentQuery);
const sidebarContent = sidebarContentData.value[0].content;

// Get Users Progress in this course
async function handleGetUsersProgress() {
    console.log("handleGetUsersProgress: ", currentUser.value.uid);
    const completedContents = await getProgressOneCourse(currentUser.value.uid, content.course._ref);
    console.log("CompletedContents: ", completedContents);

    const updatedSidebarContent = sidebarContent.forEach((item) => {
        const match = completedContents.some((completedItem) => completedItem.contentId === item._id);
        if (match) {
            item.completed = true;
        }
    });

    console.log("Updated Sidebar Content: ", updatedSidebarContent);

    sidebarContent.value = updatedSidebarContent;
}

watch(currentUser.value, async (newValue, oldValue) => {
    console.log("USER data updated");
    await handleGetUsersProgress();
});

if (currentUser.value) {
    console.log("User data is already here");
    await handleGetUsersProgress();
}

// Save progres
async function handleSaveProgress() {
    await saveProgress(currentUser.value.uid, content._id, content.course._ref, content.contentType);
}

// ===================================== LATIHAN ==================================================
const usersCode = ref(`let readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', function(line){
    greet(line)
})

function greet(name){
    console.log(\`Hallo \${name}\`)
}`);

const testCases = ref(content.testCases);

const langId = content.lang

async function handleCodeExecution() {
    testCases.value = await runTests(usersCode.value, testCases.value, langId)
    
    const allSuccess = testCases.value.every((testCase) => testCase.status === "success");
    if(allSuccess){
        console.log("Semua Test Case Benar")
        await saveProgress(currentUser.value.uid, content._id, content.course._ref, content.contentType, usersCode.value)
    }
}
</script>

<template>
    <div>
        <Drawer :currentSidebarContent="sidebarContent">
            <button @click="handleCodeExecution()">Exec Code</button>
            <h1>Test Case</h1>
            <pre>
                {{ testCases }}
            </pre>
            <div class="w-[880px]">
                <Comment :articleId="content._id"></Comment>
                <pre>
            <h1>Current User</h1>
            {{ currentUser }}
        </pre>
                <pre>
            <h2>Content</h2>
            {{ content }}
        </pre
                >
                <pre>
            <h1>Sidebar Content with progress</h1>
            {{ sidebarContent }}
        </pre>
                <pre>
            <h1>Completed Contents</h1>
        </pre>
                <Ide v-if="content.contentType === 'exercise'" :latihan="content"></Ide>
                <div v-if="content.contentType === 'post'">
                    <button @click="handleSaveProgress()" class="p-3 bg-pink-600 text-white">Selesai</button>
                    <pre>
                {{ toc }}
            </pre
                    >
                    <article class="article" v-html="postHtml"></article>
                </div>
            </div>
        </Drawer>
    </div>
</template>


<style>
/* Style headings */
.article h1 {
    font-size: 28px;
    font-weight: bold;
    margin-top: 0;
}

.article h2 {
    font-size: 24px;
    font-weight: bold;
}

.article h3 {
    font-size: 20px;
    font-weight: bold;
}

/* Style text elements */
.article p {
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 1em;
}

.article strong {
    font-weight: bold;
}

.article em {
    font-style: italic;
}

.article del {
    text-decoration: line-through;
}

/* Style links */
.article a {
    color: #007bff;
    text-decoration: none;
}

.article a:hover {
    text-decoration: underline;
}

/* Style blockquotes */
.article blockquote {
    margin: 1em 0;
    padding: 10px;
    background-color: #e9e9e9;
    border-left: 2px solid #ccc;
}

.article blockquote p {
    margin: 0;
}

/* Style lists */
.article ul,
.article ol {
    margin-bottom: 1em;
    padding-left: 30px;
}

.article ul li,
.article ol li {
    margin-bottom: 0.5em;
}

/* Style tables */
.article table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1em;
}

.article th,
.article td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}

/* Style images */
.article img {
    max-width: 100%;
    height: auto;
    margin-bottom: 1em;
}

code[class*="language-"],
pre[class*="language-"] {
    color: #f8f8f2;
    background: 0 0;
    text-shadow: 0 1px rgba(0, 0, 0, 0.3);
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    font-size: 1em;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
}
pre[class*="language-"] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
    border-radius: 0.3em;
}
:not(pre) > code[class*="language-"],
pre[class*="language-"] {
    background: #272822;
}
:not(pre) > code[class*="language-"] {
    padding: 0.1em;
    border-radius: 0.3em;
    white-space: normal;
}
.token.cdata,
.token.comment,
.token.doctype,
.token.prolog {
    color: #8292a2;
}
.token.punctuation {
    color: #f8f8f2;
}
.token.namespace {
    opacity: 0.7;
}
.token.constant,
.token.deleted,
.token.property,
.token.symbol,
.token.tag {
    color: #f92672;
}
.token.boolean,
.token.number {
    color: #ae81ff;
}
.token.attr-name,
.token.builtin,
.token.char,
.token.inserted,
.token.selector,
.token.string {
    color: #a6e22e;
}
.language-css .token.string,
.style .token.string,
.token.entity,
.token.operator,
.token.url,
.token.variable {
    color: #f8f8f2;
}
.token.atrule,
.token.attr-value,
.token.class-name,
.token.function {
    color: #e6db74;
}
.token.keyword {
    color: #66d9ef;
}
.token.important,
.token.regex {
    color: #fd971f;
}
.token.bold,
.token.important {
    font-weight: 700;
}
.token.italic {
    font-style: italic;
}
.token.entity {
    cursor: help;
}
</style>