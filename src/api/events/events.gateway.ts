import { Injectable, Scope } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { LogType } from '../logger/interfaces/log.interface';

import { ConnectionInterface } from './interfaces/connection.interface';

@Injectable({ scope: Scope.DEFAULT })
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayDisconnect, OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Server;

  private connections: ConnectionInterface[] = [];

  public handleConnection(client: any): void {
    this.connections.push({
      id: client.id,
    });
  }

  public handleDisconnect(client: any): void {
    this.connections = this.connections.filter((conn) => conn.id !== client.id);
  }

  public emitLog(log: LogType) {
    this.server.emit(`logs`, log);
  }
}
