export class RandomClassValueConverter {
  public toView(value) {
    const random = Math.round(Math.random() * 3);
    switch (random) {
      case 0:
        return "p-primary";
      case 1:
        return "p-success";
      case 2:
        return "p-danger";
      case 3:
        return "p-warning";
    }
  }
}
