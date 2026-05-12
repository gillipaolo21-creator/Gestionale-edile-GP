import {
    ConflictException,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string }> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email già registrata');
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        nome: dto.nome,
        cognome: dto.cognome,
      },
    });

    this.logger.log(`Nuovo utente registrato: ${user.email}`);
    return this.buildToken(user);
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || !user.attivo) {
      throw new UnauthorizedException('Credenziali non valide');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenziali non valide');
    }

    this.logger.log(`Login effettuato: ${user.email}`);
    return this.buildToken(user);
  }

  async getProfile(userId: string): Promise<{ id: string; email: string; ruolo: string; nome: string | null; cognome: string | null }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, ruolo: true, nome: true, cognome: true },
    });
    if (!user) {
      throw new UnauthorizedException('Utente non trovato');
    }
    return user;
  }

  private buildToken(user: { id: string; email: string; ruolo: string }): { accessToken: string } {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      ruolo: user.ruolo,
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
