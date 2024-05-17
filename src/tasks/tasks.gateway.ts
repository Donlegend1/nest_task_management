import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class TasksGateway {
  @WebSocketServer()
  server: Server;

  handleTaskCreated(task: any) {
    this.server.emit('taskCreated', task);
  }

  handleTaskUpdated(task: any) {
    this.server.emit('taskUpdated', task);
  }

  handleTaskDeleted(task: any) {
    this.server.emit('taskDeleted', task);
  }
}
