import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { TicketsService } from './ticket.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: 'user' | 'admin';
    name: string;
  };
}

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly productsService: TicketsService) {}

  @Post()
  async addTicket(
    @Req() req: AuthenticatedRequest,
    @Body('title') ticketTitle: string,
    @Body('description') ticketDesc: string,
    @Body('date') ticketDate: string,
    @Body('status') ticketStatus: string,
    @Body('remarks') ticketRemarks: string,
    @Body('category') ticketCategory: [],
  ) {
    const userId = req.user.userId;
    const generatedId = await this.productsService.addTickets(
      ticketTitle,
      ticketDesc,
      ticketDate,
      ticketStatus,
      ticketRemarks,
      ticketCategory,
      userId,
    );
    return { id: generatedId };
  }

  @Get('my')
  async getMyTickets(@Req() req: AuthenticatedRequest) {
    const { userId, role } = req.user;
    if (role === 'admin') {
      return this.productsService.getAllTickets();
    }
    return this.productsService.getTicketsForUser(userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAllTickets() {
    const ticket = await this.productsService.getAllTickets();
    return ticket;
  }

  @Get(':id')
  getTicket(@Param('id') prodId: string) {
    return this.productsService.getSingleTicket(prodId);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateTicket(
    @Param('id') ticketId: string,
    @Body('title') ticketTitle: string,
    @Body('description') ticketDesc: string,
    @Body('date') ticketDate: string,
    @Body('status') ticketStatus: string,
    @Body('remarks') ticketRemarks: string,
    @Body('category') ticketCategory: [],
    @Body('userRemarks') ticketUserRemarks: string,
  ) {
    await this.productsService.updateTicket(
      ticketId,
      ticketTitle,
      ticketDesc,
      ticketDate,
      ticketStatus,
      ticketRemarks,
      ticketUserRemarks,
      ticketCategory,
    );
    return 'Ticket updated';
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async removeProduct(@Param('id') prodId: string) {
    await this.productsService.deleteTicket(prodId);
    return 'Ticket Deleted';
  }
}
