import { EntityRepository, Repository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
interface TransactionModel {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category_id: string
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find()
    
    const { outcome, income } = transactions.reduce((accumulator, transaction) => {
      switch (transaction.type) {
        case 'outcome':
          accumulator.outcome += Number(transaction.value)
          break;
        case 'income':
          accumulator.income += Number(transaction.value)
          break;
        default:
          break;
      }
      return accumulator;
    }, {
      income: 0,
      outcome: 0,
      total: 0
    });
    const total = income - outcome
    return {
      income,
      outcome,
      total
    }
  }
}

export default TransactionsRepository;
