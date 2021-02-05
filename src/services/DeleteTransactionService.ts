// import AppError from '../errors/AppError';

import { getCustomRepository } from "typeorm";


import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from "../errors/AppError";

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {

    [, id] = id.split(':')
    const transactionsRepository = getCustomRepository(TransactionsRepository)
    const transaction = await transactionsRepository.findOne(id)
    if(!transaction) {
      throw new AppError("This transaction doesn't exists")
    }
    await transactionsRepository.remove(transaction)
  }
}

export default DeleteTransactionService;
