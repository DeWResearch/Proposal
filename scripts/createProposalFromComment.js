// scripts/createProposalFromComment.js
import { Wallet, providers } from 'ethers'
import { Client } from '@aragon/sdk-client'

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

  const signer = new Wallet(privateKey, new providers.JsonRpcProvider(rpcUrl))

  const client = new Client({
    network: 'sepolia',
    signer,
  })

  const proposal = await client.proposals.create({
    daoAddress,
    metadata: {
      title: `Proposal by @${commentAuthor}`,
      summary: proposalText,
    },
    actions: [] // 无链上执行，只是描述
  })

  console.log('✅ Proposal created:', proposal)
}

main().catch(err => {
  console.error('❌ Error creating proposal:', err)
  process.exit(1)
})
