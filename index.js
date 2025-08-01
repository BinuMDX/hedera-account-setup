const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  TransferTransaction,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenAssociateTransaction,
} = require("@hashgraph/sdk");
require("dotenv").config();

async function environmentsetup() {
  //Grab your Hedera testnet account ID and private key from your
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;

  // If we weren't able to grab it, we should throw a new error
  if (!myAccountId || !myPrivateKey) {
    throw new Error(
      "Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present"
    );
  }

  //Create your Hedera Testnet client
const client = Client.forTestnet();
//Set your account as the client's operator
client. setOperator(myAccountId, myPrivateKey) ;
//Set the default maximum transaction fee (in Hbar)
client. setDefaultMaxTransactionFee( new Hbar( 100) ) ;
//Set the maximum payment for queries (in Hbar)
client. setMaxQueryPayment(new Hbar(50));


//Create new keys
const newAccountPrivateKey = PrivateKey.generateED25519() ;
const newAccountPublicKey = newAccountPrivateKey.publicKey;

const newAccount = await new AccountCreateTransaction( )
.setKey(newAccountPublicKey)
.setInitialBalance(Hbar.fromTinybars(1000))
.execute(client) ;

// Get the new account It)
const getReceipt = await newAccount.getReceipt(client);
const newAccountId =  getReceipt.accountId;

//log the account ID
console.log("new account ID is:" +newAccountId);

// Verify the account balance
const accountBatance = await new AccountBalanceQuery()
.setAccountId(newAccountId)
.execute(client);
console.log("new account balance is: " +accountBatance.hbars.toTinybars() +"tinybar.");

//Create the trans fer transaction
const sendHbar = await new TransferTransaction()
.addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000)) // Sending account
.addHbarTransfer(newAccountId, Hbar.fromTinybars(1000)) // 'Receiving account
.execute(client);

// Verify the transaction reached consensus
const transactionReceipt = await sendHbar.getReceipt(client);
console.log(" The transfer transaction from my account to the new account was: " + transactionReceipt.status.toString());

const supplyKey = PrivateKey.generate( );

// CREATE FUNGIBLE TOKEN (STABLECOIN)
let tokenCreateTx = await new TokenCreateTransaction()
.setTokenName('USD Bar')
.setTokenSymbol("USDB")
.setTokenType(TokenType.FungibleCommon)
.setDecimals(2)
.setInitialSupply(10000)
.setTreasuryAccountId (myAccountId)
.setSupplyType(TokenSupplyType.Infinite)
.setSupplyKey(supplyKey )
.freezeWith(client) ;

//SIGN WITH TREASURY KEY
let tokenCreateSign = await tokenCreateTx.sign(PrivateKey.fromString(myPrivateKey));

//SUBMIT THE TRANSACTION
let tokenCreateSubmit = await tokenCreateSign.execute(client) ;

//GET THE TRANSACTION RECEIPT
let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);

//GET THE TOKEN ID
let tokenId = tokenCreateRx.tokenId;

//LOG THE TOKEN ID TO THE CONSOLE
console.log('- Created token With ID: ${tokenId} \n' ) ;

const transaction = await new TokenAssociateTransaction()
.setAccountId(newAccountId)
.setTokenIds([tokenId])
.freezeWith(client)

const signTx = await transaction.sign(newAccountPrivateKey)

const txResponse = await signTx.execute(client)

const associationReceipt = await txResponse.getReceipt(client)

const transactionStatus = associationReceipt.status

console.log("Transaction of association was: " +transactionStatus)

const transferTransaction = await new TransferTransaction()
 .addTokenTransfer(tokenId, myAccountId, -10)
 .addTokenTransfer(tokenId, newAccountId, 10)
 .freezeWith(client)

 const signTransferTx = await transferTransaction.sign(PrivateKey.fromString(myPrivateKey))

 const transferTxResponse = await signTransferTx.execute(client)

 const transferReceipt = await transferTxResponse.getReceipt(client)

 const transferStatus = transactionReceipt.status

 console.log("the status of transfer token is: "+transferStatus)



}
environmentsetup();

