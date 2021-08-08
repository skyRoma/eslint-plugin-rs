const a = 3;
const testString = `${3} apples`;

const message = 'Hello World!';
console.log('Hello');
console.log(message);

class Test {
  @testDecorator()
  prop;
}

it('should change appTooltip disabled prop based on dimensions', () => {
  expect(isTooltipDisabled(divEl)).toEqual(true);

  const BIGGER_VALUE = 2;
  const SMALLER_VALUE = 1;
  changeDimensions(BIGGER_VALUE, SMALLER_VALUE);

  divEl.triggerEventHandler('mouseenter', null);
  fixture.detectChanges();

  expect(isTooltipDisabled(divEl)).toEqual(false);
  expect(isTooltipDisabled(divEl)).toEqual(true);

  changeDimensions(SMALLER_VALUE, BIGGER_VALUE);
  const a = 2;
  divEl.triggerEventHandler('mouseenter', null);
  fixture.detectChanges();

  expect(isTooltipDisabled(divEl)).toEqual(false);
});

class UserModel {
  firstName: string;
  lastName: string;
  age: number;

  increaseAge(years: number): void {
    this.age += years;
  }

  getProfileTitle(): string {
    return `User ${this.firstName} ${this.lastName} is ${this.age} years old`;
  }
}

function printQuiz(questions) {
  questions.forEach(question => {
    console.log(question.description);

    switch (question.type) {
      case 'boolean':
        console.log('1. True');
        console.log('2. False');
        break;
      case 'multipleChoice':
        question.options.foreach((option, index) => {
          console.log(`${index + 1}. ${option}`);
        });
        break;
      case 'text':
        console.log(`Answer:__________`);
        break;
    }
    console.log('');
  });
}

function drawShape(shape: Shape): void {
  if (shape instanceof Square) {
    this.drawSquare(shape as Square);
  } else {
    this.drawCircle(shape as Circle);
  }
}

class Turret extends Entity {
  constructor(name, attackDamage) {
    super(name, attackDamage, -1);
  }
  move() {
    return null;
  }
  takeDamage() {
    return null;
  }
}

class Store {
  paymentProcessor: PayPalPaymentProcessor;
  constructor(paymentProcessor: PayPalPaymentProcessor) {
    this.paymentProcessor = paymentProcessor;
  }
  purchaseBike(quantity) {
    this.paymentProcessor.pay(200 * quantity);
  }
  purchaseHelmet(quantity) {
    this.paymentProcessor.pay(15 * quantity);
  }
}

class PayPalPaymentProcessor {
  payPal;
  user;
  constructor(user) {
    this.user = user;
    this.payPal = new PayPal();
  }
  pay(amountInDollars) {
    this.payPal.makePayment(this.user, amountInDollars * 2.54);
  }
}
