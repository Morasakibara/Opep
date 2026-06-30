import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './services/payments.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('process')
  async processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    const payment = await this.paymentsService.processPayment(processPaymentDto);
    return PaymentResponseDto.fromEntity(payment);
  }

  @Get('reservation/:id')
  async getReservationPayment(@Param('id') reservationId: string) {
    const payments = await this.paymentsService.getReservationPayment(reservationId);
    return payments.map(PaymentResponseDto.fromEntity);
  }
}
