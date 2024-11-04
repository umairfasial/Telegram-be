import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    // Handle user connection
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, message: { chatId: string; content: string; senderId: string }) {
    // Save the message in the database and broadcast it to the participants
    this.server.to(message.chatId).emit('newMessage', message);
  }
}
