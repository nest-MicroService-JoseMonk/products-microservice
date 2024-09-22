import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService')
  onModuleInit() {
   this.$connect();
   this.logger.log('Data connected');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

 async findAll(paginationDto:PaginationDto) {
    const {page, limit} = paginationDto;
    const totalPages = await this.product.count();
    const lastPage = Math.ceil(totalPages/limit);
    return {
      data:await this.product.findMany({
        skip: ( page -1 )*limit,
        take:limit
      }),
      meta:{
        total:totalPages,
        page:page,
        lastPage:lastPage
      }
    }
  }

 async findOne(id: number) {
  const product = await this.product.findFirst({
    where:{id}
  })
  if(!product){
    throw new NotFoundException(`product with id:${id}`);
  }
    return {
      product
    }
  }

 async update(id: number, updateProductDto: UpdateProductDto) {
  const {id: __, ...data} = updateProductDto
    await  this.findOne(id);
    return this.product.update({
      where: {id},
      data: data,
    });
  }

 async remove(id: number) {
  await this.findOne(id)
    return this.product.delete({
      where:{id}
    })
      

  }
}
