import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // conecta 1 vez só
  }

  async onModuleDestroy() {
    await this.$disconnect(); // fecha conexão corretamente
  }
}
