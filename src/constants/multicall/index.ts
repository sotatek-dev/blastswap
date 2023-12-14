import { ChainId } from '@blast/v2-sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.SEPOLIA]: '0xcA11bde05977b3631167028862bE2a173976CA11'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
