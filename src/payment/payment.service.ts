import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepo: Repository<Payment>,
  ) {}

  // ✅ Create a new payment with isActive (default: true if not provided)
  async create(createPaymentDto: CreatePaymentDto) {
    console.log(createPaymentDto);
    const payment = this.paymentsRepo.create({
      ...createPaymentDto,
      // isActive:
      //   createPaymentDto.isActive === true ||
      //   createPaymentDto.isActive === 'true',
      isActive: String(createPaymentDto.isActive).toLowerCase() === 'true',
    });
    const savedPayment = await this.paymentsRepo.save(payment);
    return savedPayment;
  }

  async findAll() {
    return await this.paymentsRepo.find();
  }

  async findOne(id: number) {
    const payment = await this.paymentsRepo.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const existingPayment = await this.findOne(id);

    if (updatePaymentDto.isActive !== undefined) {
      updatePaymentDto.isActive =
        String(updatePaymentDto.isActive).toLowerCase() === 'true';
    }
    const updatedPayment = this.paymentsRepo.merge(
      existingPayment,
      updatePaymentDto,
    );

    const savedPayment = await this.paymentsRepo.save(updatedPayment);
    return savedPayment;
  }

  async remove(id: number) {
    const result = await this.paymentsRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return { message: `Payment with ID ${id} deleted successfully` };
  }

  async bulkDelete(ids: number[]) {
    const payments = await this.paymentsRepo.findByIds(ids);

    if (payments.length !== ids.length) {
      const foundIds = payments.map((payment) => payment.id);
      const missingIds = ids.filter((id) => !foundIds.includes(id));

      throw new NotFoundException(
        `Some payments not found. Missing IDs: ${missingIds.join(', ')}`,
      );
    }
    const result = await this.paymentsRepo.delete(ids);
    return {
      message: `Successfully deleted ${result.affected} payments`,
      affected: result.affected,
    };
  }
}
