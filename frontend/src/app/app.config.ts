import { ApplicationConfig } from "@angular/core"
import { provideRouter } from "@angular/router"
import { provideHighlightOptions } from "ngx-highlightjs"
import { routes } from "./app.routes"

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHighlightOptions({
            coreLibraryLoader: () => import("highlight.js/lib/core"),
            languages: {
                shell: () => import("highlight.js/lib/languages/shell"),
            },
        }),
    ],
}