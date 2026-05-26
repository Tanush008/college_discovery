import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async signup(dto: SignupDto) {

        const existingUser =
            await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                },
            });

        if (existingUser) {
            throw new BadRequestException(
                'Email already exists',
            );
        }

        const hashedPassword =
            await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
            },
        });
        return {
            message: 'User created successfully',
            userId: user.id,
        };
    }


    async login(dto: LoginDto) {

        const user =
            await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                },
            });

        if (!user) {
            throw new UnauthorizedException();
        }

        const validPassword =
            await bcrypt.compare(
                dto.password,
                user.password,
            );

        if (!validPassword) {
            throw new UnauthorizedException();
        }


        const payload = {
            sub: user.id,
            email: user.email,
        };

        return {
            accessToken: this.jwtService.sign(payload),
            message: 'Login successful',
            userId: user.id,
        };
    }
}