import React from 'react'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

interface IIconProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> {
  size?: number
  color?: string
  icon: React.ComponentType
}
export const Icon: React.FC<IIconProps> = (props) => {
  const { size, color, icon, style: styleArg, ...svgProps } = props

  const svgExtraProps: {
    width: string
    height: string
    style?: React.CSSProperties
  } = {
    width: '24px',
    height: '24px',
    style: {},
  }

  if (size !== undefined) {
    svgExtraProps.width = `${size}px`
    svgExtraProps.height = `${size}px`
  }

  if (color !== undefined) {
    svgExtraProps.style = { color, ...styleArg }
  }
  const IconComp: React.ComponentType = icon

  return <IconComp {...svgProps} {...svgExtraProps} />
}
