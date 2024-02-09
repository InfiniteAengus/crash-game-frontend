export {};

declare global {
  export interface IPlayer {
    name: string;
    address: string;
    cashPoint: number;
    betAmount: number;
    bonus: number;
    chain: TCoin;
  }
}
