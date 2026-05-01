export const privateGrantVaultAbi = [
  {
    type: "function",
    name: "createCampaign",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "token", type: "address" },
      { name: "confidentialToken", type: "address" },
      { name: "category", type: "string" },
      { name: "publicBudget", type: "uint256" },
      { name: "deadline", type: "uint64" },
      { name: "auditor", type: "address" }
    ],
    outputs: [{ name: "id", type: "uint256" }]
  },
  {
    type: "function",
    name: "registerConfidentialToken",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "confidentialToken", type: "address" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "shieldCampaignFunds",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "confidentialAmountHandle", type: "bytes32" }]
  },
  {
    type: "function",
    name: "sendConfidentialPayout",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "recipient", type: "address" },
      { name: "encryptedAmount", type: "bytes32" },
      { name: "inputProof", type: "bytes" },
      { name: "memo", type: "string" }
    ],
    outputs: [{ name: "confidentialTransferRef", type: "bytes32" }]
  },
  {
    type: "function",
    name: "recordPayout",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "recipient", type: "address" },
      { name: "confidentialTransferRef", type: "bytes32" },
      { name: "memo", type: "string" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "grantAuditorForPayout",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "payoutIndex", type: "uint256" },
      { name: "auditor", type: "address" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "revokeCampaignAuditor",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "closeCampaign",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "getCampaign",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "sponsor", type: "address" },
          { name: "token", type: "address" },
          { name: "confidentialToken", type: "address" },
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "category", type: "string" },
          { name: "publicBudget", type: "uint256" },
          { name: "deadline", type: "uint64" },
          { name: "createdAt", type: "uint64" },
          { name: "auditor", type: "address" },
          { name: "isActive", type: "bool" }
        ]
      }
    ]
  },
  {
    type: "function",
    name: "payoutCount",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "getPayout",
    stateMutability: "view",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "payoutIndex", type: "uint256" }
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "recipient", type: "address" },
          { name: "operator", type: "address" },
          { name: "confidentialTransferRef", type: "bytes32" },
          { name: "memo", type: "string" },
          { name: "createdAt", type: "uint64" }
        ]
      }
    ]
  },
  {
    type: "event",
    name: "CampaignCreated",
    inputs: [
      { indexed: true, name: "id", type: "uint256" },
      { indexed: true, name: "sponsor", type: "address" },
      { indexed: true, name: "token", type: "address" },
      { indexed: false, name: "confidentialToken", type: "address" },
      { indexed: false, name: "name", type: "string" },
      { indexed: false, name: "category", type: "string" },
      { indexed: false, name: "publicBudget", type: "uint256" },
      { indexed: false, name: "deadline", type: "uint64" },
      { indexed: false, name: "auditor", type: "address" }
    ]
  },
  {
    type: "event",
    name: "FundsShielded",
    inputs: [
      { indexed: true, name: "id", type: "uint256" },
      { indexed: true, name: "sponsor", type: "address" },
      { indexed: true, name: "token", type: "address" },
      { indexed: false, name: "confidentialToken", type: "address" },
      { indexed: false, name: "publicAmount", type: "uint256" },
      { indexed: false, name: "confidentialAmountHandle", type: "bytes32" }
    ]
  },
  {
    type: "event",
    name: "ConfidentialPayoutSent",
    inputs: [
      { indexed: true, name: "id", type: "uint256" },
      { indexed: true, name: "sponsor", type: "address" },
      { indexed: true, name: "recipient", type: "address" },
      { indexed: false, name: "confidentialToken", type: "address" },
      { indexed: false, name: "confidentialTransferRef", type: "bytes32" },
      { indexed: false, name: "memo", type: "string" }
    ]
  },
  {
    type: "event",
    name: "AuditorGranted",
    inputs: [
      { indexed: true, name: "id", type: "uint256" },
      { indexed: true, name: "auditor", type: "address" },
      { indexed: true, name: "handle", type: "bytes32" }
    ]
  },
  {
    type: "event",
    name: "CampaignClosed",
    inputs: [
      { indexed: true, name: "id", type: "uint256" },
      { indexed: true, name: "sponsor", type: "address" }
    ]
  }
] as const;

export const erc20Abi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "mint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }]
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }]
  }
] as const;

export const erc7984Abi = [
  {
    type: "function",
    name: "setOperator",
    stateMutability: "nonpayable",
    inputs: [
      { name: "operator", type: "address" },
      { name: "until", type: "uint48" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "isOperator",
    stateMutability: "view",
    inputs: [
      { name: "holder", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    type: "function",
    name: "confidentialBalanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "bytes32" }]
  },
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }]
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }]
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }]
  }
] as const;
