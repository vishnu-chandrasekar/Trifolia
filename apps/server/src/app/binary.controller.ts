import {BaseFhirController} from './base-fhir.controller';
import {Body, Controller, Delete, Get, HttpService, Logger, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {ITofRequest} from './models/tof-request';
import {AuthGuard} from '@nestjs/passport';

@Controller('binary')
@UseGuards(AuthGuard('bearer'))
export class BinaryController extends BaseFhirController {
  resourceType = 'Binary';
  
  protected readonly logger = new Logger(BinaryController.name);
  
  constructor(protected httpService: HttpService) {
    super(httpService);
  }

  @Get()
  public search(@Req() request: ITofRequest, query?: any): Promise<any> {
    return super.baseSearch(request.fhirServerBase, query);
  }

  @Get(':id')
  public get(@Req() request: ITofRequest, @Param('id') id: string) {
    return super.baseGet(request.fhirServerBase, id, request.query);
  }

  @Post()
  public create(@Req() request: ITofRequest, @Body() body) {
    return super.baseCreate(request.fhirServerBase, body, request.query);
  }

  @Put(':id')
  public update(@Req() request: ITofRequest, @Param('id') id: string, @Body() body) {
    return super.baseUpdate(request.fhirServerBase, id, body, request.query);
  }

  @Delete()
  public delete(@Req() request: ITofRequest, @Param('id') id: string) {
    return super.baseDelete(request.fhirServerBase, id, request.query);
  }
}