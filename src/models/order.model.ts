export interface Order {

    id?: number;
    userId: number;
    totalAmount: number;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';

};