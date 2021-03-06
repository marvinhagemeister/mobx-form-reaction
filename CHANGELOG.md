# Changelog

## 5.0.0

This release moves all validation logic into the `Validator` class. This was
something that was bugging me for a while, and didn't have time to think
about a proper solution for it. Thanks to a great tip by a co-worker, it is
much less work than I originally anticipated.

- **Breaking:** `field.errors` is now `field.validator.errors`.
- **Breaking:** `field._validating` which is now officially part of the public
  api and is moved to `field.validator.validating`.

## 4.1.1

- Prevent babel from transpiling `for-of` loops with generators.

## 4.1.0

- Add back support for `enforceActions` (previously called `useStrict()` in mobx)
- Add support for revisions for forms. This is great for dirty checking/syncing
- Make `validator`-property on `Field` non-private to allow setting Validators with circular references
- Add setter for `initial`-property and don't set it to false upon calling `setValue`. This is needed because ux requirements differ quite a bit about when a validation error should be shown to the user the first time

## 4.0.0

- **Breaking:** Rename package to `@marvinh/mobx-form-reactions`
- **Breaking:** Refactor validation logic to support proper cancellation and
  prevent race conditions for asynchronous validations. See the [Readme](./README.md) for more information
- **Breaking:** Removed `submit()` in favor of a simple getter `value`
- Add support for treeshaking
- autogenerate TypeScript bindings

## 3.4.2

- There could be a case where the `validating` flag wasn't reset properly after validation.
- Simplify submit code (only internal changes)

## 3.4.1

- Fix validation bug when only default value is set

## 3.4.0

Upgrade `mobx` to `3.1.0` which allows modifying non-observed members
without being wrapped with `action`. This is extremely useful
for initialization in constructors. Also up the version number
because the removal of `action` will now throw an error on older
versions of mobx.

## 3.3.4

- `required` validation should trim `strings`

## 3.3.3

- Bind `this` for all actions

## 3.3.2

- Fix missing action decorator in `FieldArray` validation

## 3.3.1

- Fix error when only setting `defaultValue` in `BooleanField` constructor
- Add `setDefaultValue` setter for `Field`

## 3.3.0

Add new `BooleanField` field class as a child class of `Field`. Only difference is
that its default value is `false`, the validator is set to `isBoolean` and
that it has a handgy `toggle()` method.

## 3.2.0

- Fix `defaultValue` not beeing used correctly if it was set to `false`
- Field `setValue` method changed to `setValue(value, skipValidation)`

Most fields in our use case are validated synchronously and this
was the expected behaviour for users here.

- all form classes respect the `disabled` status during submition and validation

## 3.1.0

- Add a few more validation methods that are used in most forms

## 3.0.0

- **Breaking Change**: Remove `SimpleForm`. State should be derived not synced
- Add `submit` and `validate` method for `FormGroup` and `FieldArray`

## 2.0.2

- Distribute as `ES5` package instead of `ES6`. Babel breaks on `extends` otherwise.
  See: https://github.com/babel/babel/issues/5208

## 2.0.1

- upgrade TypeScript version

## 2.0.0

- fields are now stored as an `Object` instead of an `Array` for easier retrieval
- `SimpleForm` class that can be used to sync with a model
- Improved typings

## 1.0.0

- initial Release
