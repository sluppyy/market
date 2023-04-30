export class Order {
  constructor(
    readonly id: string,
    readonly creationTime: Date,
    readonly changeTime: Date,
    readonly status: 'active' | 'filled' | 'canceled' | 'rejected',
    readonly side: 'buy' | 'sell',
    readonly price: number,
    readonly amount: number,
    readonly instrument: string
  ) {}

  copy(data: Partial<Omit<Order, 'copy'>>) {
    return new Order(
      data.id ?? this.id,
      data.creationTime ?? this.creationTime,
      data.changeTime ?? this.changeTime,
      data.status ?? this.status,
      data.side ?? this.side,
      data.price ?? this.price,
      data.amount ?? this.amount,
      data.instrument ?? this.instrument
    )
  }
}
