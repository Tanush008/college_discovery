import { Controller } from '@nestjs/common';
import { SavedService } from './saved.service';
import { Post, Body, UseGuards, Req } from '@nestjs/common';
import { SaveCollegeDto } from './dto/save-college.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('saved')
export class SavedController {
    constructor(
        private readonly savedService: SavedService,
    ) { }
    @Post()
    @UseGuards(JwtAuthGuard)
    saveCollege(
        @Body() dto: SaveCollegeDto,
        @Req() req,
    ) {
        return this.savedService.saveCollege(
            req.user.userId,
            dto.collegeId,
        );
    }
}
