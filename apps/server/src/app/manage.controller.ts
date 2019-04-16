import {BaseController} from './base.controller';
import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {ITofRequest} from './models/tof-request';
import {ISocketConnection} from './models/socket-connection';
import {AuthGuard} from '@nestjs/passport';

interface MessageRequest {
  message: string;
}

@Controller('manage')
@UseGuards(AuthGuard('bearer'))
export class ManageController extends BaseController {
  constructor() {
    super();
  }

  @Get('user/active')
  getActiveUsers(@Req() request: ITofRequest) {
    const connections = request.ioConnections.map((connection: ISocketConnection) => {
      let name;

      if (connection.practitioner && connection.practitioner.name && connection.practitioner.name.length > 0) {
        name = connection.practitioner.name[0].family;

        if (connection.practitioner.name[0].given && connection.practitioner.name[0].given.length > 0) {
          if (name) {
            name += ', ';
          }

          name += connection.practitioner.name[0].given.join(' ');
        }
      }

      return {
        socketId: connection.id,
        userId: connection.userProfile ? connection.userProfile.user_id : null,
        email: connection.userProfile ? connection.userProfile.email : null,
        practitionerReference: connection.practitioner ? `Practitioner/${connection.practitioner.id}` : null,
        name: name
      };
    });

    return connections;
  }

  @Post('user/active/message')
  sendMessageToActiveUsers(@Req() request: ITofRequest, @Body() body: MessageRequest) {
    this.assertAdmin(request);
    request.io.emit('message', body.message);
  }
}
