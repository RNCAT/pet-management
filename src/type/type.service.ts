import { Injectable, NotFoundException } from '@nestjs/common';
import { Type } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTypeDTO } from './dto/type.dto';

@Injectable()
export class TypeService {
  constructor(private prisma: PrismaService) {}

  async findAll(name?: string): Promise<Type[]> {
    try {
      const petTypes = await this.prisma.type.findMany({ where: { name } });

      return petTypes;
    } catch (error) {
      return error;
    }
  }

  async findById(id: number): Promise<Type> {
    try {
      const petType = await this.prisma.type.findUniqueOrThrow({ where: { id } });

      return petType;
    } catch (error) {
      if (error.name === 'NotFoundError') {
        throw new NotFoundException(`Pet id ${id} was not found`);
      }

      return error;
    }
  }

  async create(name: string): Promise<Type> {
    try {
      const newPetType = await this.prisma.type.create({
        data: { name },
      });

      return newPetType;
    } catch (error) {
      return error;
    }
  }

  async update(updateTypeDTO: UpdateTypeDTO): Promise<Type> {
    try {
      const { id, name } = updateTypeDTO;

      const updatedType = await this.prisma.type.update({ data: { name }, where: { id } });

      return updatedType;
    } catch (error) {
      return error;
    }
  }

  async delete(id: number) {
    try {
      const deletedType = await this.prisma.type.delete({ where: { id } });

      return deletedType;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Pet id ${id} does not exist`);
        }
      }

      return error;
    }
  }
}
