<script setup>
import prism from "markdown-it-prism";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
definePageMeta({
    layout: "empty",
});

// setup markdown renderer
const md = new markdownIt({
    linkify: true,
    typographer: true,
});
md.use(markdownItAnchor);
md.use(prism);

// Get article
const route = useRoute();
const slug = route.params.article;
const query = groq`*[_type == "content" && slug.current == "${slug}"][0]`;
const { data: postData } = await useSanityQuery(query);
const post = postData.value;

// convert markdown to html
const postHtml = md.render(post.markdown);

</script>

<template>
    <div>
        <Drawer>
            <article class="article" v-html="postHtml"></article>
        </Drawer>
    </div>
</template>

<style>
.article p,
ol,
ul {
    font-size: 1.4rem;
    line-height: 140%;
}

.article h1,
h2,
h3,
h4,
h5,
h6,
p {
    line-height: normal;
    margin: 1rem 0;
}

.article h1 {
    font-size: 3.3rem;
}

.article h2 {
    font-size: 2.2rem;
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