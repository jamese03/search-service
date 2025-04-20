import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { Person } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

@Controller('search')
export class SearchController {

  constructor(private readonly searchService : SearchService) {}

  @Get("/:name")
  async getByName(@Param('name') name: string){
    const searchQuery = {
      query: {
        match_phrase_prefix: {name: name},
      },
    };
    return await this.searchService.searchData('person', searchQuery);
  }

  @Post('/create')
  async createPerson(@Body() person: Person) {
    const id = uuidv4();
    await this.searchService.indexData('person', id, person);
    return {message: 'Person added to elastic search index successfully', id}
  }

  @Post('/create/dummy-data')
  async createDummyData(@Body() body: {count: number}){
    return await this.searchService.createDummyData(body.count);
  }
}
