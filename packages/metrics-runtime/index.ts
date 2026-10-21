export class MetricsRuntime {
  private metrics = new Map<string, number>();

  track(metric: string, value: number) {
    this.metrics.set(metric, value);

    console.log(`[METRIC] ${metric}: ${value}`);
  }

  get(metric: string) {
    return this.metrics.get(metric);
  }
}