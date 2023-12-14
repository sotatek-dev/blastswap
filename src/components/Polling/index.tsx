import React from 'react'
import { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { MouseoverTooltip } from '../Tooltip'
import { ChainConnectivityWarning } from './ChainConnectivityWarning'
import { useBlockNumber } from '../../state/application/hooks'
import { RowFixed } from '../Row'
import { ExternalLink } from '../../theme'
import { Text, TextProps as TextPropsOriginal } from 'rebass'
import { useActiveWeb3React } from '../../hooks'
type TextProps = Omit<TextPropsOriginal, 'css'>

const StyledPolling = styled.div`
  align-items: center;
  bottom: 0;
  color: ${({ theme }) => theme.primary1};
  display: none;
  padding: 1rem;
  position: fixed;
  right: 0;
  transition: 250ms ease color;

  a {
    color: unset;
  }
  a:hover {
    color: unset;
    text-decoration: none;
  }

  @media screen and (min-width: ${768}px) {
    display: flex;
  }
`

const TextWrapper = styled(Text).withConfig({
  shouldForwardProp: prop => prop !== 'color'
})<{ color: keyof string }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

const DeprecatedSmall = (props: TextProps) => {
  return <TextWrapper fontWeight={485} fontSize={11} {...props} />
}

const StyledPollingBlockNumber = styled(DeprecatedSmall)<{
  breathe: boolean
  hovering: boolean
  warning: boolean
}>`
  color: ${({ theme, warning }) => (warning ? theme.yellow2 : theme.green1)};
  transition: opacity 0.25s ease;
  opacity: ${({ breathe, hovering }) => (hovering ? 0.7 : breathe ? 1 : 0.5)};
  :hover {
    opacity: 1;
  }

  a {
    color: unset;
  }
  a:hover {
    text-decoration: none;
    color: unset;
  }
`
const StyledPollingDot = styled.div<{ warning: boolean }>`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  border-radius: 50%;
  position: relative;
  background-color: ${({ theme, warning }) => (warning ? theme.yellow2 : theme.green1)};
  transition: 250ms ease background-color;
`

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div<{ warning: boolean }>`
  animation: ${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);

  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 2px solid ${({ theme, warning }) => (warning ? theme.yellow2 : theme.green1)};
  background: transparent;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  position: relative;
  transition: 250ms ease border-color;

  left: -3px;
  top: -3px;
`
const _20_SECONDS = 20 * 1000

export default function Polling() {
  const blockNumber = useBlockNumber()
  const [isMounting, setIsMounting] = useState(false)
  const [isHover, setIsHover] = useState(false)

  const { library } = useActiveWeb3React()

  const [blockTime, setBlockTime] = useState(Date.now())

  const warning = Boolean(!!blockTime && Date.now() - blockTime * 1000 > _20_SECONDS)

  useEffect(
    () => {
      if (!blockNumber) {
        return
      }

      library?.getBlock(blockNumber).then(block => {
        setBlockTime(block.timestamp)
      })

      setIsMounting(true)
      const mountingTimer = setTimeout(() => setIsMounting(false), 1000)

      // this will clear Timeout when component unmount like in willComponentUnmount
      return () => {
        clearTimeout(mountingTimer)
      }
    },
    [blockNumber] //useEffect will run only one time
    //if you pass a value to array, like this [data] than clearTimeout will run every time this value changes (useEffect re-run)
  )

  return (
    <RowFixed>
      <StyledPolling onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
        <StyledPollingBlockNumber breathe={isMounting} hovering={isHover} warning={warning}>
          <ExternalLink href={'https://sepolia.etherscan.io'}>
            <MouseoverTooltip text={'The most recent block number on this network. Prices update on every block.'}>
              {blockNumber}&ensp;
            </MouseoverTooltip>
          </ExternalLink>
        </StyledPollingBlockNumber>
        <StyledPollingDot warning={warning}>{isMounting && <Spinner warning={warning} />}</StyledPollingDot>{' '}
      </StyledPolling>
      {warning && <ChainConnectivityWarning />}
    </RowFixed>
  )
}
