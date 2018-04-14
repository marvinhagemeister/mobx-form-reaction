import * as t from "assert";
import { toJS } from "mobx";
import { asyncIsHello, isHello } from "./helpers";
import { Field } from "../Field";
import { FormGroup } from "../FormGroup";
import { FieldArray } from "../FieldArray";
import { FieldStatus, AsyncValidateFn } from "..";

describe("FormGroup", () => {
  it("should initialize via constructor", () => {
    const fa = new Field();
    const fb = new Field();
    const form = new FormGroup({ fa, fb });

    t.equal(form.status, FieldStatus.VALID);

    const form2 = new FormGroup(
      {},
      {
        disabled: true,
        sync: [(value: any) => undefined],
      },
    );

    t.equal(form2.disabled, true);
  });

  it("should return valid if fields are valid", () => {
    const fa = new Field();
    const fb = new Field();
    const form = new FormGroup({ fa, fb });

    t.equal(form.status, FieldStatus.VALID);
  });

  it("should return invalid if one field is invalid", async () => {
    const fa = new Field();
    const fb = new Field({ sync: [isHello] });
    const form = new FormGroup({ fa, fb });

    fb.setValue("yes");

    const valid = await form.validate();
    t.equal(form.status, FieldStatus.INVALID);
  });

  it("should getField by name", () => {
    const fa = new Field();
    const fb = new Field();
    const form = new FormGroup({ fa, fb });

    t.equal(form.fields.fa === fa, true);
  });

  it("should reset the FormGroup", async () => {
    const foo = new Field({ sync: [isHello] });
    const form = new FormGroup({ foo });

    foo.setValue("nope");

    const valid = await form.validate();
    t.equal(form.status, FieldStatus.INVALID);
    t.deepEqual(form.errors, {});
    t.deepEqual(toJS(foo.errors), ["hello"]);

    await form.reset();

    t.equal(form.status, FieldStatus.INVALID);
    t.deepEqual(form.errors, {});
    t.deepEqual(foo.errors, []);
  });

  it("should handle pending validation", async () => {
    const validator: AsyncValidateFn<any> = () =>
      new Promise(res => setTimeout(res, 10));

    const foo = new Field();
    const form = new FormGroup({ foo }, { async: [validator] });

    t.equal(form.status, FieldStatus.VALID);
    foo.setValue("");
    const p = form.validate();
    t.equal(form.status, FieldStatus.PENDING);

    await p;
    t.equal(form.status, FieldStatus.VALID);
  });

  it("should get values", () => {
    const form = new FormGroup({
      bar: new FormGroup({
        name: new Field({ value: "value2" }),
      }),
      baz: new FieldArray([new Field({ value: "value3" })]),
      foo: new Field({ value: "value1" }),
    });

    const form2 = new FormGroup({
      bar: new FormGroup({
        name: new Field({ value: "value2" }),
      }),
      baz: new FieldArray([new Field({ value: "value3" })]),
      foo: new Field({ value: "value1" }),
    });

    t.deepEqual(form.value, {
      bar: {
        name: "value2",
      },
      baz: ["value3"],
      foo: "value1",
    });
  });

  it("should set disabled", () => {
    const form = new FormGroup({});
    t.equal(form.disabled, false);
    form.setDisabled(true);
    t.equal(form.disabled, true);
  });

  it("should not include disabled fields", () => {
    const form = new FormGroup({
      bar: new FieldArray([], { disabled: true }),
      baz: new FormGroup({}, { disabled: true }),
      foo: new Field({ disabled: true }),
    });

    t.deepEqual(form.value, {});
  });

  it("should return empty object if disabled", () => {
    const form = new FormGroup(
      {
        foo: new Field(),
      },
      { disabled: true },
    );
    t.deepEqual(form.value, {});
  });

  it("should skip disabled fields in validation", () => {
    const field = new Field({
      value: "foo",
      disabled: true,
      sync: [isHello],
    });
    field.setValue("nope");

    const form = new FormGroup({
      bar: new FieldArray([field]),
      baz: new FormGroup({ foo: field }, { disabled: true }),
      foo: field,
    });

    t.equal(form.status, FieldStatus.VALID);
  });

  it("should set validating flag", async () => {
    const field = new Field({
      value: "foo",
      async: [asyncIsHello],
    });

    const form = new FormGroup({
      bar: new FieldArray([field]),
      baz: new FormGroup({ foo: field }),
      foo: field,
    });

    field.setValue("nope");
    const p = form.validate();
    t.equal(form.status, FieldStatus.PENDING);

    await p;
    t.equal(form.status, FieldStatus.INVALID);
  });
});
