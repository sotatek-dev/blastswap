import React from 'react'
import { ChainId } from '@blast/v2-sdk'
import { useWeb3React } from '@web3-react/core'
import { AlertTriangle } from 'react-feather'
import styled from 'styled-components'
import { ExternalLink } from '../../theme/components'
import { L2ChainInfo, getChainInfoOrDefault } from '../../constants/chainInfo'

const BodyRow = styled.div`
  color: ${({ theme }) => theme.primary1};
  font-size: 12px;
  font-weight: 485;
  font-size: 14px;
  line-height: 20px;
`

const Link = styled(ExternalLink)`
  color: ${({ theme }) => theme.black};
  text-decoration: underline;
`

const CautionTriangle = styled(AlertTriangle)`
  color: ${({ theme }) => theme.yellow1};
`

const TitleRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 8px;
`
const TitleText = styled.div`
  color: ${({ theme }) => theme.primary1};
  font-weight: 535;
  font-size: 16px;
  line-height: 24px;
  margin: 0px 12px;
`
const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.primary1};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.primary1};
  bottom: 60px;
  z-index: 2;
  display: none;
  max-width: 348px;
  padding: 16px 20px;
  position: fixed;
  right: 16px;
`

export function ChainConnectivityWarning() {
  const { chainId } = useWeb3React()
  const info = getChainInfoOrDefault(chainId)
  const label = info?.label

  return (
    <Wrapper>
      <TitleRow>
        <CautionTriangle />
        <TitleText>Network warning</TitleText>
      </TitleRow>
      <BodyRow>
        {chainId !== ChainId.SEPOLIA
          ? 'You may have lost your network connection.'
          : `${label} might be down right now, or you may have lost your network connection.`}{' '}
        {(info as L2ChainInfo).statusPage !== undefined && (
          <span>
            Check network status <Link href={(info as L2ChainInfo).statusPage || ''}>here.</Link>
          </span>
        )}
      </BodyRow>
    </Wrapper>
  )
}
