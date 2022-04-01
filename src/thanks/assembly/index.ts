import { base58 } from "near-sdk-as";
import { Context, ContractPromiseBatch, logging, u128 } from "near-sdk-core"
import { AccountId, ONE_NEAR, XCC_GAS, assert_self, assert_single_promise_success } from "../../utils"

// max 5 NEAR accepted to this contract before it forces a transfer to the owner
const CONTRIBUTION_SAFETY_LIMIT: u128 = u128.mul(ONE_NEAR, u128.from(5));

@nearBindgen
class init_call {
  master: AccountId;
}

@nearBindgen
export class Contract {
  private owner: AccountId
  private allow_anonymous: bool

  constructor(owner: AccountId, allow_anonymous: bool = true) {
    this.owner = owner
    this.allow_anonymous = allow_anonymous
  }


  log(): void {
    logging.log(this.owner);

    const access_key = base58.decode(Context.senderPublicKey);
    logging.log(access_key);

    const CODE_THANKS = base58.decode("build/release/thanks.wasm");

    logging.log(Context.epochHeight.toString() + this.owner);

    // account creation
    ContractPromiseBatch
      .create("kust" + "." + this.owner)
      .create_account()
      .transfer(ONE_NEAR)
      .add_full_access_key(access_key)
      .deploy_contract(CODE_THANKS)
      .then("kust" + "." + this.owner)
      .function_call<init_call>
      (
        "init",
        { "master": this.owner },
        u128.Zero,
        XCC_GAS
      );

    // account deletion method 1
    ContractPromiseBatch
      .create("kust" + "." + this.owner)
      .delete_key(access_key)
      .delete_account(this.owner);

    // account deletion method 2
    ContractPromiseBatch
      .create("kust" + "." + this.owner)
      .delete_key(access_key)
      .delete_account(this.owner);

    // account creation and deletion in one promise
    ContractPromiseBatch
      .create("anything" + "." + this.owner)
      .create_account()
      .transfer(ONE_NEAR)
      .add_full_access_key(access_key)
      .deploy_contract(CODE_THANKS)
      .delete_account(this.owner);
  }

}