import { Component } from "@angular/core";
import { CAUR_METRICS_URL, CountryRankList, UserAgentList } from "../../types";
import { getNow, parseOutput } from "../../utils/utils";
import { Axios } from "axios";

@Component({
    selector: "app-misc-stats",
    standalone: true,
    imports: [],
    templateUrl: "./misc-stats.component.html",
    styleUrl: "./misc-stats.component.css",
})
export class MiscStatsComponent {
    loading: boolean = true;
    lastUpdated = "Stats are currently loading...";
    protected axios: Axios;
    userAgentMetrics: UserAgentList = [];
    countryRanks: CountryRankList = [];
    countryRankRange: number = 30;

    constructor() {
        this.axios = new Axios({
            baseURL: CAUR_METRICS_URL,
            timeout: 100000,
        });
    }

    ngAfterViewInit(): void {
        this.updateAllMetrics();
    }

    /**
     * Query the number of user agents in the last 30 days.
     * @returns The number of user agents in the last 30 days.
     */
    private async get30DayUserAgents(): Promise<UserAgentList> {
        return this.axios
            .get("30d/user-agents")
            .then((response) => {
                return parseOutput(response.data).slice(30);
            })
            .catch((err) => {
                console.error(err);
                return [];
            });
    }

    /**
     * Query the country ranks.
     * @returns The country ranking list.
     */
    private async getCountryRanks(): Promise<CountryRankList> {
        return this.axios
            .get(`30d/rank/${this.countryRankRange}/countries`)
            .then((response) => {
                return parseOutput(response.data);
            })
            .catch((err) => {
                console.error(err);
                return [];
            });
    }

    /**
     * Update all metrics and sets the values of the user agent metrics and country ranks.
     */
    updateAllMetrics(): void {
        Promise.all([this.get30DayUserAgents(), this.getCountryRanks()]).then((values) => {
            this.userAgentMetrics = values[0];
            this.countryRanks = values[1];
            this.loading = false;
            this.lastUpdated = getNow();
        });
    }
}
