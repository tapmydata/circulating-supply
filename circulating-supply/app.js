
const Web3 = require('web3')

let infura = "https://mainnet.infura.io/v3/aa5206162f4c4054b23539aa8dd1ae0f";
let tokenAddress = "0x7f1f2d3dfa99678675ece1c243d3f7bc3746db5d";
let wallets = [
    "0x4ee50ebf6cbc74eb40fa3bea97d0ba629ea8296f", // Reserve
    "0x902c72c925d84087fa4af974624bb831abf9e12b", // Reserve
    "0x7429f5bc84a2b473ad2f6abd13399014bf60e9cb", // Reserve
    "0xdbf72370021babafbceb05ab10f99ad275c6220a", // TrustSwap lock
    "0xcb0510d1c4ea88ccd1f2395d075af9e831c2f15d", // Deployer
    "0x57bbef693c457609de02db7e9ea541e6288afbd9", // Giveaway
    "0x86B738d26D791C76411bd32935416a5A37078ABD" // Swap
];

let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {

    const web3 = new Web3(infura)

    // The minimum ABI to get ERC20 Token balance
    let minABI = [
        // balanceOf
        {
        "constant":true,
        "inputs":[{"name":"_owner","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
        },
        // decimals
        {
        "constant":true,
        "inputs":[],
        "name":"decimals",
        "outputs":[{"name":"","type":"uint8"}],
        "type":"function"
        }
    ];

    let contract = new web3.eth.Contract(minABI,tokenAddress);
      
    async function getBalance() {
        let balance = 100000000;

        for (var i = 0; i < wallets.length; i++) {
            balance -= Web3.utils.fromWei((await contract.methods.balanceOf(wallets[i]).call()).toString());
        }
        
        return balance;
    }
    
    response = {
        'statusCode': 200,
        'body': (await getBalance()).toString()
    }

    return response
};
