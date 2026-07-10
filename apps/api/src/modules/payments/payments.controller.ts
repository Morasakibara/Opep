import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PaymentsService } from './services/payments.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { RefundPaymentDto } from './dto/webhook-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@opep/shared-types';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('process')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  async processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    const payment = await this.paymentsService.processPayment(processPaymentDto);
    return PaymentResponseDto.fromEntity(payment);
  }

  @Get('reservation/:id')
  async getReservationPayment(@Param('id') reservationId: string) {
    const payments = await this.paymentsService.getReservationPayment(reservationId);
    return payments.map(PaymentResponseDto.fromEntity);
  }

  // ============ Refund ============

  @Post(':id/refund')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @Roles(UserRole.ADMIN_PLATFORM, UserRole.AGENCY_MANAGER)
  async refundPayment(
    @Param('id') paymentId: string,
    @Body() refundDto: RefundPaymentDto,
    @Req() req: any,
  ) {
    const payment = await this.paymentsService.refundPayment(
      paymentId,
      refundDto,
      req.user?.id,
    );
    return PaymentResponseDto.fromEntity(payment);
  }
}
