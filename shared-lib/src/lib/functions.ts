import { Axios } from "axios"
import TimeAgo from "javascript-time-ago"
import { CAUR_TG_API_URL, CountNameObject, DeploymentList, DeploymentType, TgMessageList, UserAgentList } from "./types"

/**
 * Parse the output of the non-single line metrics.
 * @param input The input to parse, usually text consisting of number, multiple whitespaces and a name.
 * @returns An array of objects containing the name and count of the metric.
 */
export function parseOutput(input: string): any[] {
    const returningArray: UserAgentList | CountNameObject = []
    const perLine = input.split("\n")
    for (const line of perLine) {
        const count = parseInt(line.split(/ (.*)/)[0])
        const name = line.replace(/^[0-9]*\s/, "")
        if (!isNaN(count)) {
            returningArray.push({
                name: name ?? "Unknown",
                count,
            })
        }
    }
    return returningArray
}

/**
 * Get the current date and time in a human-readable format.
 */
export function getNow(): string {
    return new Date().toLocaleString("en-GB", { timeZone: "UTC" })
}

/**
 * Check if the user is on a mobile device.
 * https://dev.to/timhuang/a-simple-way-to-detect-if-browser-is-on-a-mobile-device-with-javascript-44j3
 * @returns True if the user is on a mobile device, false otherwise.
 */
export function checkIfMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Parse the Telegram messages to make it usable for the website.
 * @param messages The TgMessageList array to parse.
 * @param type The type of deployment to parse, e.g., all, failed, succeeded.
 * @returns The parsed DeploymentList array.
 */
export function parseDeployments(messages: TgMessageList, type: DeploymentType): DeploymentList {
    const timeAgo = new TimeAgo("en-US")
    const deploymentList: DeploymentList = []

    for (const message of messages) {
        const pkg: string = String(message.content).split("> ")[1].split(" - logs")[0]
        const date = timeAgo.format(parseInt(message.date) * 1000, "round")
        let repo: string
        let deploymentType: DeploymentType

        if (
            (type === DeploymentType.SUCCESS || type === DeploymentType.ALL) &&
            String(message.content).includes("deployment to")
        ) {
            repo = String(String(message.content).split("deployment to ")[1]).split(":")[0]
            deploymentType = DeploymentType.SUCCESS
        } else if (
            (type === DeploymentType.FAILED || type === DeploymentType.ALL) &&
            String(message.content).includes("failed")
        ) {
            repo = String(message.content).split("Build for ")[1].split(" failed")[0]
            deploymentType = DeploymentType.FAILED
        } else {
            continue
        }

        deploymentList.push({
            date: date,
            name: pkg,
            repo: repo,
            type: deploymentType,
        })
        // The case was required to work around .split being undefined

        // Generate passed time in a human-readable format
    }
    return deploymentList
}

/**
 * Get the latest news from the Telegram channel.
 * @returns The latest news as a list of TgMessage.
 */
export async function getDeployments(amount: number, type: DeploymentType): Promise<TgMessageList> {
    const axios = new Axios({
        baseURL: CAUR_TG_API_URL,
        timeout: 1000,
    })

    let requestString
    switch (type) {
        case DeploymentType.ALL:
            requestString = ""
            break
        case DeploymentType.FAILED:
            requestString = "/failed"
            break
        case DeploymentType.SUCCESS:
            requestString = "/succeeded"
            break
    }

    return axios
        .get(`deployments${requestString}/${amount}`)
        .then((response) => {
            return JSON.parse(response.data)
        })
        .catch((err) => {
            console.error(err)
        })
}