import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PaymentsService } from './services/payments.service';
import { ProcessPaymentDto, InitiatePaymentDto } from './dto/process-payment.dto';
import { DepositPaymentDto } from './dto/deposit-payment.dto';
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

  @Post('initiate')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  async initiatePayment(@Body() initiatePaymentDto: InitiatePaymentDto) {
    const result = await this.paymentsService.initiatePayment(initiatePaymentDto);
    return {
      payment: PaymentResponseDto.fromEntity(result.payment),
      instructions: result.instructions,
    };
  }

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

  // ============ Fractional Payment: Deposit ============

  @Post('deposit')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async payDeposit(@Body() depositPaymentDto: DepositPaymentDto) {
    const result = await this.paymentsService.processDeposit(depositPaymentDto);
    return {
      payment: PaymentResponseDto.fromEntity(result.payment),
      reservationStatus: result.reservation.status,
      depositAmount: result.reservation.depositAmount,
      remainingAmount: result.reservation.remainingAmount,
      ticketsGenerated: result.ticketsGenerated,
    };
  }

  // ============ Fractional Payment: Balance at Counter ============

  @Post(':id/pay-balance')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @Roles(UserRole.CASHIER, UserRole.AGENCY_MANAGER)
  async payBalance(@Param('id') reservationId: string, @Req() req: any) {
    const result = await this.paymentsService.payBalance(reservationId, req.user?.id);
    return {
      payment: PaymentResponseDto.fromEntity(result.payment),
      message: 'Solde encaissé avec succès',
    };
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
