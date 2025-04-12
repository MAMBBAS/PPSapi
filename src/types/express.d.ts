import { User } from '../users/entities/user.entity'; // Импортируйте ваш тип пользователя

declare global {
  namespace Express {
    interface Request {
      user?: User; // Добавляем свойство user в Request
    }
  }
}
