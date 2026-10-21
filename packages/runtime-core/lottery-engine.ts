export type LotteryResult = {
  room: string;
  number: string;
  payout: number;
};

export function calculateResult(
  room: string,
  payoutRate: number
): LotteryResult {

  const random =
    Math.floor(
      Math.random() * 1000
    )
    .toString()
    .padStart(3, "0");

  return {
    room,
    number: random,
    payout: payoutRate,
  };

}