// scripts/createProposalFromComment.js
import { Wallet, JsonRpcProvider } from 'ethers'
import aragon from '@aragon/sdk-client'
const { Client, Context, ContextParams } = aragon

const commentBody = process.env.COMMENT_BODY
const commentAuthor = process.env.COMMENT_AUTHOR
const daoAddress = process.env.DAO_ADDRESS
const privateKey = process.env.PRIVATE_KEY
const rpcUrl = process.env.RPC_URL

function extractProposalText(comment) {
  const match = comment.match(/#proposal\s+([\s\S]*)/i)
  return match ? match[1].trim() : null
}

async function main() {
  const proposalText = extractProposalText(commentBody)
  if (!proposalText) {
    console.log('No valid #proposal found in comment.')
    return
  }

  const provider = new JsonRpcProvider(rpcUrl)
  const signer = new Wallet(privateKey, provider)
  const contextParams = {
  network: "sepolia",
  web3Providers: "https://developer.metamask.io/",
  signer,
};

  const context = new Context(contextParams);
  const client = new Client(context)

  const proposal = await client.proposals.create({
      daoAddress,
      metadata: {
        title: `Proposal by @${commentAuthor}`,
        summary: proposalText,
      },
      actions: [] 
  })

  console.log('Proposal created:', proposal)
}

main().catch(err => {
  console.error('Error creating proposal:', err)
  process.exit(1)
})
