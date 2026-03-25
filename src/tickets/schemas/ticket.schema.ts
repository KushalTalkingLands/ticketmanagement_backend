import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema()
export class Technician {
  @Prop({ required: true })
  name: string;

  @Prop()
  avatar?: string;
}

const TechnicianSchema = SchemaFactory.createForClass(Technician);

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
})
export class Ticket {
  @Prop({ required: true })
  title: string;

  @Prop()
  vehicle: string;

  @Prop({
    required: true,
    enum: ['open', 'in_progress', 'completed'],
    default: 'open',
  })
  status: 'open' | 'in_progress' | 'completed';

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: TechnicianSchema, _id: false })
  technician?: Technician;

  // Legacy / additional fields kept for compatibility
  @Prop()
  description?: string;

  @Prop()
  date?: string;

  @Prop()
  remarks?: string;

  @Prop()
  userRemarks?: string;

  @Prop()
  category?: unknown[];

  @Prop()
  ownerId?: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

