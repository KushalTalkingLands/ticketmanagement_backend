import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Ticket, TicketDocument } from './schemas/ticket.schema';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel('Ticket') private readonly ticketModel: Model<TicketDocument>,
  ) {}

  async addTickets(
    title: string,
    desc: string,
    vehicle: string,
    date: string,
    status: string,
    remarks: string,
    category: [],
    ownerId: string,
  ) {
    const newTicket = new this.ticketModel({
      title,
      description: desc,
      vehicle,
      date,
      status,
      category,
      remarks,
      ownerId,
    });
    const result = await newTicket.save();
    return result.id as string;
  }

  async getTicketsForUser(ownerId: string) {
    const tickets = await this.ticketModel.find({ ownerId }).exec();
    return tickets.map((ticket) => ({
      id: ticket._id.toString(),
      title: ticket.title,
      description: ticket.description,
      date: ticket.date,
      status: ticket.status,
      remarks: ticket.remarks,
      category: ticket.category,
      userRemarks: ticket.userRemarks,
      vehicle: ticket.vehicle,
      createdAt: ticket.createdAt,
      technician: ticket.technician,
      ownerId: ticket.ownerId.toString(),
    }));
  }

  async getAllTickets() {
    const tickets = await this.ticketModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
    return tickets.map((ticket) => ({
      id: ticket._id.toString(),
      title: ticket.title,
      description: ticket.description,
      date: ticket.date,
      status: ticket.status,
      remarks: ticket.remarks,
      category: ticket.category,
      userRemarks: ticket.userRemarks,
      vehicle: ticket.vehicle,
      createdAt: ticket.createdAt,
      technician: ticket.technician,
      ownerId: ticket.ownerId ? ticket.ownerId.toString() : undefined,
    }));
  }

  async getSingleTicket(productId: string) {
    const ticket = await this.findProduct(productId);
    return {
      id: ticket._id.toString(),
      title: ticket.title,
      description: ticket.description,
      date: ticket.date,
      status: ticket.status,
      category: ticket.category,
      remarks: ticket.remarks,
      userRemarks: ticket.userRemarks,
      ownerId: ticket.ownerId ? ticket.ownerId.toString() : undefined,
    };
  }

  async findAll(): Promise<TicketDocument[]> {
    return this.ticketModel.find().sort({ createdAt: -1 }).exec();
  }

  async updateStatus(
    id: string,
    status: 'open' | 'in_progress' | 'completed',
    technician?: Ticket['technician'],
  ): Promise<TicketDocument> {
    const update: Partial<Ticket> = { status };
    if (technician) {
      update.technician = technician;
    }

    const updated = await this.ticketModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Could not find ticket.');
    }

    return updated;
  }

  async deleteTicket(prodId: string) {
    const result = await this.ticketModel.deleteOne({_id: prodId}).exec();
    console.log(result);
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find Ticket.');
    }
  }

  private async findProduct(id: string): Promise<TicketDocument> {
    let ticket: TicketDocument | null;
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