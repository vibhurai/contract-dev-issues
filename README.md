# NEAR Protocol Contract development issues

## Issues:

1. `Task`: Create an account via RPC (Remote Procedural Calls) and deploy a contract on the account and initialise the contract.

`Issue`: Account gets created, the contract is deployed successfully but the function call gives a deserialization error
`Log`: "Error while deserilalizing the module"

2. `Task`: Delete the previously created account via RPCs

`Issue`: I tried the following 3 approaches to do this task, (but none of them worked giving an "ActorNoPermission" error)

    1.  Revoking the access-key of the sub account and then deleting the account.

    2.  Deleting the account without revoking the access key of the sub account.

    3.  Creating and deleting the account in one promise itself.

`Log`: Sample Transaction link: **https://explorer.testnet.near.org/transactions/5WgGzPmCnUWUWeSEktfAEoLmhyyemTkZyA4d5WwXHYm7**

## Contract

```ts
// ------------------------------------
// contract initialization
// ------------------------------------

/**
 * initialize contract with owner ID and other config data
 *
 * (note: this method is called "constructor" in the singleton contract code)
 */
function init(owner: AccountId, allow_anonymous: bool = true): void;

// ------------------------------------
// public methods
// ------------------------------------

/**
 * the method creating an account and deploying contract via RPCs
 */
function log(): void;
```

## Usage

### Development

To deploy the contract for development, follow these steps:

1. Clone this repo locally.
2. Run `yarn` to install dependencies.
3. Run `yarn dev-dep` to deploy the contract (this uses `near dev-deploy`).
4. Run `export CONTRACT=<the ID of your dev account>`.
5. You can also deploy the contract to a specified account by using `yarn dep`.
6. Execute this command for initiliazing the contract

```sh
 near call $CONTRACT init '{"owner":"'$CONTRACT'"}' --accountId $CONTRACT
```

**Your contract is now ready to use.**

To use the contract you can do any of the following:

_Public commands_

- Command description

  ```sh
  near call $CONTRACT <function name> <'{"key": "value>"}'> --accountId <your account ID>
  ```

_Owner commands_

- Command description

  ```sh
  near call $CONTRACT <function name> <'{"key": "value>"}'> --accountId <your account ID>
  ```
