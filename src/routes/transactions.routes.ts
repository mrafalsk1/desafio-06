import { Router } from 'express';
import multer from 'multer'
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import { getCustomRepository, getRepository } from 'typeorm';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import uploadConfig from '../config/upload'
import Category from '../models/Category';

interface Transaction {
  title: string,
  value: number,
  type: string
  category: Category,
  created_at: Date,
  updated_at: Date
}

const upload = multer(uploadConfig)
const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find({
    relations: ['category']
  }
  );
  // const finalTransactions: Transaction[] = []
  // transactions.forEach(async element => {
  //   const sameCategory = await categoriesRepository.findOne({ id: element.category_id });
  //   finalTransactions.push({
  //     title: element.title,
  //     value: element.value,
  //     type: element.type,
  //     created_at: element.created_at,
  //     updated_at: element.updated_at,
  //     category: sameCategory,
  //   })
  // });

  const balance = await transactionsRepository.getBalance()
  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body

  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category
  })

  response.json(transaction)
});

transactionsRouter.delete('/:id', async (request, response) => {
  const deleteTransactionService = new DeleteTransactionService();
  const id = request.params.id
  await deleteTransactionService.execute(id)
  response.send({ ok: true })

});

transactionsRouter.post('/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute(request.file.path);

    return response.json(transactions)
  });

export default transactionsRouter;
