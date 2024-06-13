import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AboutComponent } from "./about/about.component"
import { DeployLogFullComponent } from "./deploy-log-full/deploy-log-full.component"
import { DocsComponent } from "./docs/docs.component"
import { HomeComponent } from "./home/home.component"
import { MemorialComponent } from "./memorial/memorial.component"
import { NotFoundComponent } from "./not-found/not-found.component"
import { StatsPage } from "./stats-page/stats-page"
import { StatusComponent } from "./status/status.component"

export const routes: Routes = [
    {
        title: "Chaotic-AUR",
        path: "",
        component: HomeComponent,
    },
    {
        title: "Build Status",
        path: "status",
        component: StatusComponent,
    },
    {
        title: "Deploy Log",
        path: "deploy-log",
        component: DeployLogFullComponent,
    },
    {
        title: "Memorial",
        path: "memorial",
        component: MemorialComponent,
    },
    {
        title: "About",
        path: "about",
        component: AboutComponent,
    },
    {
        title: "Documentation",
        path: "docs",
        component: DocsComponent,
    },
    {
        title: "Package Stats",
        path: "stats",
        component: StatsPage,
    },
    {
        title: "Not Found",
        path: "not-found",
        component: NotFoundComponent,
    },
    {
        path: "**",
        redirectTo: "not-found",
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
