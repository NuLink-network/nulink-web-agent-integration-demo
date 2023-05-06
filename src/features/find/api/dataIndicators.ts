import { post } from '@/lib/request'

export const getTotalData = async () => await post('/total');
