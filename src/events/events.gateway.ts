import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventsService } from './events.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly eventsService: EventsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      client.data.user = payload; // Attach user payload to the socket instance
      console.log(`Client connected: ${client.id}, user: ${payload.email}`);
    } catch (error) {
      console.error('Authentication error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('events')
  async handleEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = client.data.user.sub;
    // Here you might want to decrypt and decompress data if needed
    await this.eventsService.createEvent(userId, data);
    // Optionally, you can broadcast the event to other clients or send an ack
  }
}
