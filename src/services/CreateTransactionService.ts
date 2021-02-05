interface Request {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string
}

// import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError'
import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository)
    const categoryRepository = getRepository(Category)
    const balance = await transactionsRepository.getBalance()
    console.log(balance);
    
    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Insuficient balance')
    }

    let transactionCategory = await categoryRepository.findOne({ where: { title: category } })
    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(transactionCategory)
    }
    
    
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: transactionCategory.id,
    })
    console.log(transaction);

    await transactionsRepository.save(transaction)
    return (transaction)
  }
}

export default CreateTransactionService;
