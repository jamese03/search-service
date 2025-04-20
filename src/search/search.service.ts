import { Injectable } from '@nestjs/common';
import { Person } from '../types/types';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import { ages, countries, firstNames, lastNames } from '../dummy-data/names-ages-countries';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SearchService {
  private client: Client;
  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      node: this.configService.get('ELASTIC_SEARCH_NODE') || 'http://localhost:9200'
    });
  }

  async indexData(index: string, id: string, body: any) {
    return this.client.index({
      index, id, body
    });
  }

  async searchData(index: string, query: object) {
    return this.client.search({
      index: index,
      body: query,
    })
  }

  async bulkIndexPersons(index: string, persons: Person[]) {
    const operations = persons.flatMap((person) => [
      { index: { _index: index, _id: uuidv4() } },
      person,
    ]);

    return await this.client.bulk({
      refresh: true,
      body: operations,
    });
  }

  async createDummyData(count: number) {
    const people: Person[] = [];
      for(let i = 0; i < count; i++) {
        const person = this.generateRandomPerson();
        people.push(person);
      }
    return await this.bulkIndexPersons('person', people);
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  generateRandomPerson(): Person {
    const firstName = firstNames[this.getRandomInt(0, 49)];
    const lastName = lastNames[this.getRandomInt(0, 49)];
    const country = countries[this.getRandomInt(0,49)];
    const age = ages[this.getRandomInt(0, 49)];
    return {
      name: firstName + " " + lastName,
      country: country,
      age: age,
    };
  }

}
