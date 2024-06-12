import { CacheInterceptor } from "@nestjs/cache-manager"
import { Controller, Get, Param, UseInterceptors } from "@nestjs/common"
import { TelegramService } from "./telegram.service"

@Controller("telegram")
@UseInterceptors(CacheInterceptor)
export class TelegramController {
    constructor(private telegramService: TelegramService) {}

    @Get("news")
    getNews(): any {
        return this.telegramService.getNews()
    }

    @Get("deployments/:amount")
    getTelegram(@Param() params: any): any {
        return this.telegramService.getDeployments(params.amount)
    }

    @Get("deployments/succeeded/:amount")
    getSucceeded(@Param() params: any): any {
        return this.telegramService.getSucceeded(params.amount)
    }

    @Get("deployments/failed/:amount")
    getFailed(@Param() params: any): any {
        return this.telegramService.getFailed(params.amount)
    }

    @Get("deauth")
    deAuth(): any {
        return this.telegramService.deAuth()
    }

    @Get("auth")
    auth(): any {
        return this.telegramService.doAuth()
    }
}