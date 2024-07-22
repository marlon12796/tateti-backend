import { Test, TestingModule } from '@nestjs/testing';
import { TatetiSocketGateway } from './tateti-socket.gateway';

describe('TatetiSocketGateway', () => {
  let gateway: TatetiSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TatetiSocketGateway],
    }).compile();

    gateway = module.get<TatetiSocketGateway>(TatetiSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
