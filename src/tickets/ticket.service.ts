import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Ticket } from './ticket.model';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel('Ticket') private readonly  ticketModel: Model<Ticket>,
  ) {}

  async addTickets(title: string, desc: string,date:string,status:string,remarks:string,category:[]) {
    const newTicket = new this.ticketModel({
      title,
      description: desc,
      date,
      status,
      category,
      remarks,
    });
    const result = await newTicket.save();
    return result.id as string;
  }

  async getTickets() {
    const tickets = await this.ticketModel.find().exec();
    return tickets.map(prod => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      date: prod.date,
      status: prod.status,
      remarks: prod.remarks,
      category: prod.category,
    }));
  }

  async getSingleTicket(productId: string) {
    const ticket = await this.findProduct(productId);
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      date: ticket.date,
      status: ticket.status,
      category: ticket.category,
    };
  }

  async updateTicket(
    productId: string,
    title: string,
    desc: string,
    date: string,
    status:string,
    remarks: string,
    category:[],
  ) {
    const updatedProduct = await this.findProduct(productId);
    // if (title) {
    //   updatedProduct.title = title;
    // }
    // if (desc) {
    //   updatedProduct.description = desc;
    // }
    if (status) {
      updatedProduct.status = status;
    }
    if (remarks) {
        updatedProduct.remarks = remarks;
      }
    updatedProduct.save();
  }

  async deleteTicket(prodId: string) {
    const result = await this.ticketModel.deleteOne({_id: prodId}).exec();
    console.log(result);
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find Ticket.');
    }
  }

  private async findProduct(id: string): Promise<Ticket> {
    let ticket;
    try {
      ticket = await this.ticketModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find ticket.');
    }
    if (!ticket) {
      throw new NotFoundException('Could not find ticket.');
    }
    return ticket;
  }
}