import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
  } from '@nestjs/common';
  
  import { TicketsService } from './ticket.service';
  
  @Controller('tickets')
  export class TicketsController {
    constructor(private readonly productsService: TicketsService) {}
  
    @Post()
    async addTicket(
      @Body('title') ticketTitle: string,
      @Body('description') ticketDesc: string,
      @Body('date') ticketDate: string,
      @Body('status') ticketStatus: string,
      @Body('remarks') ticketRemarks: string,
      @Body('category') ticketCategory: [],
    ) {
      const generatedId = await this.productsService.addTickets(
        ticketTitle,
        ticketDesc,
        ticketDate,
        ticketStatus,
        ticketRemarks,
        ticketCategory,
      );
      return { id: generatedId };
    }
  
    @Get()
    async getAllTickets() {
      const ticket = await this.productsService.getTickets();
      return ticket;
    }
  
    @Get(':id')
    getTicket(@Param('id') prodId: string) {
      return this.productsService.getSingleTicket(prodId);
    }
  
    @Patch(':id')
    async updateTicket(
      @Param('id') ticketId: string,
      @Body('title') ticketTitle: string,
      @Body('description') ticketDesc: string,
      @Body('date') ticketDate: string,
      @Body('status') ticketStatus: string,
      @Body('remarks') ticketRemarks: string,
      @Body('category') ticketCategory: [],
    ) {
      await this.productsService.updateTicket(ticketId, ticketTitle, ticketDesc, ticketDate,ticketStatus,ticketRemarks,ticketCategory);
      return "Ticket updated";
    }
  
    @Delete(':id')
    async removeProduct(@Param('id') prodId: string) {
        await this.productsService.deleteTicket(prodId);
        return "Ticket Deleted";
    }
  }