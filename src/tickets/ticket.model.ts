import * as mongoose from 'mongoose';

export const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true},
  remarks: { type: String},
});

export interface Ticket extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  date: string;
  status: string;
  remarks: string;
}