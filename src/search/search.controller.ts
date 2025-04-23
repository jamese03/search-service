import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Person } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

@Controller('search')
export class SearchController {

  constructor(private readonly searchService: SearchService) {
  }

  @Get()
  async getByName(@Query('name') name?: string,
                  @Query('age') age?: string,
                  @Query('country') country?: string,
                  @Query('page') page: number = 1,
                  @Query('pageSize') pageSize: number = 5) {

    const must: Record<string, any>[] = [];
    if (name) {
      must.push({ match_phrase_prefix: { name } });
    }
    if (age) {
      must.push({ match: { age: parseInt(age) } });
    }
    if (country) {
      must.push({ match_phrase_prefix: { country } });
    }

    return await this.searchService.searchData('person', must, page, pageSize);
  }

  @Post('/create')
  async createPerson(@Body() person: Person) {
    const id = uuidv4();
    await this.searchService.indexData('person', id, person);
    return { message: 'Person added to elastic search index successfully', id };
  }

  @Post('/create/dummy-data')
  async createDummyData(@Body() body: { count: number }) {
    return await this.searchService.createDummyData(body.count);
  }
}
