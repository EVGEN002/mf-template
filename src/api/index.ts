import request from '@/api/axios';

import Todo from '@/types/Todo';

export const getTodos = () => request.get<Todo[]>('todos/1');
