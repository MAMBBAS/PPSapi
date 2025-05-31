import { ApiProperty } from '@nestjs/swagger';
import { TransactionResponseDto } from './transaction-response.dto';

export class TransferResponseDto {
  @ApiProperty({
    description: 'Исходящая транзакция',
    type: TransactionResponseDto,
  })
  outgoingTransaction: TransactionResponseDto;
  
  @ApiProperty({
    description: 'Входящая транзакция',
    type: TransactionResponseDto,
  })
  incomingTransaction: TransactionResponseDto;
  
  @ApiProperty({
    example: '2023-05-10T12:00:00Z',
    description: 'Дата выполнения перевода',
  })
  transferDate: Date;
}
