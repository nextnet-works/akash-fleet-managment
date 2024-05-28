/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SdlEditorImport } from './routes/sdl-editor'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const SdlEditorRoute = SdlEditorImport.update({
  path: '/sdl-editor',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/sdl-editor': {
      id: '/sdl-editor'
      path: '/sdl-editor'
      fullPath: '/sdl-editor'
      preLoaderRoute: typeof SdlEditorImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({ IndexRoute, SdlEditorRoute })

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/sdl-editor"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/sdl-editor": {
      "filePath": "sdl-editor.tsx"
    }
  }
}
ROUTE_MANIFEST_END */