[33mcommit 21192a051b3ec285df61c6d35cb0365b86b05423[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mphonzammi/dev[m[33m, [m[1;31morigin/phonzammi/dev[m[33m)[m
Author: Romuald Brillout <git@brillout.com>
Date:   Sat Apr 19 11:16:23 2025 +0200

    polish

[1mdiff --git a/packages/vike-react-redux/config.ts b/packages/vike-react-redux/config.ts[m
[1mindex 3bd150a..ba86dfb 100644[m
[1m--- a/packages/vike-react-redux/config.ts[m
[1m+++ b/packages/vike-react-redux/config.ts[m
[36m@@ -29,7 +29,7 @@[m [mconst config = {[m
 declare global {[m
   namespace Vike {[m
     interface Config {[m
[31m-      redux?: null | {[m
[32m+[m[32m      redux?: {[m
         createStore: (pageContext: PageContext) => Store[m
       }[m
     }[m
[1mdiff --git a/packages/vike-react-redux/onBeforeRenderClient.ts b/packages/vike-react-redux/onBeforeRenderClient.ts[m
[1mindex 4471040..5975390 100644[m
[1m--- a/packages/vike-react-redux/onBeforeRenderClient.ts[m
[1m+++ b/packages/vike-react-redux/onBeforeRenderClient.ts[m
[36m@@ -5,7 +5,5 @@[m [mimport type { PageContextClient } from 'vike/types'[m
 function onBeforeRenderClient(pageContext: PageContextClient) {[m
   const createStore = pageContext.config.redux?.createStore[m
   if (!createStore) return[m
[31m-  pageContext.globalContext.redux ??= {[m
[31m-    store: createStore(pageContext),[m
[31m-  }[m
[32m+[m[32m  pageContext.globalContext.redux ??= { store: createStore(pageContext) }[m
 }[m
[1mdiff --git a/packages/vike-react-redux/onCreatePageContext.server.ts b/packages/vike-react-redux/onCreatePageContext.server.ts[m
[1mindex 1533995..bf62824 100644[m
[1m--- a/packages/vike-react-redux/onCreatePageContext.server.ts[m
[1m+++ b/packages/vike-react-redux/onCreatePageContext.server.ts[m
[36m@@ -5,7 +5,5 @@[m [mimport type { PageContextServer } from 'vike/types'[m
 function onCreatePageContext(pageContext: PageContextServer) {[m
   const createStore = pageContext.config.redux?.createStore[m
   if (!createStore) return[m
[31m-  pageContext.redux = {[m
[31m-    store: createStore(pageContext),[m
[31m-  }[m
[32m+[m[32m  pageContext.redux = { store: createStore(pageContext) }[m
 }[m
