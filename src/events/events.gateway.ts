import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(EventsGateway.name);
  constructor(
    private readonly eventsService: EventsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      client.data.user = payload; // Attach user payload to the socket instance
      this.logger.log(`Client connected: ${client.id}, user: ${payload.email}`);
    } catch (error) {
      this.logger.error('Authentication error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('events')
  async handleEvent(
    @MessageBody() data: CreateEventDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = client.data.user.sub;
    // Here you might want to decrypt and decompress data if needed
    await this.eventsService.createEvent(userId, data);
    // Optionally, you can broadcast the event to other clients or send an ack
  }
}
