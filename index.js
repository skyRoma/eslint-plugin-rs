/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
